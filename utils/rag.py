from functools import lru_cache

from transformers import AutoModelForCausalLM, AutoTokenizer

from utils.settings import (
    ANSWER_MODEL_FOLDER,
    ANSWER_MODEL_NAME,
    setup_environment,
)
from utils.vector_store import search_similar_chunks

setup_environment()

RELEVANCE_THRESHOLD = 0.35
RETRIEVAL_TOP_K = 10
MODEL_CONTEXT_CHUNKS = 5
MAX_CHUNK_CHARS = 1200


@lru_cache(maxsize=1)
def get_answer_model():
    model_path = (
        ANSWER_MODEL_FOLDER
        if ANSWER_MODEL_FOLDER.exists()
        else ANSWER_MODEL_NAME
    )

    tokenizer = AutoTokenizer.from_pretrained(
        str(model_path),
        fix_mistral_regex=True,
    )

    model = AutoModelForCausalLM.from_pretrained(
        str(model_path),
        dtype="auto",
    )

    return tokenizer, model


def prepare_context(sources):
    parts = []

    for source in sources:
        text = str(source.get("text", "")).strip()

        if not text:
            continue

        if len(text) > MAX_CHUNK_CHARS:
            text = text[:MAX_CHUNK_CHARS]

            last_period = text.rfind(".")
            if last_period > MAX_CHUNK_CHARS // 2:
                text = text[:last_period + 1]

        parts.append(text)

    return "\n\n".join(parts)


def make_messages(question, sources):
    context = prepare_context(sources)

    system_message = """
You are Legal Lens, an Indian law information assistant.

Answer the user's question using ONLY the legal context provided.

Rules:
- Give a direct and complete legal explanation.
- Use the actual rules, procedures and sections found in the context.
- Explain what the law means in practical terms.
- Distinguish between ownership/title and possession when relevant.
- Mention section numbers only when they appear in the context.
- Do not invent laws, sections, procedures, authorities or facts.
- Do not recommend consulting a lawyer unless the user specifically asks
  whether they should consult one.
- Do not recommend filing a police complaint unless the provided context
  specifically supports that step.
- Do not give generic disclaimers or filler.
- Do not mention sources, pages, scores, documents or retrieval.
- Do not reproduce the legal text word-for-word.
- If the context does not contain enough information, say so clearly.
""".strip()

    user_message = f"""
Legal context:
{context}

Question:
{question}

Give the best answer supported by the legal context.
""".strip()

    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]


def clean_answer(text):
    text = str(text).strip()

    for prefix in ("Answer:", "answer:", "Response:", "response:"):
        if text.startswith(prefix):
            text = text[len(prefix):].strip()

    return text


def answer_question(question):
    question = str(question).strip()

    if not question:
        return {
            "answer": "Please enter a legal question.",
            "sources": [],
        }

    try:
        sources = search_similar_chunks(
            question,
            top_k=RETRIEVAL_TOP_K,
        )
    except Exception as error:
        print(f"Retrieval error: {error}")
        return {
            "answer": "There was an error while searching the legal knowledge base.",
            "sources": [],
        }

    if not sources:
        return {
            "answer": "I could not find relevant information in the legal knowledge base.",
            "sources": [],
        }

    try:
        best_score = float(sources[0].get("score", 0))
    except (TypeError, ValueError):
        best_score = 0

    if best_score < RELEVANCE_THRESHOLD:
        return {
            "answer": "I could not find sufficiently relevant information in the legal knowledge base to answer this question reliably.",
            "sources": sources,
        }

    try:
        tokenizer, model = get_answer_model()

        messages = make_messages(
            question,
            sources[:MODEL_CONTEXT_CHUNKS],
        )

        prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=4096,
        )

        outputs = model.generate(
            **inputs,
            max_new_tokens=350,
            do_sample=False,
            repetition_penalty=1.08,
            no_repeat_ngram_size=3,
            pad_token_id=tokenizer.eos_token_id,
        )

        generated = outputs[0][inputs["input_ids"].shape[1]:]

        answer = clean_answer(
            tokenizer.decode(
                generated,
                skip_special_tokens=True,
            )
        )

        if not answer:
            raise RuntimeError("Empty model response.")

    except Exception as error:
        print(f"Generation error: {error}")
        answer = (
            "I found relevant legal information, but "
            "the answer could not be generated reliably."
        )

    return {
        "answer": answer,
        "sources": sources,
    }
from functools import lru_cache

from transformers import AutoModelForCausalLM, AutoTokenizer

from utils.settings import ANSWER_MODEL_FOLDER, ANSWER_MODEL_NAME, setup_environment
from utils.vector_store import search_similar_chunks

setup_environment()

RELEVANCE_THRESHOLD = 0.35
RETRIEVAL_TOP_K = 10
MODEL_CONTEXT_CHUNKS = 3
MAX_CHUNK_CHARS = 900


@lru_cache(maxsize=1)
def get_answer_model():
    model_path = ANSWER_MODEL_FOLDER if ANSWER_MODEL_FOLDER.exists() else ANSWER_MODEL_NAME

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
    context = []

    for source in sources:
        text = str(source.get("text", "")).strip()

        if not text:
            continue

        if len(text) > MAX_CHUNK_CHARS:
            text = text[:MAX_CHUNK_CHARS]
            last_period = text.rfind(".")

            if last_period >= MAX_CHUNK_CHARS * 0.5:
                text = text[:last_period + 1]

        context.append(text)

    return "\n\n".join(context)


def build_prompt(question, sources):
    context = prepare_context(sources)

    return [
        {
            "role": "system",
            "content": (
                "You are a legal information assistant specializing in Indian law. "
                "Answer the user's question using only the provided legal context. "
                "Do not invent laws, sections, procedures, penalties, facts, or legal "
                "advice. If the context does not contain enough information, say so. "
                "Give a direct, clear and complete answer in natural language. "
                "Mention section numbers only when supported by the context. "
                "Do not mention sources, pages, scores, documents, or retrieval. "
                "Do not copy the context word-for-word. "
                "This is general legal information, not professional legal advice."
            ),
        },
        {
            "role": "user",
            "content": f"Legal context:\n{context}\n\nQuestion:\n{question}",
        },
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

        print("\n========== RETRIEVAL RESULTS ==========")
        for i, source in enumerate(sources, 1):
            print(
                f"{i}. Score: {source.get('score')} | "
                f"Source: {source.get('source')} | "
                f"Page: {source.get('page')}"
            )
        print("========================================\n")

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
            "answer": (
                "I could not find sufficiently relevant information "
                "in the legal knowledge base to answer this question reliably."
            ),
            "sources": sources,
        }

    model_sources = sources[:MODEL_CONTEXT_CHUNKS]
    messages = build_prompt(question, model_sources)

    try:
        tokenizer, model = get_answer_model()

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
            max_new_tokens=300,
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
            "I found relevant legal information, but I could not "
            "generate a reliable answer."
        )

    return {
        "answer": answer,
        "sources": sources,
    }
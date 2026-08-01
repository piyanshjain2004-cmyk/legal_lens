from functools import lru_cache

from utils.settings import ANSWER_MODEL_FOLDER, ANSWER_MODEL_NAME, setup_environment

setup_environment()

from transformers import pipeline

from utils.vector_store import search_similar_chunks


@lru_cache(maxsize=1)
def get_answer_model():
    """
    Loads the text2text-generation pipeline model.
    Uses @lru_cache to load the model only once.
    """
    model_path = ANSWER_MODEL_FOLDER if ANSWER_MODEL_FOLDER.exists() else ANSWER_MODEL_NAME
    return pipeline("text2text-generation", model=str(model_path))


def make_prompt(question: str, sources: list[dict[str, str]]) -> str:
    """
    Creates a prompt for the language model with the given question and sources.
    Includes a one-shot example to guide the model's output format and style.
    """
    context = "\n\n".join(source["text"][:500] for source in sources)

    # A one-shot example to guide the model.
    example_context = "134. Duty of driver in case of accident and injury to a person.—When any person is injured... as a result of an accident in which a motor vehicle is involved, the driver of the vehicle... shall—(a) take all reasonable steps to secure medical attention for the injured person... (b) give on demand by a police officer any information required by him..."
    example_question = "What should I do if I'm in a car accident?"
    example_answer = """Short answer:
If you are in an accident, you must stop, help anyone who is injured, and report the accident to the police.

Steps or explanation:
1. Take all reasonable steps to get medical help for any injured person.
2. If a police officer asks for information, you must provide it.
3. Report the accident to the police as soon as you can.

Relevant law:
The Motor Vehicles Act, Section 134, states the duties of a driver in an accident."""

    # The final prompt for the user's question
    final_prompt = f"""You are a helpful legal information assistant. Answer the question based only on the provided context. Do not use outside knowledge.
If the context doesn't contain the answer, say "The provided documents do not contain enough information to answer this question."
Provide the answer in simple language and use the following format:
Short answer:
Steps or explanation:
Relevant law:

---
EXAMPLE

Context:
{example_context}

Question:
{example_question}

Answer:
{example_answer}

---
TASK

Context:
{context}

Question:
{question}

Answer:
"""
    return final_prompt.strip()

def is_stolen_phone_question(question: str) -> bool:
    """
    Checks if a question is about a stolen phone using keyword matching.
    This is a special case to provide a canned, high-quality answer.
    """
    text = question.lower()
    phone_words = ["phone", "mobile", "cell"]
    theft_words = ["stolen", "lost", "theft", "snatched", "snatching", "robbed"]
    return any(word in text for word in phone_words) and any(word in text for word in theft_words)


def answer_stolen_phone(sources: list[dict[str, str]]) -> str:
    """
    Generates a canned answer for stolen phone questions, including
    the top 3 unique sources found.
    """
    source_names = []

    for source in sources:
        source_name = f"{source['source']}, page {source['page']}"

        if source_name not in source_names:
            source_names.append(source_name)

    source_text = "\n".join(f"- {source_name}" for source_name in source_names[:3])

    return f"""
Short answer:
If your phone is stolen, first protect your accounts and SIM, then report the theft to the police.

Steps you can take:
1. Call your mobile network provider and block the SIM card.
2. Change passwords for important accounts linked to the phone, like email, banking, UPI, and social media.
3. Use Find My Device or Find My iPhone to lock the phone and erase data if needed.
4. Note your phone number, IMEI number, model name, bill details, and last known location.
5. File a police complaint or FIR for theft or snatching.
6. Keep the complaint copy safely because it may be needed for insurance, SIM replacement, or phone blocking.

Relevant law:
The sources found mention stolen communication devices under the Information Technology Act and theft or snatching under Bharatiya Nyaya Sanhita. These sources support that a stolen mobile phone can be treated as stolen property or a stolen communication device.

Sources matched:
{source_text}

This is general legal information only and not professional legal advice.
""".strip()


def answer_question(question: str) -> dict[str, object]:
    """
    Answers a question using the RAG pipeline.
    1. Searches for similar text chunks in the vector store.
    2. Handles special cases (e.g., stolen phone).
    3. Generates a prompt and gets an answer from the language model.
    """
    sources = search_similar_chunks(question, top_k=5)

    if not sources:
        return {
            "answer": "I could not find relevant information in the knowledge base.",
            "sources": [],
        }

    if is_stolen_phone_question(question):
        return {
            "answer": answer_stolen_phone(sources),
            "sources": sources,
        }

    prompt = make_prompt(question, sources)

    try:
        model = get_answer_model()
        result = model(prompt, max_new_tokens=300, do_sample=False)
        answer = result[0]["generated_text"].strip()
        # Add disclaimer only to successfully generated answers
        disclaimer = "\n\nThis is general legal information only and not professional legal advice."
        answer += disclaimer
    except Exception as e:
        # If the model fails, provide a fallback message
        print(f"Error generating answer with model: {e}")
        answer = (
            "I found relevant legal text, but the answer model could not generate a full response. "
            "Please read the sources shown below."
        )

    return {
        "answer": answer,
        "sources": sources,
    }

from utils.settings import (
    ANSWER_MODEL_FOLDER,
    ANSWER_MODEL_NAME,
    EMBEDDING_MODEL_FOLDER,
    EMBEDDING_MODEL_NAME,
    setup_environment,
)

setup_environment()

from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer


def download_embedding_model() -> None:
    print("Downloading embedding model...")

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    model.save(str(EMBEDDING_MODEL_FOLDER))

    print("Embedding model saved.")


def download_answer_model() -> None:
    print("Downloading answer model...")
    print(f"Model: {ANSWER_MODEL_NAME}")

    tokenizer = AutoTokenizer.from_pretrained(
        ANSWER_MODEL_NAME
    )

    model = AutoModelForCausalLM.from_pretrained(
        ANSWER_MODEL_NAME
    )

    ANSWER_MODEL_FOLDER.mkdir(
        parents=True,
        exist_ok=True,
    )

    tokenizer.save_pretrained(
        str(ANSWER_MODEL_FOLDER)
    )

    model.save_pretrained(
        str(ANSWER_MODEL_FOLDER)
    )

    print("Answer model saved.")


if __name__ == "__main__":

    download_embedding_model()

    download_answer_model()

    print("\nAll models are ready.")
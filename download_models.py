from utils.settings import (
    ANSWER_MODEL_FOLDER,
    ANSWER_MODEL_NAME,
    EMBEDDING_MODEL_FOLDER,
    EMBEDDING_MODEL_NAME,
    setup_environment,
)

setup_environment()

from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


def download_embedding_model() -> None:
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    model.save(str(EMBEDDING_MODEL_FOLDER))
    print("Embedding model saved.")


def download_answer_model() -> None:
    tokenizer = AutoTokenizer.from_pretrained(ANSWER_MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(ANSWER_MODEL_NAME)
    tokenizer.save_pretrained(str(ANSWER_MODEL_FOLDER))
    model.save_pretrained(str(ANSWER_MODEL_FOLDER))
    print("Answer model saved.")


if __name__ == "__main__":
    download_embedding_model()
    download_answer_model()
    print("All models are ready.")

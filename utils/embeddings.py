from functools import lru_cache

from utils.settings import (
    EMBEDDING_MODEL_FOLDER,
    EMBEDDING_MODEL_NAME,
    setup_environment,
)

setup_environment()

import numpy as np
from sentence_transformers import SentenceTransformer


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    if EMBEDDING_MODEL_FOLDER.exists():
        return SentenceTransformer(str(EMBEDDING_MODEL_FOLDER))

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    model.save(str(EMBEDDING_MODEL_FOLDER))
    return model


def create_embedding(text: str) -> list[float]:
    model = get_embedding_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def create_embeddings(texts: list[str]) -> np.ndarray:
    model = get_embedding_model()
    embeddings = model.encode(texts, normalize_embeddings=True)
    return np.array(embeddings, dtype="float32")

import os
from pathlib import Path


BASE_FOLDER = Path(__file__).resolve().parent.parent
MODELS_FOLDER = BASE_FOLDER / "models"
CACHE_FOLDER = MODELS_FOLDER / "cache"
EMBEDDING_MODEL_FOLDER = MODELS_FOLDER / "embedding_model"
ANSWER_MODEL_FOLDER = MODELS_FOLDER / "answer_model"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
ANSWER_MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"


def setup_environment() -> None:
    MODELS_FOLDER.mkdir(exist_ok=True)
    CACHE_FOLDER.mkdir(exist_ok=True)

    os.environ["USE_TF"] = "0"
    os.environ["USE_FLAX"] = "0"
    os.environ["USE_TORCH"] = "1"
    os.environ["TRANSFORMERS_NO_TF"] = "1"
    os.environ["HF_HOME"] = str(CACHE_FOLDER)
    os.environ["HF_HUB_CACHE"] = str(CACHE_FOLDER / "hub")
    os.environ["SENTENCE_TRANSFORMERS_HOME"] = str(CACHE_FOLDER / "sentence_transformers")
    os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
    os.environ["MPLCONFIGDIR"] = str(MODELS_FOLDER / "matplotlib_cache")

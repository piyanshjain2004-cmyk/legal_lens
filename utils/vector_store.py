import json
from pathlib import Path

import faiss
import numpy as np

from utils.embeddings import create_embedding, create_embeddings
from utils.pdf_loader import load_pdfs_from_folder
from utils.text_splitter import split_pages


BASE_FOLDER = Path(__file__).resolve().parent.parent
DATA_FOLDER = BASE_FOLDER / "data" / "law_pdfs"
VECTOR_FOLDER = BASE_FOLDER / "vector_db"
INDEX_FILE = VECTOR_FOLDER / "index.faiss"
CHUNKS_FILE = VECTOR_FOLDER / "chunks.json"
VERSION_FILE = VECTOR_FOLDER / "version.txt"
INDEX_VERSION = "2"


def build_vector_store() -> int:
    if INDEX_FILE.exists() and CHUNKS_FILE.exists() and VERSION_FILE.exists():
        if VERSION_FILE.read_text(encoding="utf-8").strip() == INDEX_VERSION:
            with CHUNKS_FILE.open("r", encoding="utf-8") as file:
                return len(json.load(file))

    return rebuild_vector_store()


def rebuild_vector_store() -> int:
    pages = load_pdfs_from_folder(DATA_FOLDER)

    if not pages:
        raise ValueError("No readable PDF text found in data/law_pdfs.")

    chunks = split_pages(pages)

    if not chunks:
        raise ValueError("PDFs were found, but no text chunks could be created.")

    texts = [str(chunk["text"]) for chunk in chunks]
    embeddings = create_embeddings(texts)

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    VECTOR_FOLDER.mkdir(exist_ok=True)
    faiss.write_index(index, str(INDEX_FILE))

    with CHUNKS_FILE.open("w", encoding="utf-8") as file:
        json.dump(chunks, file, ensure_ascii=False, indent=2)

    VERSION_FILE.write_text(INDEX_VERSION, encoding="utf-8")

    return len(chunks)


def get_chunk_count() -> int:
    if CHUNKS_FILE.exists():
        with CHUNKS_FILE.open("r", encoding="utf-8") as file:
            return len(json.load(file))

    return 0


def load_vector_store() -> tuple[faiss.Index, list[dict[str, str | int]]]:
    if not INDEX_FILE.exists() or not CHUNKS_FILE.exists():
        raise FileNotFoundError("Knowledge base not found. Please build it first.")

    index = faiss.read_index(str(INDEX_FILE))

    with CHUNKS_FILE.open("r", encoding="utf-8") as file:
        chunks = json.load(file)

    return index, chunks


def search_similar_chunks(question: str, top_k: int = 5) -> list[dict[str, str]]:
    index, chunks = load_vector_store()

    question_embedding = np.array([create_embedding(question)], dtype="float32")
    scores, positions = index.search(question_embedding, top_k)

    results: list[dict[str, str]] = []

    for score, position in zip(scores[0], positions[0]):
        if position == -1:
            continue

        chunk = chunks[int(position)]
        results.append(
            {
                "text": str(chunk["text"]),
                "source": str(chunk["source"]),
                "page": str(chunk["page"]),
                "score": f"{float(score):.3f}",
            }
        )

    return results

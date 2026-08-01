import re


def clean_text(text: str) -> str:
    text = re.sub(r"[_]{3,}", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def split_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size.")

    cleaned_text = clean_text(text)

    if not cleaned_text:
        return []

    chunks: list[str] = []
    start = 0

    while start < len(cleaned_text):
        end = start + chunk_size
        chunks.append(cleaned_text[start:end])
        start = end - overlap

    return chunks


def split_pages(pages: list[dict[str, str | int]]) -> list[dict[str, str | int]]:
    chunks: list[dict[str, str | int]] = []

    for page in pages:
        page_chunks = split_text(str(page["text"]))

        for chunk_number, chunk_text in enumerate(page_chunks, start=1):
            chunks.append(
                {
                    "text": chunk_text,
                    "source": str(page["source"]),
                    "page": int(page["page"]),
                    "chunk": chunk_number,
                }
            )

    return chunks

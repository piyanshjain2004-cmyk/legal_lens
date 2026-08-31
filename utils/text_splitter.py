import re


CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")
    text = re.sub(r"_{3,}", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def split_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:

    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if overlap < 0:
        raise ValueError("overlap cannot be negative.")

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size.")

    cleaned_text = clean_text(text)

    if not cleaned_text:
        return []

    sentences = re.split(
        r"(?<=[.!?])\s+",
        cleaned_text,
    )

    chunks: list[str] = []
    current_sentences: list[str] = []
    current_length = 0

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        sentence_length = len(sentence)

        if (
            current_sentences
            and current_length + sentence_length + 1 > chunk_size
        ):
            chunk = " ".join(current_sentences).strip()

            if chunk:
                chunks.append(chunk)

            overlap_sentences: list[str] = []
            overlap_length = 0

            for previous in reversed(current_sentences):

                if overlap_length + len(previous) + 1 > overlap:
                    break

                overlap_sentences.insert(0, previous)
                overlap_length += len(previous) + 1

            current_sentences = overlap_sentences
            current_length = overlap_length

        current_sentences.append(sentence)
        current_length += sentence_length + 1

    if current_sentences:

        chunk = " ".join(current_sentences).strip()

        if chunk:
            chunks.append(chunk)

    return chunks


def split_pages(
    pages: list[dict[str, str | int]],
) -> list[dict[str, str | int]]:

    chunks: list[dict[str, str | int]] = []

    for page in pages:

        page_text = str(page["text"])

        page_chunks = split_text(page_text)

        for chunk_number, chunk_text in enumerate(
            page_chunks,
            start=1,
        ):

            chunks.append(
                {
                    "text": chunk_text,
                    "source": str(page["source"]),
                    "page": int(page["page"]),
                    "chunk": chunk_number,
                }
            )

    return chunks

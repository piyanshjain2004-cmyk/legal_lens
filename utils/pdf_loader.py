from pathlib import Path

import fitz


def load_pdf_text(pdf_path: str | Path) -> list[dict[str, str | int]]:
    path = Path(pdf_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {path}")

    pages: list[dict[str, str | int]] = []

    try:
        with fitz.open(path) as document:
            for page_number, page in enumerate(document, start=1):
                text = page.get_text("text").strip()

                if text:
                    pages.append(
                        {
                            "source": path.name,
                            "page": page_number,
                            "text": text,
                        }
                    )

    except Exception as error:
        raise RuntimeError(
            f"Could not read PDF: {path.name}"
        ) from error

    return pages


def load_pdfs_from_folder(
    folder_path: str | Path,
) -> list[dict[str, str | int]]:

    folder = Path(folder_path)
    pdf_files = sorted(folder.rglob("*.pdf"))

    all_pages: list[dict[str, str | int]] = []

    for pdf_file in pdf_files:
        all_pages.extend(load_pdf_text(pdf_file))

    if not all_pages:
        raise ValueError(
            f"No readable PDF text found in {folder}"
        )

    return all_pages

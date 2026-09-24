from __future__ import annotations

import argparse
import os
import re
import tempfile
import unicodedata
from pathlib import Path

from docx import Document
from pypdf import PdfReader


def normalize(value: str) -> str:
    value = value.replace("Đ", "D").replace("đ", "d")
    value = "".join(
        character
        for character in unicodedata.normalize("NFD", value)
        if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[^A-Z0-9]+", "", value.upper())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("docx", type=Path)
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()

    docx_path = args.docx.resolve()
    pdf_path = args.pdf.resolve()
    document = Document(docx_path)
    reader = PdfReader(pdf_path)
    page_text = [normalize(page.extract_text() or "") for page in reader.pages]

    content_start_index = next(
        index
        for index, text in enumerate(page_text)
        if normalize("CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI") in text
        and index >= 10
    )
    unresolved: list[str] = []
    updated = 0
    in_generated_lists = False
    for paragraph in document.paragraphs:
        if paragraph.text.startswith("CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI\t"):
            in_generated_lists = True
        if paragraph.text == "DANH MỤC CHỮ VIẾT TẮT":
            in_generated_lists = False
        if not in_generated_lists or "\t" not in paragraph.text:
            continue

        label = paragraph.text.rsplit("\t", 1)[0]
        needle = normalize(label)
        matches = [
            index
            for index in range(content_start_index, len(page_text))
            if needle and needle in page_text[index]
        ]
        if not matches:
            unresolved.append(label)
            continue
        internal_page = matches[0] - content_start_index + 1
        paragraph.text = f"{label}\t{internal_page}"
        updated += 1

    if unresolved:
        raise RuntimeError("Không tìm thấy trang PDF cho: " + "; ".join(unresolved))

    with tempfile.NamedTemporaryFile(dir=docx_path.parent, suffix=".tmp.docx", delete=False) as handle:
        temporary = Path(handle.name)
    document.save(temporary)
    os.replace(temporary, docx_path)
    print(f"updated={updated} content_pages={len(reader.pages) - content_start_index}")


if __name__ == "__main__":
    main()

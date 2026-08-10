from types import SimpleNamespace

from app.services.retrieval import _bm25_rank, _reciprocal_rank_fusion, normalize_text


def _chunk(chunk_id: str, title: str, content: str):
    return SimpleNamespace(id=chunk_id, title=title, content=content)


def test_vietnamese_normalization_is_accent_insensitive():
    assert normalize_text("Đắk Lắk – Cà phê PHIN") == "dak lak ca phe phin"


def test_bm25_prioritizes_the_semantically_matching_catalog_chunk():
    chunks = [
        _chunk("trs1", "TRS1 Daily Phin", "Robusta đậm, caffeine cao, pha phin."),
        _chunk("bourbon", "Bourbon Langbiang", "Arabica thanh, pour-over, hương hoa."),
    ]

    assert _bm25_rank(chunks, "cà phê phin đậm caffeine cao", top_k=2)[0] == "trs1"


def test_reciprocal_rank_fusion_rewards_consensus_between_retrievers():
    ranked = _reciprocal_rank_fusion(
        bm25_ids=["a", "b", "c"],
        vector_ids=["b", "a", "d"],
        rrf_k=60,
        top_k=4,
    )

    assert ranked[:2] == ["a", "b"]
    assert set(ranked) == {"a", "b", "c", "d"}

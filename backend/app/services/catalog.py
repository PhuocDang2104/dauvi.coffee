from __future__ import annotations

import unicodedata
from collections.abc import Iterable

from app.schemas import ProductOut

ROAST_ORDER = {"light": 0, "light-medium": 1, "medium": 2, "medium-dark": 3, "dark": 4}


def _values(value: list[str] | None) -> set[str]:
    return set(value or [])


def _normalize_search(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.casefold().replace("đ", "d"))
    return " ".join("".join(char for char in decomposed if not unicodedata.combining(char)).split())


def _minimum_price(product: ProductOut) -> int:
    available = [variant.price.amount for variant in product.variants if variant.in_stock]
    return min(available) if available else 0


def filter_products(
    products: Iterable[ProductOut],
    *,
    q: str | None = None,
    species: list[str] | None = None,
    region: list[str] | None = None,
    process: list[str] | None = None,
    roast: list[str] | None = None,
    brew: list[str] | None = None,
    price: list[str] | None = None,
    format_: list[str] | None = None,
    min_price: int | None = None,
    max_price: int | None = None,
    sort: str = "featured",
) -> list[ProductOut]:
    result = list(products)
    term = _normalize_search(q or "")
    species_values = _values(species)
    region_values = _values(region)
    process_values = _values(process)
    roast_values = _values(roast)
    brew_values = _values(brew)
    price_values = _values(price)
    format_values = _values(format_)

    def matches(product: ProductOut) -> bool:
        searchable = _normalize_search(
            " ".join(
                [
                    product.display_name,
                    product.short_name,
                    product.variety,
                    product.region_label,
                    product.proposition,
                    *product.flavor.notes,
                ]
            )
        )
        minimum = _minimum_price(product)
        price_match = not price_values or any(
            (band == "under-120000" and minimum < 120_000)
            or (band == "120000-160000" and 120_000 <= minimum <= 160_000)
            or (band == "over-160000" and minimum > 160_000)
            for band in price_values
        )
        return (
            (not term or term in searchable)
            and (not species_values or product.species in species_values)
            and (not region_values or product.region_id in region_values)
            and (not process_values or product.process in process_values)
            and (not roast_values or product.roast_level in roast_values)
            and (not brew_values or bool(brew_values.intersection(product.brew_methods)))
            and (
                not format_values
                or any(
                    variant.in_stock and variant.format in format_values
                    for variant in product.variants
                )
            )
            and price_match
            and (min_price is None or minimum >= min_price)
            and (max_price is None or minimum <= max_price)
        )

    result = [product for product in result if matches(product)]
    if sort == "price-asc":
        result.sort(key=_minimum_price)
    elif sort == "price-desc":
        result.sort(key=_minimum_price, reverse=True)
    elif sort == "roast-asc":
        result.sort(key=lambda product: ROAST_ORDER.get(product.roast_level, 99))
    elif sort == "robusta-first":
        result.sort(key=lambda product: product.species != "robusta")
    elif sort == "arabica-first":
        result.sort(key=lambda product: product.species != "arabica")
    return result

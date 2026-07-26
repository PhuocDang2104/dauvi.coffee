from __future__ import annotations

from app.models import CoffeeLot, Product
from app.schemas import (
    CoffeeLotOut,
    EvidenceItemOut,
    FlavorProfileOut,
    MoneyOut,
    ProductImageOut,
    ProductOut,
    ProductVariantOut,
    TraceabilityEventOut,
)


def product_to_schema(product: Product) -> ProductOut:
    return ProductOut(
        id=product.id,
        slug=product.slug,
        display_name=product.display_name,
        short_name=product.short_name,
        proposition=product.proposition,
        species=product.species,
        scientific_name=product.scientific_name,
        variety=product.variety,
        segment=product.segment,
        role=product.role,
        region_id=product.region_id,
        region_label=product.region_label,
        altitude_label=product.altitude_label,
        process=product.process,
        roast_level=product.roast_level,
        flavor=FlavorProfileOut(
            bitterness=product.bitterness,
            acidity=product.acidity,
            sweetness=product.sweetness,
            body=product.body,
            aroma=product.aroma,
            notes=product.flavor_notes,
            caffeine=product.caffeine,
        ),
        brew_methods=product.brew_methods,
        story=product.story,
        variety_facts=product.variety_facts,
        badges=product.badges,
        accent=product.accent,
        pattern=product.pattern,
        image=ProductImageOut(src=product.image_src, alt=product.image_alt),
        variants=[
            ProductVariantOut(
                id=variant.id,
                sku=variant.sku,
                format=variant.format,
                weight_grams=variant.weight_grams,
                drip_bag_count=variant.drip_bag_count,
                drip_bag_weight_grams=variant.drip_bag_weight_grams,
                grind_options=variant.grind_options,
                price=MoneyOut(amount=variant.price_amount),
                compare_at_price=(
                    MoneyOut(amount=variant.compare_at_amount)
                    if variant.compare_at_amount is not None
                    else None
                ),
                in_stock=variant.in_stock,
            )
            for variant in product.variants
        ],
        featured_lot_code=product.featured_lot_code,
        published=product.published,
    )


def lot_to_schema(lot: CoffeeLot) -> CoffeeLotOut:
    return CoffeeLotOut(
        lot_code=lot.lot_code,
        product_id=lot.product_id,
        status=lot.status,
        farm_name=lot.farm_name,
        cooperative_name=lot.cooperative_name,
        province=lot.province,
        district=lot.district,
        region_id=lot.region_id,
        altitude_label=lot.altitude_label,
        harvest_year=lot.harvest_year,
        variety=lot.variety,
        process=lot.process,
        roast_date=lot.roast_date,
        packaging_date=lot.packaging_date,
        evidence_level=lot.evidence_level,
        demo_disclosure=lot.demo_disclosure,
        evidence=[
            EvidenceItemOut(
                key=item.key,
                label=item.label,
                value=item.value,
                level=item.level,
                source_label=item.source_label,
                source_reference=item.source_reference,
                verified_at=item.verified_at,
            )
            for item in lot.evidence
        ],
        timeline=[
            TraceabilityEventOut(
                id=event.id,
                stage=event.stage,
                title=event.title,
                date_label=event.date_label,
                description=event.description,
            )
            for event in lot.timeline
        ],
    )

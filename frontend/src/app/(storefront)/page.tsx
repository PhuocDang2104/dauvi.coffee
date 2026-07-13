import { getRepositories } from "@/lib/data-source";
import { HomeHero, CollectionOverview } from "@/features/home/components/hero-collection";
import { FlavorMapSection, FeaturedProductsSection } from "@/features/home/components/map-featured";
import { TasteSpectrum, TraceabilitySpotlight } from "@/features/home/components/trace-taste";
import { AdvisorCallout, BrewAtHome, HonestSustainability } from "@/features/home/components/advisor-sustainability";

export default async function HomePage() {
  const repositories = getRepositories();
  const [products, lots] = await Promise.all([
    repositories.products.getFeatured(),
    repositories.traceability.listFeaturedLots(),
  ]);
  const spotlightLot = lots.find((lot) => lot.lotCode === "TR4-DLK-26-N02") ?? lots[0];
  const spotlightProduct = products.find((product) => product.id === spotlightLot.productId) ?? products[0];

  return (
    <main id="main-content">
      <HomeHero products={products} />
      <CollectionOverview />
      <FlavorMapSection />
      <FeaturedProductsSection products={products} />
      <TraceabilitySpotlight product={spotlightProduct} lot={spotlightLot} />
      <TasteSpectrum products={products} />
      <AdvisorCallout />
      <HonestSustainability />
      <BrewAtHome />
    </main>
  );
}

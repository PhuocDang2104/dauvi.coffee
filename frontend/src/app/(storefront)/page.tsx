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
  return (
    <main id="main-content">
      <HomeHero />
      <CollectionOverview />
      <FlavorMapSection />
      <FeaturedProductsSection products={products} />
      <TraceabilitySpotlight products={products} lots={lots} />
      <TasteSpectrum products={products} />
      <AdvisorCallout />
      <HonestSustainability />
      <BrewAtHome />
    </main>
  );
}

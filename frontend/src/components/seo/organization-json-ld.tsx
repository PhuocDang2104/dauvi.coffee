import { BRAND_CONFIG } from "@/config/brand";
import { SEO_CONFIG } from "@/config/seo";
import { absoluteUrl, SITE_CONFIG } from "@/config/site";

import { JsonLd } from "./json-ld";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: BRAND_CONFIG.name,
        alternateName: BRAND_CONFIG.subtitle,
        url: SITE_CONFIG.url,
        logo: absoluteUrl("/brand/logo-mark.svg"),
        description: SEO_CONFIG.description,
        slogan: BRAND_CONFIG.tagline,
      }}
    />
  );
}

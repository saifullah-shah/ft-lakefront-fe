import { projects } from "@lakefront/content-model";
import { JsonLd } from "./json-ld";
import { siteConfig } from "../lib/site-config";

const siteUrl = siteConfig.siteUrl;

export function HomeStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lakefront Capital & Development",
    url: siteUrl,
    description: "A destination-development company creating distinct paths around Tarbela Lake.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lakefront Capital & Development",
    url: siteUrl,
    inLanguage: "en",
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lakefront locations",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${project.title} / ${project.statusLabel}`,
            url: `${siteUrl}/developments/${project.slug}`,
          })),
        }}
      />
    </>
  );
}

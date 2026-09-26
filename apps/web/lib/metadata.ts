import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

function absolute(path: string): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${suffix}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const canonical = absolute(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      siteName: "Lakefront Capital and Development",
      title,
      description,
      url: canonical,
      locale: "en_GB",
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

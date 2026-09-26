function readUrl(name: string, fallback: string): string {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") {
    return fallback;
  }
  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`${name} must be an absolute URL when set`);
  }
}

export const siteConfig = {
  siteUrl: readUrl("NEXT_PUBLIC_SITE_URL", "https://lakefrontcapital.example"),
  apiUrl: readUrl("NEXT_PUBLIC_API_URL", "http://localhost:4000"),
  contactReady: false,
  coordinatesPublished: false,
} as const;

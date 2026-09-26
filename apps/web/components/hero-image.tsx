import Image from "next/image";

/**
 * Hero media for the destination band.
 *
 * This is an illustrative reference image, not a verified photograph of the
 * locations, and must not be presented as one. The caption states this on
 * screen for the same reason the gallery carries rendering disclaimers.
 */
export function HeroImage() {
  return (
    <div className="hero-media">
      <div className="hero-media__frame" aria-hidden="true">
        <Image
          src="/images/hero-lake.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-media__image"
        />
        <span className="hero-media__mist" />
      </div>
      <p className="hero-media__label">Illustrative reference — not a photograph of the locations.</p>
    </div>
  );
}

import { getPublishedMediaAssets } from "@lakefront/content-model";

const kindLabels = {
  RENDERING: "Rendering",
  SITE_PHOTO: "Site photograph",
  DRONE: "Aerial image",
  DOCUMENT: "Document",
  VIDEO: "Video",
  PLACEHOLDER: "Awaiting approved media",
} as const;

export function MediaGallery({ projectSlug }: { projectSlug: string }) {
  const assets = getPublishedMediaAssets(projectSlug);

  if (assets.length === 0) {
    return null;
  }

  return (
    <div className="media-gallery">
      {assets.map((asset) => (
        <figure className="media-gallery__item" key={asset.id}>
          <div
            className={`media-gallery__frame ${asset.isRendering ? "media-gallery__frame--rendering" : ""}`}
            role="img"
            aria-label={asset.alt}
          >
            <span className="media-gallery__kind">{kindLabels[asset.kind]}</span>
          </div>
          <figcaption className="media-gallery__caption">
            <span className="media-gallery__title">{asset.title}</span>
            {asset.caption ? <span className="media-gallery__text">{asset.caption}</span> : null}
            {asset.credit ? <span className="media-gallery__credit">{asset.credit}</span> : null}
            {asset.isRendering ? (
              <span className="media-gallery__disclaimer">
                Concept rendering, not a photograph of a completed facility.
              </span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

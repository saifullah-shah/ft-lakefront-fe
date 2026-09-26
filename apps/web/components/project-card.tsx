import Link from "next/link";
import type { PublicProject } from "@lakefront/contracts";
import { StatusBadge } from "./status-badge";

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="project-card">
      <div className="project-card__topline">
        <span className="eyebrow">0{project.locationNumber} / 03</span>
        <StatusBadge status={project.status} />
      </div>
      <div
        className={`project-card__visual project-card__visual--${project.locationNumber}`}
        aria-hidden="true"
      >
        <span>{project.heroCaption}</span>
      </div>
      <div className="project-card__body">
        <h3>{project.title}</h3>
        <p>{project.shortDescription}</p>
        <Link className="text-link" href={`/developments/${project.slug}`}>
          Explore {project.title} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

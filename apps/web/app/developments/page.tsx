import type { Metadata } from "next";
import { ProjectCard } from "../../components/project-card";
import { SectionHeading } from "../../components/section-heading";
import { getProjects } from "../../lib/content";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Developments",
  description: "Explore the three Lakefront locations around Tarbela Lake.",
  path: "/developments",
});

export default async function DevelopmentsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">The developments</p>
            <h1>Different chapters around one lake.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Lakefront Capital and Development is presenting three distinct locations. Their status is part
              of the story: one land opportunity, one active development, and one future resort concept.
            </p>
            <p>No location is presented as bookable, complete, or financially guaranteed.</p>
          </div>
        </div>
      </section>
      <section className="project-section">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Choose a location"
            title="Start with the right context."
            description="Each page carries its own status, evidence, and enquiry path."
          />
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

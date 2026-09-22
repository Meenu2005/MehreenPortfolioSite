import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { portfolio, projects } from "@/data/portfolio";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: `Selected Work — ${portfolio.name}` },
    { name: "description", content: "Selected React and frontend development projects, approaches, and technologies." },
    { property: "og:title", content: `Selected Work — ${portfolio.name}` },
    { property: "og:description", content: "Explore selected React and frontend development projects." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <div className="page-shell">
      <SectionHeading eyebrow="Work / 03" title="Selected projects." copy="Replace these honest placeholders with your real projects, links, images, and outcomes when they are ready." />
      <div className="mt-14 grid gap-7">
        {projects.map((project, index) => <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />)}
      </div>
    </div>
  );
}
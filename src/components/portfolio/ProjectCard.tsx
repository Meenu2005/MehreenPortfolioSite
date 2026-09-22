import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/data/portfolio";

const accentStyles = {
  blue: "border-project/40 bg-project/5 text-project",
  wine: "border-primary/40 bg-primary/5 text-primary",
  moss: "border-connect/40 bg-connect/5 text-connect",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group grid overflow-hidden rounded-lg border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift lg:grid-cols-[0.8fr_1.2fr]">
      <div className={`relative flex min-h-64 items-center justify-center border-b p-8 lg:border-b-0 lg:border-r ${accentStyles[project.accent]}`}>
        <div className="absolute left-5 top-5 text-xs font-bold uppercase tracking-widest">0{index + 1} / {project.category}</div>
        <div className="grid size-20 place-items-center rounded-full border border-current/30 bg-surface/50">
          <Code2 className="size-8" aria-hidden="true" />
        </div>
        <span className="absolute bottom-5 right-5 text-xs text-muted-foreground">Project image placeholder</span>
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <h2 className="font-display text-3xl font-semibold">{project.title}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-bold text-foreground">Problem</dt><dd className="mt-1 leading-6 text-muted-foreground">{project.problem}</dd></div>
          <div><dt className="font-bold text-foreground">Solution</dt><dd className="mt-1 leading-6 text-muted-foreground">{project.solution}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => <span key={technology} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">{technology}</span>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-project px-4 py-2 text-sm font-semibold text-project-foreground">View project <ArrowUpRight className="size-4" /></a> : <span className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm text-muted-foreground">Live link to be added</span>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold">GitHub</a>}
        </div>
      </div>
    </article>
  );
}
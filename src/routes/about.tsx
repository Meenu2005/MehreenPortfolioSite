import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/portfolio/Button";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { portfolio } from "@/data/portfolio";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `About — ${portfolio.name}` },
    { name: "description", content: "Learn about this frontend developer's skills, education, experience, and approach." },
    { property: "og:title", content: `About — ${portfolio.name}` },
    { property: "og:description", content: "Skills, education, experience, and frontend development approach." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

function AboutPage() {
  const rows = [
    { label: "Education", content: portfolio.education },
    { label: "Skills", content: portfolio.skills.join(" · ") },
    { label: "Client work", content: portfolio.clientWork },
    { label: "Technologies", content: portfolio.technologies.join(" · ") },
  ];

  return (
    <div className="page-shell">
      <SectionHeading eyebrow="About / 02" title={portfolio.name} copy={portfolio.intro} />
      <div className="mt-14 border-t border-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">{row.label}</h2>
            <p className="text-lg leading-7 text-foreground">{row.content}</p>
          </div>
        ))}
        <div className="grid gap-3 border-b border-border py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Experience</h2>
          <ul className="grid gap-3 text-lg leading-7">
            {portfolio.experience.map((item) => <li key={item} className="flex gap-3"><span className="text-primary">↳</span>{item}</li>)}
          </ul>
        </div>
      </div>
      <div className="mt-10 flex justify-end"><LinkButton to="/connect" tone="connect">Let's connect <ArrowRight className="size-4" /></LinkButton></div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { portfolio, projects } from "@/data/portfolio";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      {
        title: `Selected Work — ${portfolio.name}`,
      },
      {
        name: "description",
        content:
          "Selected React and frontend development projects, approaches, and technologies.",
      },
      {
        property: "og:title",
        content: `Selected Work — ${portfolio.name}`,
      },
      {
        property: "og:description",
        content:
          "Explore selected React and frontend development projects.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: WorkPage,
});

const techIcons: Record<string, string> = {
  HTML: "https://cdn.simpleicons.org/html5",
  CSS: "https://cdn.simpleicons.org/css",
  JavaScript: "https://cdn.simpleicons.org/javascript",
  TypeScript: "https://cdn.simpleicons.org/typescript",
  React: "https://cdn.simpleicons.org/react",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs",
  Express: "https://cdn.simpleicons.org/express",
  PostgreSQL: "https://cdn.simpleicons.org/postgresql",
  Netlify: "https://cdn.simpleicons.org/netlify",
  Forumotion: "https://cdn.simpleicons.org/foro",
};

function WorkPage() {
  return (
    <main className="min-h-screen bg-black text-[#F5EFE6]">
      {/* Page intro */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28  text-center">
          <div className="text-center  ">
            <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.22em] text-[#dc651b] text-center">
              Work / 03
            </p>

            <h1 className="font-myfont text-5xl font-semibold leading-[0.95] text-[#E85D3F] sm:text-6xl lg:text-7xl">
              Selected projects.
            </h1>

            <p className="  mt-7 text-base leading-7 text-[#B8BDB8] sm:text-lg sm:leading-8">
              A selection of websites and applications I have designed,
              developed, customized, and brought to production.
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={`${project.title}-${index}`}
                className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-[#28323C]/70 bg-[#0C1117] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#dc651b] sm:p-9"
              >
                {/* subtle background glow */}
                <div
                  className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-[#641F32]/10 blur-3xl transition-opacity duration-500 group-hover:bg-[#A9485D]/15"
                  aria-hidden="true"
                />

                {/* Top */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-5">
                    {/* Website logo circle */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                      className="grid size-14 shrink-0 place-items-center rounded-full border border-[#28323C] bg-[#101711] transition-all duration-300 hover:border-[#E85D3F] hover:bg-[#641F32]"
                    >
                      {project.logo ? (
  <img
    src={project.logo}
    alt={`${project.title} logo`}
    className="size-8 object-contain"
  />
) : (
  <ExternalLink className="size-5 text-[#E85D3F]" />
)}
                    </a>

                    {/* Number */}
                    <span className="font-mono text-xs tracking-[0.2em] text-[#59635C]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Project name */}
                  <div className="mt-8">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87917F]">
                        {project.category}
                      </span>

                      <span className="size-1 rounded-full bg-[#E85D3F]" />
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group/title inline-flex items-center gap-3"
                    >
                      <h2 className="font-display text-3xl font-semibold text-[#E6D2B5] transition-colors duration-300 group-hover/title:text-[#E85D3F] sm:text-4xl">
                        {project.title}
                      </h2>

                      <ArrowUpRight className="size-5 text-[#68716B] transition-all duration-300 group-hover/title:-translate-y-1 group-hover/title:translate-x-1 group-hover/title:text-[#E85D3F]" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="mt-6 max-w-xl text-sm leading-7 text-[#A9ADA8] sm:text-base">
                    {project.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="relative z-10 mt-auto pt-10">
                  <div className="mb-4 h-px w-full bg-[#28323C]/70" />

                  <div className="flex flex-wrap items-center gap-3">
                    {project.technologies.map((technology) => {
                      const icon = techIcons[technology];

                      return (
                        <div
                          key={technology}
                          title={technology}
                          className="group/tech flex items-center gap-2 rounded-full border border-[#28323C] bg-[#101711] px-3 py-2 transition-colors duration-300 hover:border-[#641F32]"
                        >
                          {icon && (
                            <img
                              src={icon}
                              alt=""
                              className="size-4 opacity-65  transition-all duration-300 group-hover/tech:opacity-100 group-hover/tech:grayscale-0"
                            />
                          )}

                          <span className="text-xs font-medium text-[#87917F] transition-colors group-hover/tech:text-[#E6D2B5]">
                            {technology}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom statement */}
      <section className="border-t border-[#28323C]/50 bg-[#0C1117] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="max-w-3xl font-display text-4xl font-semibold leading-tight text-[#E6D2B5] sm:text-5xl">
            From structure and interaction to the final deployed experience.
          </p>
        </div>
      </section>
    </main>
  );
}
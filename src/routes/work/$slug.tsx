
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { caseStudies } from "@/data/caseStudies";

export const Route = createFileRoute("/work/$slug")({
  head: () => ({
    meta: [
      {
        title: "Case Study",
      },
      {
        name: "description",
        content:
          "Project case study covering the challenge, approach, development process, and final result.",
      },
    ],
  }),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { slug } = Route.useParams();

  const caseStudy = caseStudies.find(
    (item) => item.slug === slug
  );

  if (!caseStudy) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-[#F5EFE6]">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E85D3F]">
            404
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold text-[#E6D2B5]">
            Case study not found.
          </h1>

          <p className="mt-4 text-sm text-[#B8BDB8]">
            The project you're looking for doesn't exist.
          </p>

          <Link
            to="/work"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E85D3F] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            <ArrowLeft className="size-4" />
            Back to work
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-[#F5EFE6]">
      {/* Back navigation */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#87917F] transition-colors hover:text-[#E85D3F]"
          >
            <ArrowLeft className="size-4" />
            Back to work
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E85D3F]">
              {caseStudy.category}
            </p>

            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-[#E6D2B5] sm:text-6xl lg:text-8xl">
              {caseStudy.title}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-[#B8BDB8] sm:text-lg">
              {caseStudy.intro}
            </p>

            {/* Links */}
            <div className="mt-9 flex flex-wrap gap-3">
              {caseStudy.liveUrl && (
                <a
                  href={caseStudy.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E85D3F] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Visit Live Website
                  <ArrowUpRight className="size-4" />
                </a>
              )}

              {caseStudy.githubUrl && (
                <a
                  href={caseStudy.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#28323C] bg-[#101711] px-5 py-3 text-sm font-semibold text-[#E6D2B5] transition hover:border-[#E85D3F]"
                >
                  View Code
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project overview */}
      <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewItem
              label="Client"
              value={caseStudy.overview.client}
            />

            <OverviewItem
              label="Type"
              value={caseStudy.overview.type}
            />

            <OverviewItem
              label="Role"
              value={caseStudy.overview.role}
            />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87917F]">
                Technologies
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {caseStudy.overview.technologies.map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-[#28323C] bg-[#101711] px-3 py-1.5 text-xs text-[#B8BDB8]"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <SectionLabel number="01" title="The challenge" />

            <p className="max-w-3xl text-lg leading-9 text-[#B8BDB8] sm:text-xl sm:leading-10">
              {caseStudy.challenge}
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <SectionLabel number="02" title="My approach" />

            <p className="max-w-3xl text-lg leading-9 text-[#B8BDB8] sm:text-xl sm:leading-10">
              {caseStudy.approach}
            </p>
          </div>
        </div>
      </section>

      {/* Key points */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-14">
            <SectionLabel
              number="03"
              title="What I worked on"
            />
          </div>

          <div className="space-y-20">
            {caseStudy.keyPoints.map((point, index) => (
              <div
                key={point.title}
                className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
              >
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] text-[#59635C]">
                    0{index + 1}
                  </p>

                  <h2 className="mt-3 font-display text-3xl font-semibold text-[#E6D2B5] sm:text-4xl">
                    {point.title}
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#A9ADA8] sm:text-base">
                    {point.description}
                  </p>
                </div>

                {point.image && (
                  <div className="overflow-hidden rounded-[24px] border border-[#28323C]/70 bg-[#101711]">
                    <img
                      src={point.image}
                      alt={point.title}
                      className="block h-auto w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project gallery */}
      {caseStudy.images.length > 0 && (
        <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mb-14">
              <SectionLabel
                number="04"
                title="Project visuals"
              />
            </div>

            <div className="grid gap-6">
              {caseStudy.images.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-[28px] border border-[#28323C]/70 bg-[#101711]"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="block h-auto w-full"
                  />

                  {image.caption && (
                    <figcaption className="border-t border-[#28323C]/70 px-5 py-4 text-xs text-[#87917F]">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Result */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <SectionLabel number="05" title="The result" />

            <div>
              <p className="max-w-3xl text-lg leading-9 text-[#B8BDB8] sm:text-xl sm:leading-10">
                {caseStudy.result}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {caseStudy.liveUrl && (
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#E85D3F] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Visit Live Website
                    <ArrowUpRight className="size-4" />
                  </a>
                )}

                {caseStudy.githubUrl && (
                  <a
                    href={caseStudy.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#28323C] bg-[#101711] px-5 py-3 text-sm font-semibold text-[#E6D2B5] transition hover:border-[#E85D3F]"
                  >
                    GitHub
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom navigation */}
      <section className="bg-[#0C1117] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#87917F]">
                More work
              </p>

              <h2 className="mt-4 font-display text-3xl font-semibold text-[#E6D2B5] sm:text-4xl">
                Explore other projects.
              </h2>
            </div>

            <Link
              to="/work"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#28323C] bg-[#101711] px-5 py-3 text-sm font-semibold text-[#E6D2B5] transition hover:border-[#E85D3F]"
            >
              View all work
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#87917F]">
        {label}
      </p>

      <p className="mt-3 text-sm leading-6 text-[#E6D2B5]">
        {value}
      </p>
    </div>
  );
}


function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] text-[#E85D3F]">
        {number}
      </p>

      <h2 className="mt-3 font-display text-3xl font-semibold text-[#E6D2B5] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

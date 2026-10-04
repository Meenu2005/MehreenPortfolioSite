import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Layers3,
  Sparkles,
} from "lucide-react";

import { LinkButton } from "@/components/portfolio/Button";
import { portfolio } from "@/data/portfolio";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${portfolio.name}` },
      {
        name: "description",
        content:
          "Learn about Mehreen Rao, her frontend development experience, skills, education, and approach.",
      },
      {
        property: "og:title",
        content: `About — ${portfolio.name}`,
      },
      {
        property: "og:description",
        content:
          "Frontend development, experience, skills, and approach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-[#F5EFE6]">
      {/* Intro */}
      <section className="relative border-b border-[#28323C]/50">
        <div className="pointer-events-none absolute left-1/2 top-20 size-72 -translate-x-1/2 rounded-full bg-[#641F32]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
          {/* Larger and easier to notice */}
          <p className="mb-6 text-sm font-semibold tracking-[0.18em] text-[#dc651b]">
            About / 02
          </p>

          <h1 className="font-myfont text-[48px] font-semibold leading-[0.95] text-[#E85D3F] sm:text-[64px]">
            More than just
            <br />
            a frontend.
          </h1>

          <p className="mx-auto mt-9 max-w-2xl text-base leading-8 text-[#A9ADA8]">
            {portfolio.intro}
          </p>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-b border-[#28323C]/50bg-surface-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-16">
            <div className="flex items-start gap-3 text-[#E85D3F]">
              <Sparkles className="mt-1 size-5 shrink-0" />

              <span className="text-sm font-semibold tracking-[0.15em]">
                My approach
              </span>
            </div>

            <p className="max-w-4xl font-display text-[32px] font-medium leading-tight text-[#E85D3F] sm:text-[48px]">
              I care about the space between{" "}
              <span className="text-[#E85D3F]">good code</span> and a
              website that actually feels right.
            </p>
          </div>
        </div>
      </section>

      {/* What I bring */}
      <section className="border-b border-[#28323C]/50 bg-background">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
                The toolkit
              </p>

              <h2 className="font-display text-[32px] font-semibold text-[#E85D3F] sm:text-[48px]">
                What I bring to a project.
              </h2>
            </div>

            <Code2 className="hidden size-7 text-[#641F32] sm:block" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* React */}
            <div className="group rounded-3xl border border-[#28323C]/70bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Code2 className="size-5" />
                </div>

                <span className="text-sm text-[#59635C]">01</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E85D3F]">
                Frontend development
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                React interfaces with TypeScript, responsive layouts,
                reusable components, and attention to the details users
                actually notice.
              </p>
            </div>

            {/* UI */}
            <div className="group rounded-3xl border border-[#28323C]/70bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Layers3 className="size-5" />
                </div>

                <span className="text-sm text-[#59635C]">02</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E85D3F]">
                Responsive UI
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                Interfaces designed to feel intentional across desktop,
                tablet, and mobile rather than simply shrinking to fit.
              </p>
            </div>

            {/* Accessible */}
            <div className="group rounded-3xl border border-[#28323C]/70bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Sparkles className="size-5" />
                </div>

                <span className="text-sm text-[#59635C]">03</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E85D3F]">
                Thoughtful details
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                Interactions, spacing, typography, motion, and visual
                hierarchy that make the final experience feel considered.
              </p>
            </div>

            {/* Client */}
            <div className="group rounded-3xl border border-[#28323C]/70bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <BriefcaseBusiness className="size-5" />
                </div>

                <span className="text-sm text-[#59635C]">04</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E85D3F]">
                From idea to launch
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                From structure and development through integrations,
                responsive polish, and deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Background / Education */}
      <section className="border-b border-[#28323C]/50bg-surface-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          {/* Reduced column disparity + gap so label and education feel connected */}
          <div className="grid gap-10 lg:grid-cols-[minmax(220px,0.5fr)_1fr] lg:items-start lg:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-full border border-[#641F32] text-[#E85D3F]">
                  <GraduationCap className="size-6" />
                </div>

                <p className="text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
                  Where it started
                </p>
              </div>
            </div>

            <div className="border-l border-[#641F32]/60 pl-7 sm:pl-10">
              <p className="text-sm tracking-[0.15em] text-[#87917F]">
                Education
              </p>

              <p className="mt-3 text-2xl font-medium text-[#F5EFE6]">
                {portfolio.education}
              </p>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#87917F]">
                My development work has grown alongside practical client
                projects — learning through real interfaces, real
                requirements, and real deployment challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-b border-[#28323C]/50 bg-background">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
              Built through experience
            </p>

            <h2 className="mt-4 font-myfont font-display text-[32px] font-semibold text-[#E85D3F] sm:text-[48px]">
              Things I have actually worked on.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {portfolio.experience.map((item, index) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-3xl border border-[#28323C]/70bg-surface-card p-7"
              >
                <span className="font-mono text-[32px] text-[#641F32]">
                  0{index + 1}
                </span>

                <p className="mt-12 text-base leading-7 text-[#B8BDB8]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="border-b border-[#28323C]/50bg-surface-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          {/* Heading and tags are now visually grouped instead of pushed apart */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
                Current stack
              </p>

              <h2 className="font-myfont mt-3 font-display text-[32px] font-semibold text-[#E85D3F] sm:text-[48px]">
                Tools I build with.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {portfolio.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-[#28323C] px-4 py-2 text-sm font-medium text-[#87917F] transition-colors hover:border-[#641F32] hover:text-[#E85D3F]"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
            Next / Let's talk
          </p>

          <h2 className="mt-5 font-display text-[32px] font-semibold leading-tight text-[#E85D3F] sm:text-[48px]">
            Have something worth building?
          </h2>

          <div className="mt-9 flex justify-center">
            <LinkButton to="/connect" tone="connect">
              Let's connect
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
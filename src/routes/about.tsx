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
    <main className="min-h-screen overflow-hidden bg-black text-[#F5EFE6]">

      {/* Intro */}
      <section className="relative border-b border-[#28323C]/50">
        <div className="pointer-events-none absolute left-1/2 top-20 size-72 -translate-x-1/2 rounded-full bg-[#641F32]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">

          <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#dc651b]">
            About / 02
          </p>

          <h1 className="font-myfont text-5xl font-semibold leading-[0.95] text-[#E85D3F] sm:text-6xl lg:text-8xl">
            More than just
            <br />
            a frontend.
          </h1>

          <p className="mx-auto mt-9 max-w-2xl text-base leading-8 text-[#A9ADA8] sm:text-lg">
            {portfolio.intro}
          </p>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-20">

            <div className="flex items-start gap-3 text-[#E85D3F]">
              <Sparkles className="mt-1 size-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                My approach
              </span>
            </div>

            <p className="max-w-4xl font-display text-3xl font-medium leading-tight text-[#E6D2B5] sm:text-4xl lg:text-5xl">
              I care about the space between{" "}
              <span className="text-[#E85D3F]">good code</span> and a
              website that actually feels right.
            </p>
          </div>
        </div>
      </section>

      {/* What I bring */}
      <section className="border-b border-[#28323C]/50 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
                The toolkit
              </p>

              <h2 className="font-display text-3xl font-semibold text-[#E6D2B5] sm:text-4xl">
                What I bring to a project.
              </h2>
            </div>

            <Code2 className="hidden size-7 text-[#641F32] sm:block" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* React */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-[#0C1117] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Code2 className="size-5" />
                </div>

                <span className="text-xs text-[#59635C]">01</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E6D2B5]">
                Frontend development
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                React interfaces with TypeScript, responsive layouts,
                reusable components, and attention to the details users
                actually notice.
              </p>
            </div>

            {/* UI */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-[#0C1117] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Layers3 className="size-5" />
                </div>

                <span className="text-xs text-[#59635C]">02</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E6D2B5]">
                Responsive UI
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                Interfaces designed to feel intentional across desktop,
                tablet, and mobile rather than simply shrinking to fit.
              </p>
            </div>

            {/* Accessible */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-[#0C1117] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <Sparkles className="size-5" />
                </div>

                <span className="text-xs text-[#59635C]">03</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E6D2B5]">
                Thoughtful details
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#87917F]">
                Interactions, spacing, typography, motion, and visual
                hierarchy that make the final experience feel considered.
              </p>
            </div>

            {/* Client */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-[#0C1117] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-2xl bg-[#641F32]/15 text-[#E85D3F]">
                  <BriefcaseBusiness className="size-5" />
                </div>

                <span className="text-xs text-[#59635C]">04</span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[#E6D2B5]">
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
      <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>
              <div className="grid size-14 place-items-center rounded-full border border-[#641F32] text-[#E85D3F]">
                <GraduationCap className="size-6" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
                Where it started
              </p>

              {/* <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-[#E6D2B5] sm:text-5xl">
                Learning, building,
                <br />
                then building again.
              </h2> */}
            </div>

            <div className="border-l border-[#641F32]/60 pl-7 sm:pl-10">
              <p className="text-sm uppercase tracking-[0.18em] text-[#87917F]">
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
      <section className="border-b border-[#28323C]/50 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
              Built through experience
            </p>

            <h2 className="font-myfont mt-4 font-display text-4xl font-semibold text-[#E6D2B5] sm:text-5xl">
              Things I have actually worked on.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {portfolio.experience.map((item, index) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-3xl border border-[#28323C]/70 bg-[#0C1117] p-7"
              >
                <span className="font-mono text-4xl text-[#641F32]">
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
      <section className="border-b border-[#28323C]/50 bg-[#0C1117]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">

          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
                Current stack
              </p>

              <h2 className="font-myfont mt-3 font-display text-3xl font-semibold text-[#E6D2B5]">
                Tools I build with.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:max-w-xl sm:justify-end">
              {portfolio.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-[#28323C] px-4 py-2 text-xs font-medium text-[#87917F] transition-colors hover:border-[#641F32] hover:text-[#E6D2B5]"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
            Next / Let's talk
          </p>

          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[#E6D2B5] sm:text-6xl">
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
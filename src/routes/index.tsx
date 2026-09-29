import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";

import { LinkButton } from "@/components/portfolio/Button";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { portfolio, projects } from "@/data/portfolio";
import { FeedbackSection } from "@/components/portfolio/FeedbackSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: `${portfolio.name} — Frontend Developer`,
      },
      {
        name: "description",
        content:
          "A React frontend developer portfolio featuring selected work, experience, and a direct way to connect.",
      },
      {
        property: "og:title",
        content: `${portfolio.name} — Frontend Developer`,
      },
      {
        property: "og:description",
        content:
          "Explore selected React work, experience, and ways to connect.",
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
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#28323C]/50 bg-black">
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">

          {/* Availability */}
          <div className="reveal-up mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dc651b]">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-[#E85D3F] align-middle" />
              {portfolio.availability}
            </p>
          </div>

          {/* Main heading */}
          <div className="reveal-up max-w-4xl">
            <h1 className="font-myfont   leading-[0.98] tracking-tight text-[#E85D3F] sm:text-6xl lg:text-7xl">
              Have something worth building?
              <br />
              Let’s put it online.
              <span className="text-[#A9485D]">.</span>
            </h1>
          </div>

          {/* Description */}
          <div className="reveal-up delay-1 mt-7 max-w-2xl">
            <p className="text-base leading-7 text-[#B8BDB8] sm:text-lg sm:leading-8">
              I design and develop websites for agencies, creators, brands,
              and businesses, built around what you do, who you serve, and
              how you want to be seen.
            </p>
          </div>

          {/* Buttons */}
          <div className=" delay-1 mt-9 flex flex-wrap items-center justify-center gap-5">
            <LinkButton
              to="/work"
              
            >
              View my work
              <ArrowRight className="size-4" />
            </LinkButton>

            <LinkButton
              to="/about"
              tone="quiet"
            >
              About me
            </LinkButton>
          </div>

          {/* Bottom scroll indicator */}
          <div className="reveal-up delay-1 absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#68716B]">
              <span>Scroll to explore</span>
              <ArrowDown className="size-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <FeedbackSection />

      {/* Selected Work */}
      <section className="border-b border-[#28323C]/50 bg-[#0C1117] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between  text-[#E85D3F] ">
            <SectionHeading
              eyebrow="Selected work"
              title="Ideas shaped into useful, memorable interfaces."
              copy="A project collection ready for your real case studies. Every card is driven by one editable data file."
            />

            <LinkButton to="/work" tone="quiet">
              See all work
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>

          <div className="mt-12">
            {/* <ProjectCard project={projects[0]} index={0} /> */}
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="border-b border-[#28323C]/50 bg-black py-20 text-[#F5EFE6] sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E85D3F]">
              Let's connect / 03
            </p>

            <h2 className="mt-5 font-display text-5xl font-semibold leading-tight text-[#E6D2B5] sm:text-6xl">
              Have a project worth talking about?
            </h2>
          </div>

          <LinkButton
            to="/connect"
            tone="connect"
            className="shrink-0"
          >
            Start a conversation
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </section>
    </>
  );
}
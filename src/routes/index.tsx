
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";

import { LinkButton } from "@/components/portfolio/Button";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { FeedbackSection } from "@/components/portfolio/FeedbackSection";
import { portfolio } from "@/data/portfolio";

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
      <section className="relative overflow-hidden border-b border-[#28323C]/50 bg-background">
        <div
          className="
            relative mx-auto flex
            min-h-[calc(100svh-4rem)]
            max-w-5xl
            flex-col
            items-center
            justify-center
            px-5
            pb-24
            pt-16
            text-center
            sm:min-h-[calc(100vh-4rem)]
            sm:px-8
            sm:py-20
          "
        >
          {/* Availability */}
          <div className="reveal-up mb-6 sm:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dc651b] sm:text-xs sm:tracking-[0.22em]">
              <span className="mr-2 inline-block size-2 rounded-full bg-[#E85D3F] align-middle sm:size-2.5" />
              {portfolio.availability}
            </p>
          </div>

          {/* Main heading */}
          <div className="reveal-up w-full max-w-4xl">
            <h1
              className="
                font-myfont
                text-[2.65rem]
                leading-[0.98]
                tracking-tight
                text-[#E85D3F]
                sm:text-6xl
                sm:leading-[0.98]
                lg:text-7xl
              "
            >
              Have something worth building?
              <br />
              Let’s put it online
              <span className="text-[#A9485D]">.</span>
            </h1>
          </div>

          {/* Description */}
          <div className="reveal-up delay-1 mt-5 w-full max-w-2xl sm:mt-7">
            <p className="text-sm leading-6 text-[#B8BDB8] sm:text-lg sm:leading-8">
              I design and develop websites for agencies, creators, brands,
              and businesses, built around what you do, who you serve, and
              how you want to be seen.
            </p>
          </div>

          {/* Buttons */}
          <div
            className="
              reveal-up
              delay-1
              mt-7
              flex
              w-full
              flex-col
              items-stretch
              justify-center
              gap-3
              sm:mt-9
              sm:w-auto
              sm:flex-row
              sm:items-center
              sm:gap-5
            "
          >
            <LinkButton
              to="/work"
              className="w-full justify-center sm:w-auto"
            >
              View my work
              <ArrowRight className="size-4" />
            </LinkButton>

            <LinkButton
              to="/about"
              tone="quiet"
              className="w-full justify-center sm:w-auto"
            >
              About me
            </LinkButton>
          </div>

          {/* Bottom scroll indicator */}
          <div className="reveal-up delay-1 absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-8">
            <div className="flex items-center gap-2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-[#68716B] sm:text-[10px] sm:tracking-[0.2em]">
              <span>Scroll to explore</span>
              <ArrowDown className="size-3 sm:size-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <FeedbackSection />

      {/* Selected Work */}
      <section className="border-b border-[#28323C]/50 bg-surface-card py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-7 text-[#E85D3F] lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <SectionHeading
              eyebrow="Selected work"
              title="Ideas shaped into useful, memorable interfaces."
              copy="A collection of recent projects where I solved real-world problems through design and code."
            />

            <LinkButton
              to="/work"
              tone="quiet"
              className="self-start lg:self-auto"
            >
              See all work
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>

          <div className="mt-10 sm:mt-12">
            {/* <ProjectCard project={projects[0]} index={0} /> */}
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="border-b border-[#28323C]/50 bg-background py-16 text-[#F5EFE6] sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E85D3F] sm:text-xs sm:tracking-[0.2em]">
              Let's connect / 03
            </p>

            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-[#E85D3F] sm:mt-5 sm:text-6xl sm:leading-tight">
              Have a project worth talking about?
            </h2>
          </div>

          <LinkButton
            to="/connect"
            tone="connect"
            className="w-full shrink-0 justify-center sm:w-auto"
          >
            Start a conversation
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </section>
    </>
  );
}

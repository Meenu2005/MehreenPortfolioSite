import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LinkButton } from "@/components/portfolio/Button";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { FeedbackSection } from "@/components/portfolio/FeedbackSection";
import { portfolio } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${portfolio.name} — Frontend Developer` },
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const hero = heroRef.current;

    if (!page || !hero) return;

    const ctx = gsap.context(() => {
      /*
       * HERO TEXT ANIMATION
       */
      const letters =
        gsap.utils.toArray<HTMLElement>(
          ".hero-letter"
        );

      gsap.set(letters, {
        opacity: 1,
        y: 0,
        color: "transparent",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke:
          "1.5px currentColor",
      });

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      heroTimeline.to(letters, {
        color: "#E85D3F",
        WebkitTextFillColor: "#E85D3F",
        duration: 0.38,
        stagger: 0.055,
      });

      /*
       * STACKED PAGE EFFECT
       *
       * Feedback is intentionally excluded
       * from this sequence.
       *
       * The feedback section needs its own
       * natural height because it contains:
       *
       * heading
       * rating
       * comments
       *
       * After Feedback finishes, the next
       * section continues with the stacked effect.
       */

      const panels =
        gsap.utils.toArray<HTMLElement>(
          ".stack-panel"
        );

      panels.forEach((panel, index) => {
        if (index === 0) return;

        const previousPanel =
          panels[index - 1];

        if (!previousPanel) return;

        gsap.set(panel, {
          zIndex: index + 1,
        });

        gsap.fromTo(
          previousPanel,
          {
            scale: 1,
            y: 0,
            filter: "brightness(1)",
          },
          {
            scale: 0.94,
            y: -22,
            filter: "brightness(0.72)",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 100%",
              end: "top 20%",
              scrub: true,
            },
          }
        );

        /*
         * Shadow on the incoming stacked section.
         */
        gsap.fromTo(
          panel,
          {
            boxShadow:
              "0 -10px 35px rgba(0,0,0,0)",
          },
          {
            boxShadow:
              "0 -18px 45px rgba(0,0,0,0.28)",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 95%",
              end: "top 35%",
              scrub: true,
            },
          }
        );
      });
    }, page);

    return () => ctx.revert();
  }, []);

  const renderLetters = (
    text: string
  ) =>
    text.split("").map((char, index) => {
      if (char === " ") {
        return (
          <span
            key={index}
            className="hero-letter inline-block"
            aria-hidden="true"
          >
            &nbsp;
          </span>
        );
      }

      return (
        <span
          key={index}
          className="hero-letter inline-block"
          aria-hidden="true"
        >
          {char}
        </span>
      );
    });

  return (
    <div
      ref={pageRef}
      className="relative"
    >
      {/* =========================================================
          PAGE 01 - HERO
      ========================================================== */}

      <section
        ref={heroRef}
        className="stack-panel sticky top-16 z-[1] min-h-[calc(100svh-4rem)] overflow-hidden border-b border-[#28323C]/50 bg-background"
      >
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8 sm:py-20">
          <div className="reveal-up mb-6 sm:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dc651b] sm:text-xs sm:tracking-[0.22em]">
              <span className="mr-2 inline-block size-2 rounded-full bg-[#E85D3F] align-middle sm:size-2.5" />

              {portfolio.availability}
            </p>
          </div>

          <div className="w-full max-w-4xl">
            <h1 className="font-myfont text-[2.65rem] leading-[0.98] tracking-tight text-[#E85D3F] sm:text-6xl sm:leading-[0.98] lg:text-7xl">
              <span className="hero-line block">
                {renderLetters(
                  "Have something"
                )}
              </span>

              <span className="hero-line block">
                {renderLetters(
                  "worth building?"
                )}
              </span>

              <span className="hero-line block">
                {renderLetters(
                  "Let’s put it online"
                )}

                <span
                  className="hero-letter inline-block"
                  aria-hidden="true"
                >
                  .
                </span>
              </span>
            </h1>
          </div>

          <div className="reveal-up delay-1 mt-5 w-full max-w-2xl sm:mt-7">
            <p className="text-sm leading-6 text-[#B8BDB8] sm:text-lg sm:leading-8">
              I design and develop websites
              for agencies, creators, brands,
              and businesses, built around
              what you do, who you serve, and
              how you want to be seen.
            </p>
          </div>

          <div className="reveal-up delay-1 mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
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

          <div className="reveal-up delay-1 absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-8">
            <div className="flex items-center gap-2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-[#68716B] sm:text-[10px] sm:tracking-[0.2em]">
              <span>
                Scroll to explore
              </span>

              <ArrowDown className="size-3 sm:size-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PAGE 02 - FEEDBACK
          
          IMPORTANT:
          This section is NOT sticky.
          This section is NOT a stack-panel.
          
          It needs its full natural height so the user
          can scroll through:
          
          Heading
              ↓
          Rating
              ↓
          Comment input
              ↓
          Comments
              ↓
          End of Feedback
          
          Only after this section finishes does the
          next stacked section appear.
      ========================================================== */}

      <section className="relative z-[2] border-b border-[#28323C]/50 bg-background">
        <FeedbackSection />
      </section>

      {/* =========================================================
          PAGE 03 - SELECTED WORK
          
          Starts the stacked-page effect again after
          Feedback has completely finished.
      ========================================================== */}

      <section className="stack-panel sticky top-16 z-[3] min-h-[calc(100svh-4rem)] overflow-hidden border-b border-[#28323C]/50 bg-surface-card">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-28">
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

      {/* =========================================================
          PAGE 04 - CONNECT
      ========================================================== */}

      <section className="stack-panel sticky top-16 z-[4] min-h-[calc(100svh-4rem)] overflow-hidden border-b border-[#28323C]/50 bg-background text-[#F5EFE6]">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center gap-7 px-5 py-16 sm:px-8 sm:py-24 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E85D3F] sm:text-xs sm:tracking-[0.2em]">
              Let's connect / 03
            </p>

            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] text-[#E85D3F] sm:mt-5 sm:text-6xl sm:leading-tight">
              Have a project worth talking
              about?
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
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  GraduationCap,
  Layers3,
  Sparkles,
} from "lucide-react";
import resume from "@/assets/Resume/Mehreen_Rao_Resume_Updated.pdf";
import reactlearning from "@/assets/credential/react.png";
import prompt from "@/assets/credential/google prompt.png";
import ux from "@/assets/credential/ux.png";
import java from "@/assets/credential/java programming.png";
import basic from "@/assets/credential/Programming Basic.png";

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
  const certifications = [
    {
      title: "React: Creating and Hosting a Full-Stack Development",
      issuer: "LinkedIn Learning Community",
      date: "Issued Aug 2026",
      description:
        "Certificate covering React, full-stack development, and hosting a complete application.",
      image: reactlearning,
      link: "https://www.linkedin.com/learning/certificates/24ba94095b2ac948f6ee3376e8167ab768b26a589fe0b89141e69f84ee7f1025?trk=share_certificate",
    },
    {
      title: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "Professional Certificate",
      description:
        "Completed an 8-course series covering user research, wireframing, high-fidelity prototyping in Figma, and usability testing.",
      image: ux,
      link: "https://www.credly.com/",
    },
    {
      title: "Google Prompting Essentials",
      issuer: "Google",
      date: "Professional Certificate",
      description:
        "Mastered a 5-step framework for designing high-impact prompts and using AI for workflow optimization, data analysis, and multi-step problem solving.",
      image: prompt,
      link: "https://coursera.org/share/b78bd302afb354464535472634c98a6b",
    },
    {
      title: "Java Fundamentals Certification",
      issuer: "Great Learning",
      date: "Certification",
      description:
        "Certification covering the fundamentals of Java programming and core programming concepts.",
      image: java,
      link: "https://www.mygreatlearning.com/certificate/KIQWAISK?referrer_code=GLT4CIR2VGAY",
    },
    {
      title: "Programming Basics Certification",
      issuer: "Great Learning",
      date: "Certification",
      description:
        "Certification covering fundamental programming concepts and problem-solving basics.",
      image: basic,
      link: "https://www.mygreatlearning.com/certificate/IBXROKSC?referrer_code=GLT4CIR2VGAY",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-[#F5EFE6]">
      {/* Intro */}
      <section className="relative border-b border-[#28323C]/50">
        <div className="pointer-events-none absolute left-1/2 top-20 size-72 -translate-x-1/2 rounded-full bg-[#641F32]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
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

          {/* Download Resume */}
          <a
            href={resume}
            download={resume}
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#E85D3F] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-80"
          >
            <Download className="size-4" />
            <span>Download Resume</span>
          </a>
        </div>
      </section>

     

      {/* Education / Certifications */}
      <section className="border-b border-[#28323C]/50 bg-surface-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          {/* Education */}
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

              <p className="font-myfont mt-3 text-2xl font-medium text-[#E85D3F]">
                {portfolio.education}
              </p>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#87917F]">
                My development work has grown alongside practical client
                projects — learning through real interfaces, real
                requirements, and real deployment challenges.
                <br />
                CGPA : 3.6/4.0
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-20 border-t border-[#28323C]/50 pt-16 sm:mt-24 sm:pt-20">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-[0.15em] text-[#E85D3F]">
                Certifications
              </p>

              <h2 className="font-myfont mt-3 text-[32px] font-semibold leading-tight text-[#E85D3F] sm:text-[48px]">
                Learning beyond the classroom.
              </h2>
            </div>

            <div className="space-y-4">
              {certifications.map((certificate, index) => (
                <div
                  key={certificate.title}
                  className="group relative overflow-hidden rounded-3xl border border-[#28323C]/70 bg-background p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32] sm:p-6"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {/* Certificate image */}
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-[#28323C]/70 bg-surface-card sm:h-24 sm:w-36">
                      <img
                        src={certificate.image}
                        alt={`${certificate.title} certificate`}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Certificate information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="mb-2 text-xs font-medium tracking-[0.15em] text-[#87917F]">
                            0{index + 1} / {certificate.issuer}
                          </p>

                          <h3 className="text-lg font-semibold leading-snug text-[#E85D3F] sm:text-xl">
                            {certificate.title}
                          </h3>

                          <p className="mt-2 text-sm text-[#87917F]">
                            {certificate.date}
                          </p>

                          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#A9ADA8]">
                            {certificate.description}
                          </p>
                        </div>

                        {/* Credential link */}
                        <a
                          href={certificate.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${certificate.title} credential`}
                          className="grid size-11 shrink-0 place-items-center rounded-full border border-[#641F32]/70 text-[#E85D3F] transition-all duration-300 hover:border-[#E85D3F] hover:bg-[#641F32]/15 hover:rotate-45"
                        >
                          <ArrowUpRight className="size-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            {/* Frontend development */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
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

            {/* Responsive UI */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
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

            {/* Thoughtful details */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
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

            {/* From idea to launch */}
            <div className="group rounded-3xl border border-[#28323C]/70 bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#641F32]">
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
        </div>
      </section>

      {/* Technologies */}
      {/* <section className="border-b border-[#28323C]/50 bg-surface-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
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
      </section> */}

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
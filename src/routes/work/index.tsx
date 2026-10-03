import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import forumotionIcon from "@/assets/forumotion.png";

// @ts-ignore -- Firebase config is shipped as JS.
import { db } from "@/firebase/config";

import { portfolio, projects } from "@/data/portfolio";

export const Route = createFileRoute("/work/")({
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
 Forumotion: forumotionIcon,
};

type ApprovedReview = {
  id: string;
  projectTitle: string;
  clientName: string;
  profilePhoto: string;
  reviewText: string;
  status: "approved";
  createdAt?: Timestamp;
};

function WorkPage() {
  const [approvedReviews, setApprovedReviews] = useState<
    ApprovedReview[]
  >([]);

  useEffect(() => {
    const reviewsQuery = query(
      collection(db, "projectReviews"),
      where("status", "==", "approved")
    );

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const reviews: ApprovedReview[] = snapshot.docs.map(
          (item) => {
            const data = item.data();

            return {
              id: item.id,
              projectTitle: data["projectTitle"] || "",
              clientName: data["clientName"] || "",
              profilePhoto: data["profilePhoto"] || "",
              reviewText: data["reviewText"] || "",
              status: "approved",
              createdAt: data["createdAt"],
            };
          }
        );

        setApprovedReviews(reviews);
      },
      (error) => {
        console.error(
          "Error loading approved reviews:",
          error
        );
      }
    );

    return unsubscribe;
  }, []);

  return (
    <main className="min-h-screen bg-background text-[#F5EFE6]">
      {/* Page intro */}
      <section className="border-b border-[#28323C]/50">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <div className="text-center">
            {/* Sentence case instead of long all-caps */}
            <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-[#dc651b]">
              Work / 03
            </p>

            <h1 className="font-myfont text-5xl font-semibold leading-[0.95] text-[#E85D3F] sm:text-6xl lg:text-7xl">
              Selected projects.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-[#B8BDB8] sm:text-lg sm:leading-8">
              A selection of websites and applications I have designed,
              developed, customized, and brought to production.
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => {
              const review = approvedReviews.find(
                (item) =>
                  item.projectTitle === project.title
              );

              return (
                <article
                  key={`${project.title}-${index}`}
                  className="group relative flex min-h-[470px] flex-col overflow-hidden rounded-[28px] border border-[#28323C]/70bg-surface-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#dc651b] sm:p-9"
                >
                  {/* Subtle background glow */}
                  <div
                    className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-[#641F32]/10 blur-3xl transition-opacity duration-500 group-hover:bg-[#A9485D]/15"
                    aria-hidden="true"
                  />

                  {/* Top */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-6">
                      {/* Website logo */}
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

                      {/* Technologies + Number */}
                      <div className="flex min-w-0 flex-1 items-start justify-end gap-4 sm:gap-6">
                        {/* Technologies */}
                        <div className="flex min-w-0 flex-wrap justify-end gap-1.5 sm:gap-2">
                          {project.technologies.map((technology) => {
                            const icon = techIcons[technology];

                            return (
                              <div
                                key={technology}
                                title={technology}
                                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#28323C] bg-surface-input px-2 py-1.5 sm:px-2.5"
                              >
                                {icon && (
                                  <img
                                    src={icon}
                                    alt=""
                                    className="size-3.5 shrink-0"
                                  />
                                )}

                                <span className="hidden text-xs font-medium sm:inline text-theme-text">
                                  {technology}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Project Number */}
                        <span className="mt-1 shrink-0 font-mono text-xs tracking-[0.15em] text-[#59635C] sm:tracking-[0.2em]">
                          0{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Project name */}
                    <div className="mt-8">
                      {/* Consistent metadata label */}
                      <div className="mb-3 flex min-h-5 items-center gap-3">
                        <span className="text-xs font-semibold tracking-[0.16em] text-[#87917F]">
                          {project.category || "Project"}
                        </span>

                        <span
                          className="size-1 shrink-0 rounded-full bg-[#E85D3F]"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Fixed title area so buttons align */}
                      <div className="flex min-h-[92px] items-start">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="group/title inline-flex items-start gap-3"
                        >
                          <h2 className="font-display text-3xl font-semibold leading-tight text-theme-text transition-colors duration-300 group-hover/title:text-[#E85D3F] sm:text-4xl">
                            {project.title}
                          </h2>

                          <ArrowUpRight className="mt-1 size-5 shrink-0 text-[#68716B] transition-all duration-300 group-hover/title:-translate-y-1 group-hover/title:translate-x-1 group-hover/title:text-[#E85D3F]" />
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#A9ADA8] sm:text-base">
                      {project.description}
                    </p>

                    {/* Case Study Button */}
                    <div className="mt-6 min-h-[42px]">
                      {project.caseStudySlug && (
                        <Link
                          to="/work/$slug"
                          params={{
                            slug: project.caseStudySlug,
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-[#E85D3F]/60 bg-[#E85D3F] px-4 py-2.5 text-xs font-bold text-[#101711] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E6D2B5] hover:text-[#101711]"
                        >
                          View Case Study
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Bottom / Client Review */}
                  <div className="relative z-10 mt-auto pt-10">
                    <div className="mb-6 h-px w-full bg-[#28323C]/70" />

                    {review && (
                      <div className="rounded-2xl border border-[#28323C]/70 bg-[#101711]/60 p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-xs font-semibold tracking-[0.16em] text-[#E85D3F]">
                            Client review
                          </span>
                        </div>

                        <div className="flex items-start gap-4">
                          {review.profilePhoto ? (
                            <img
                              src={review.profilePhoto}
                              alt={review.clientName}
                              className="size-11 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F1E9D8] text-sm font-semibold text-[#641F32]">
                              {review.clientName
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm leading-6 text-[#D7D9D5]">
                              “{review.reviewText}”
                            </p>

                            <p className="mt-3 text-xs font-semibold text-theme-text">
                              {review.clientName}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom statement */}
      <section className="border-t border-[#28323C]/50bg-surface-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#E85D3F]">
              Have a project in mind?
            </p>

            <p className="mt-5 font-display text-4xl font-semibold leading-tight text-theme-text sm:text-5xl">
              From structure and interaction to the final deployed experience.
            </p>

            {/* Clear next step */}
            <Link
              to="/connect"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#E85D3F]/60 bg-[#E85D3F] px-5 py-3 text-sm font-bold text-[#101711] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E6D2B5]"
            >
              Let&apos;s connect
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
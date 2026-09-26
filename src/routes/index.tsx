import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { ActionButton, LinkButton } from "@/components/portfolio/Button";
import { PortraitPlaceholder } from "@/components/portfolio/PortraitPlaceholder";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { portfolio, projects } from "@/data/portfolio";
import { FeedbackSection } from "@/components/portfolio/FeedbackSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${portfolio.name} — Fontend Developer` },
      { name: "description", content: "A React frontend developer portfolio featuring selected work, experience, and a direct way to connect." },
      { property: "og:title", content: `${portfolio.name} — Frontend Developer` },
      { property: "og:description", content: "Explore selected React work, experience, and ways to connect." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [notice, setNotice] = useState<"rating" | "comment" | null>(null);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:py-16">
          <div className="reveal-up">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-connect/30 bg-connect/5 px-3 py-1.5 text-xs font-semibold text-connect">
              <span className="size-1.5 rounded-full bg-connect shadow-status" aria-hidden="true" /> {portfolio.availability}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[0.92] sm:text-3xl lg:text-5xl">
             Have something worth building? <br />Let’s put it online.<span className="text-primary">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-muted-foreground sm:text-xl">
               I design and develop websites for agencies, creators, brands, and businesses, built around what you do, who you serve, and how you want to be seen.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton to="/work" tone="project">View my work <ArrowRight className="size-4" /></LinkButton>
              <LinkButton to="/about" tone="quiet">About me</LinkButton>
            </div>
            <div className="mt-12 grid max-w-xl gap-5 border-t border-border pt-6 sm:grid-cols-2">
              {/* <button type="button" onClick={() => setNotice("rating")} className="group text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio rating</span>
                <span className="mt-2 flex items-center gap-1 text-rating">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-5 fill-current transition-transform group-hover:-translate-y-0.5" />)}
                </span>
              </button> */}
              {/* <button type="button" onClick={() => setNotice("comment")} className="group flex items-center gap-3 text-left">
                <span className="grid size-10 place-items-center rounded-full bg-comment/10 text-comment"><MessageSquare className="size-5" /></span>
                <span><span className="block text-sm font-bold">Comments & suggestions</span><span className="text-xs text-muted-foreground">Join the conversation</span></span>
              </button> */}
              
            </div>
           
            {notice && (
              <div className="mt-5 flex max-w-xl items-start justify-between gap-4 rounded-md border border-border bg-surface p-4 text-sm shadow-soft" role="status">
                <p><strong className="capitalize">{notice}</strong> will open after Google sign-in in the next milestone.</p>
                <ActionButton tone="quiet" className="min-h-8 px-2 py-1 text-xs" onClick={() => setNotice(null)}>Close</ActionButton>
              </div>
            )}
          </div>
          <div className="reveal-up delay-1 lg:pl-6">
            <PortraitPlaceholder />
            <div className="mt-5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Profile / 01</span><span className="flex items-center gap-2">Scroll to explore <ArrowDown className="size-4" /></span>
            </div>
          </div>
        </div>
      </section>
 <FeedbackSection />
      <section className="border-b border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Selected work" title="Ideas shaped into useful, memorable interfaces." copy="A project collection ready for your real case studies. Every card is driven by one editable data file." />
            <LinkButton to="/work" tone="quiet">See all work <ArrowRight className="size-4" /></LinkButton>
          </div>
          <div className="mt-12"><ProjectCard project={projects[0]} index={0} /></div>
        </div>
      </section>

      <section className="bg-foreground py-20 text-background sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Let's connect / 03</p>
            <h2 className="mt-5 font-display text-5xl font-semibold leading-tight sm:text-6xl">Have a project worth talking about?</h2>
          </div>
          <LinkButton to="/connect" tone="connect" className="shrink-0">Start a conversation <ArrowRight className="size-4" /></LinkButton>
        </div>
      </section>
    </>
  );
}

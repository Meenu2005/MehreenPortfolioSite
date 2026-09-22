import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { LinkButton, ActionButton } from "@/components/portfolio/Button";
import { portfolio } from "@/data/portfolio";

export const Route = createFileRoute("/connect")({
  head: () => ({ meta: [
    { title: `Let's Connect — ${portfolio.name}` },
    { name: "description", content: "Start a direct conversation about frontend development and project opportunities." },
    { property: "og:title", content: `Let's Connect — ${portfolio.name}` },
    { property: "og:description", content: "Start a direct conversation about a project or opportunity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ConnectPage,
});

function ConnectPage() {
  const [draft, setDraft] = useState("");
  const [showGate, setShowGate] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (draft.trim()) setShowGate(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-5"><LinkButton to="/" tone="quiet"><ArrowLeft className="size-4" /> Back home</LinkButton></div>
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-lift">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="relative grid size-11 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">YN<span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-connect" /></span>
            <div><h1 className="font-display text-xl font-semibold">{portfolio.name}</h1><p className="text-xs text-muted-foreground">Usually replies within a day</p></div>
          </div>
          <span className="hidden items-center gap-2 text-xs font-semibold text-connect sm:flex"><span className="size-1.5 rounded-full bg-connect" /> Available</span>
        </header>
        <div className="flex min-h-[28rem] flex-col justify-between bg-chat p-5 sm:p-8">
          <div className="max-w-md rounded-lg rounded-bl-sm border border-connect/25 bg-surface/90 p-5 shadow-soft">
            <p className="font-semibold">Hi — thanks for stopping by.</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Share what you are working on, and this conversation will continue here once secure sign-in is enabled.</p>
            <p className="mt-3 text-right text-xs text-muted-foreground">Now</p>
          </div>
          {showGate && (
            <div className="mx-auto my-6 max-w-md rounded-lg border border-primary/25 bg-primary/5 p-5 text-center">
              <LockKeyhole className="mx-auto size-5 text-primary" />
              <p className="mt-3 font-semibold">Google sign-in comes next</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Your draft is still here. Secure messaging will be connected in the backend milestone.</p>
            </div>
          )}
        </div>
        <form onSubmit={submit} className="flex items-end gap-3 border-t border-border bg-surface p-4 sm:p-5">
          <label className="sr-only" htmlFor="message">Write a message</label>
          <textarea id="message" rows={2} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20" />
          <ActionButton type="submit" tone="connect" aria-label="Send message"><Send className="size-4" /><span className="hidden sm:inline">Send</span></ActionButton>
        </form>
      </section>
    </div>
  );
}
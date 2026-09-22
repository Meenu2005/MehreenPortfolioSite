import { ImagePlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PortraitPlaceholder() {
  return (
    <div className="portrait-frame relative isolate min-h-[31rem] overflow-hidden border border-border bg-portrait">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      <div className="relative flex h-full min-h-[31rem] flex-col items-center justify-center px-8 text-center">
        <div className="grid size-16 place-items-center rounded-full border border-border bg-surface/80 shadow-soft">
          <ImagePlus className="size-7 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-5 font-display text-2xl font-semibold">Your portrait</p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Temporary placeholder — replace with your profile photo when ready.</p>
      </div>
      <Link to="/about" className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-between border-t border-border bg-surface/90 px-5 text-sm font-bold uppercase tracking-wide backdrop-blur-md transition-colors hover:bg-muted">
        About me <ArrowMark />
      </Link>
    </div>
  );
}

function ArrowMark() {
  return <span aria-hidden="true">↗</span>;
}
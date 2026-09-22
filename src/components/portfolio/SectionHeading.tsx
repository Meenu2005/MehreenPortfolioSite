export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary">
        <span className="h-px w-8 bg-primary" aria-hidden="true" /> {eyebrow}
      </p>
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
      {copy && <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy}</p>}
    </div>
  );
}
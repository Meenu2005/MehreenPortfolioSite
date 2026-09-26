import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type Tone = "primary" | "connect" | "comment" | "project" | "quiet";

const tones: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  connect: "bg-connect text-connect-foreground hover:bg-connect/90",
  comment: "bg-comment text-comment-foreground hover:bg-comment/90",
  project: "bg-project text-project-foreground hover:bg-project/90",
  quiet: "border border-border bg-surface text-foreground hover:bg-muted",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px";

type LinkButtonProps = {
  to: "/" | "/about" | "/work" | "/connect";
  children: ReactNode;
  tone?: Tone;
  className?: string;
  onClick?: () => void;
};
export function LinkButton({
  to,
  children,
  tone = "primary",
  className = "",
  onClick,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${base} ${tones[tone]} ${className}`}
    >
      {children}
    </Link>
  );
}
type ActionButtonProps = ComponentProps<"button"> & { tone?: Tone };

export function ActionButton({ tone = "primary", className = "", ...props }: ActionButtonProps) {
  return <button className={`${base} ${tones[tone]} ${className}`} {...props} />;
}
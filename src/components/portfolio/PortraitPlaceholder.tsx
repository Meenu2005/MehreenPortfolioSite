import { Link } from "@tanstack/react-router";
import profileImage from "../../assets/profile.png";

export function PortraitPlaceholder() {
  return (
    <div className="portrait-frame relative isolate min-h-[31rem] overflow-hidden border border-border bg-portrait">
      <img
        src={profileImage}
        alt="Mehreen"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <Link
        to="/about"
        className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-between border-t border-border bg-surface/90 px-5 text-sm font-bold uppercase tracking-wide backdrop-blur-md transition-colors hover:bg-muted"
      >
        About me <ArrowMark />
      </Link>
    </div>
  );
}

function ArrowMark() {
  return <span aria-hidden="true">↗</span>;
}
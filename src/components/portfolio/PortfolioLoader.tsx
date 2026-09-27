
import { useEffect, useState } from "react";

import avatarVideo from "@/assets/loader/avatar-wave.mp4";

const messages = [
  "Hey, welcome!",
  "Just a second...",
  "Almost there...",
] as const;

type PortfolioLoaderProps = {
  onLoaded?: () => void;
};

export function PortfolioLoader({
  onLoaded,
}: PortfolioLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Message animation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex(
        (current) => (current + 1) % messages.length
      );
    }, 1600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // Finish loader when page is loaded
  useEffect(() => {
    const finishLoading = () => {
      onLoaded?.();
    };

    if (document.readyState === "complete") {
      const timer = window.setTimeout(finishLoading, 1600);

      return () => {
        window.clearTimeout(timer);
      };
    }

    window.addEventListener("load", finishLoading);

    return () => {
      window.removeEventListener("load", finishLoading);
    };
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#000]">
      <div className="flex w-full max-w-sm flex-col items-center px-6 text-center">

        {/* Avatar Video */}
        <div className="relative h-[320px] w-[280px] sm:h-[360px] sm:w-[320px]">
          <video
            src={avatarVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>

        {/* Message */}
        <div className="mt-1 h-8">
          <p
            key={messageIndex}
            className="animate-[fadeIn_0.35s_ease-out] text-sm font-medium tracking-wide text-[#641F32]"
          >
            {messages[messageIndex] ?? "Just a second..."}
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-5 w-full max-w-[260px]">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#87917F]">
            <span>Loading</span>
            <span></span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#E6D2B5]/60">
            <div className="h-full w-[45%] animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-[#A9485D]" />
          </div>
        </div>

      </div>
    </div>
  );
}


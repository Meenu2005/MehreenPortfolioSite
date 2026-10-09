import { Link, useRouterState } from "@tanstack/react-router";
import {
  LogIn,
  LogOut,
  Menu,
  Shield,
  X,
  Moon,
  Sun,
  Github,
  Linkedin,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { portfolio } from "@/data/portfolio";
import avatarImage from "@/assets/loader/avatar-idle.png";

// @ts-ignore -- Firebase config is shipped as JS and lacks generated typings.
import { auth } from "@/firebase/config";

// @ts-ignore -- Firebase auth helper is shipped as JS.
import { signInWithGoogle } from "@/firebase/auth";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

const ADMIN_EMAIL = "mehreenrao220117@gmail.com";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/work" as const, label: "Work" },
];

/* =========================================
   TURTLE SVG
========================================= */

function TurtleSvg({
  traveling = false,
}: {
  traveling?: boolean;
}) {
  const turtleColor = "#E85D3F";

  return (
    <svg
      width={traveling ? 42 : 34}
      height={traveling ? 28 : 26}
      viewBox="0 0 120 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={
        traveling
          ? "block h-7 w-[42px] shrink-0 max-md:h-6 max-md:w-[34px]"
          : "block h-[22px] w-[30px] shrink-0"
      }
    >
      {/* Turtle silhouette, inspired by your reference image */}
      <g fill={traveling ? "currentColor" : "white"}>
        {/* Shell and body */}
        <path d="M13 48C12 34 21 20 39 14C57 8 73 15 81 29C86 38 80 47 68 53C53 61 32 67 18 64C10 62 8 55 13 48Z" />

        {/* Head */}
        <path d="M78 30C82 17 87 4 100 4C112 4 120 15 119 28C118 40 109 46 98 44C88 42 81 37 78 30Z" />

        {/* Front legs */}
        <path d="M51 55C48 62 48 70 56 73L69 73C75 72 75 68 71 62L67 53Z" />
        <path d="M74 49C72 57 76 69 84 70L94 70C100 69 101 65 97 59L91 44Z" />

        {/* Back legs */}
        <path d="M20 54C15 58 12 64 17 68C22 72 31 69 37 69L45 59L29 55Z" />

        {/* Tail */}
        <path d="M14 48C8 48 3 53 1 56C-1 60 4 62 9 60L17 56Z" />
      </g>

      {/* Thick curved shell marking, like the reference */}
      <path
        d="M14 47C24 57 46 51 66 42C79 36 84 28 80 22"
        stroke={traveling ? "white" : turtleColor}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Eye */}
      <circle
        cx="108"
        cy="20"
        r="3.8"
        fill={traveling ? "white" : turtleColor}
      />
    </svg>
  );
}

/* =========================================
   SITE HEADER
========================================= */

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const turtleRef = useRef<HTMLDivElement | null>(null);
  const turtleTravelRef = useRef<SVGSVGElement | null>(null);
  const turtleCapsuleRef = useRef<HTMLButtonElement | null>(null);
  const authTargetRef = useRef<HTMLDivElement | null>(null);
  const mobileTargetRef = useRef<HTMLDivElement | null>(null);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  /* =========================================
     THEME
  ========================================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDarkMode = savedTheme === "dark";

    setDarkMode(shouldUseDarkMode);
    document.documentElement.classList.toggle(
      "dark",
      shouldUseDarkMode
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* =========================================
     FIREBASE AUTH
  ========================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  /* =========================================
     AUTH ACTIONS
  ========================================= */

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const turtleAction = user ? handleLogout : handleLogin;
  const turtleActionLabel = user ? "Logout" : "Login";

  /* =========================================
     TURTLE NAVIGATION ANIMATION
  ========================================= */

  useLayoutEffect(() => {
    if (authLoading) return;

    const container = headerInnerRef.current;
    const turtle = turtleRef.current;
    const turtleTravel = turtleTravelRef.current;
    const capsule = turtleCapsuleRef.current;
    const authTarget = authTargetRef.current;
    const mobileTarget = mobileTargetRef.current;

    if (!container || !turtle || !turtleTravel || !capsule) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const target = isMobile ? mobileTarget : authTarget;

    if (!target) return;

    const ctx = gsap.context(() => {
      const revealItems =
        gsap.utils.toArray<HTMLElement>("[data-nav-reveal]");

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const capsuleWidth = isMobile ? 68 : 92;

      /*
       * The mobile target is a separate reserved slot BEFORE
       * the hamburger button. The turtle never targets the
       * hamburger itself.
       */
      const targetX =
        targetRect.left -
        containerRect.left +
        (targetRect.width - capsuleWidth) / 2;

      const distance = Math.max(0, targetX);
      const travelDuration = isMobile ? 3.8 : 4.8;

      gsap.set(revealItems, {
        opacity: 0,
        y: 5,
        filter: "blur(6px)",
        scale: 0.98,
      });

      gsap.set(turtle, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      });

      gsap.set(capsule, {
        opacity: 0,
        scale: 0.78,
        x: 0,
        y: 0,
        transformOrigin: "center center",
      });

      gsap.set(turtleTravel, {
        opacity: 1,
        scale: 1,
      });

      const timeline = gsap.timeline();

      // Turtle entrance.
      timeline.fromTo(
        turtle,
        {
          opacity: 0,
          scale: 0.75,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.8)",
        }
      );

      // Reveal navigation items as the turtle moves.
      revealItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();

        const itemCenter =
          itemRect.left -
          containerRect.left +
          itemRect.width / 2;

        const progress =
          distance > 0
            ? Math.max(0, Math.min(1, itemCenter / distance))
            : 0;

        const revealTime = 0.65 + progress * travelDuration;

        timeline.to(
          item,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          },
          revealTime + index * 0.025
        );
      });

      // Travel to the exact center of the reserved target slot.
      timeline.to(
        turtle,
        {
          x: targetX,
          duration: travelDuration,
          ease: "power2.inOut",
        },
        0.15
      );

      // Small arrival bounce. The final resting Y is always zero.
      timeline.to(turtle, {
        y: -2,
        duration: 0.16,
        ease: "power2.out",
      });

      timeline.to(turtle, {
        y: 0,
        duration: 0.22,
        ease: "bounce.out",
      });

      // Swap the traveling turtle for the Login / Logout button.
      timeline.to(turtleTravel, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
      });

      timeline.to(
        capsule,
        {
          opacity: 1,
          scale: 1,
          duration: 0.32,
          ease: "back.out(1.5)",
        },
        "<"
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [authLoading, user]);

  return (
    <header
      className="
        sticky top-0 z-40
        bg-background/95 dark:bg-[#101711]/95
        text-[#17100F] dark:text-[#F5EFE6]
        backdrop-blur-xl
        transition-colors duration-300
      "
    >
      <div
        ref={headerInnerRef}
        className="
          relative mx-auto flex h-16 max-w-7xl
          items-center px-4 sm:px-8
        "
      >
        {/* =================================
            TURTLE JOURNEY
        ================================= */}

        <div
          ref={turtleRef}
          aria-hidden="true"
          className="
            pointer-events-none absolute left-0 top-1/8 z-50
flex items-center
            will-change-transform
          "
        >
          {/* Final Login / Logout button */}
          <button
            ref={turtleCapsuleRef}
            type="button"
            onClick={turtleAction}
            aria-label={turtleActionLabel}
            tabIndex={-1}
            className="
              pointer-events-auto absolute left-0 top-0
flex h-9 w-[92px]
              cursor-pointer items-center justify-center gap-1
              rounded-full bg-[#E85D3F] px-2
              max-md:w-[68px] max-md:gap-0.5
              shadow-[0_5px_18px_rgba(232,93,63,0.25)]
              outline-none transition-transform
              hover:scale-105
              focus-visible:ring-2 focus-visible:ring-[#E85D3F]
              focus-visible:ring-offset-2
            "
          >
            <TurtleSvg />
            <span className="whitespace-nowrap pr-1 text-[11px] font-semibold text-white md:text-xs">
              {turtleActionLabel}
            </span>
          </button>

          {/* Traveling turtle */}
          <svg
            ref={turtleTravelRef}
            width="42"
            height="28"
            viewBox="0 0 120 78"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
              relative z-10 block shrink-0 overflow-visible
              text-[#E85D3F]
              drop-shadow-[0_3px_8px_rgba(232,93,63,0.18)]
              max-md:h-6 max-md:w-[34px]
            "
          >
            <g fill="currentColor">
              {/* Shell */}
              <path d="M13 48C12 34 21 20 39 14C57 8 73 15 81 29C86 38 80 47 68 53C53 61 32 67 18 64C10 62 8 55 13 48Z" />

              {/* Head */}
              <path d="M78 30C82 17 87 4 100 4C112 4 120 15 119 28C118 40 109 46 98 44C88 42 81 37 78 30Z" />

              {/* Legs */}
              <path d="M51 55C48 62 48 70 56 73L69 73C75 72 75 68 71 62L67 53Z" />
              <path d="M74 49C72 57 76 69 84 70L94 70C100 69 101 65 97 59L91 44Z" />
              <path d="M20 54C15 58 12 64 17 68C22 72 31 69 37 69L45 59L29 55Z" />

              {/* Tail */}
              <path d="M14 48C8 48 3 53 1 56C-1 60 4 62 9 60L17 56Z" />
            </g>

            {/* Curved shell outline */}
            <path
              d="M14 47C24 57 46 51 66 42C79 36 84 28 80 22"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Eye */}
            <circle cx="108" cy="20" r="3.8" fill="white" />
          </svg>
        </div>

        {/* =================================
            LOGO
        ================================= */}

        <Link
          to="/"
          onClick={() => setOpen(false)}
          data-nav-reveal
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
        >
          <span
            className="
              grid size-9 shrink-0 place-items-center overflow-hidden
              rounded-full bg-[#641F32]
              transition-colors duration-300
              group-hover:bg-[#A9485D]
            "
          >
            <img
              src={avatarImage}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </span>

          <span
            className="
              max-w-[calc(100vw-190px)] truncate
              text-sm font-semibold uppercase tracking-[0.14em]
              text-[#641F32] dark:text-[#E85D3F]
              transition-colors duration-300
              group-hover:text-[#E85D3F]
              max-[360px]:hidden
            "
          >
            {portfolio.name}
          </span>
        </Link>

        {/* =================================
            DESKTOP NAV
        ================================= */}

        <nav
          className="
            absolute left-1/2 hidden -translate-x-1/2
            items-center gap-8 md:flex
          "
          aria-label="Main navigation"
        >
          <div data-nav-reveal>
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === "/"
                  ? "text-[#E85D3F]"
                  : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
              }`}
            >
              Home
            </Link>
          </div>

          <div data-nav-reveal>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === "/about"
                  ? "text-[#E85D3F]"
                  : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
              }`}
            >
              About
            </Link>
          </div>

          <div data-nav-reveal>
            <Link
              to="/work"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === "/work"
                  ? "text-[#E85D3F]"
                  : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
              }`}
            >
              Work
            </Link>
          </div>

          {isAdmin && (
            <div data-nav-reveal>
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
                  pathname === "/admin"
                    ? "text-[#E85D3F]"
                    : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
                }`}
              >
                <Shield className="size-4" />
                Admin
              </Link>
            </div>
          )}

          <div data-nav-reveal>
            <Link
              to="/connect"
              className="
                text-sm font-medium
                text-[#641F32] dark:text-[#87917F]
                transition-colors duration-300 hover:text-[#E85D3F]
              "
            >
              Let's connect
            </Link>
          </div>

          <div data-nav-reveal>
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={darkMode ? "Light mode" : "Dark mode"}
              className="
                grid size-9 place-items-center rounded-full
                text-[#641F32] dark:text-[#E85D3F]
                transition-all duration-300
                hover:bg-[#641F32]/10 dark:hover:bg-[#E6D2B5]/10
                hover:text-[#E85D3F]
              "
            >
              {darkMode ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </button>
          </div>
        </nav>

        {/* Desktop Login target: reserve the final position */}
        <div
          ref={authTargetRef}
          className="
            ml-auto hidden h-9 w-[92px]
            items-center justify-center md:flex
          "
          aria-hidden="true"
        >
          <span className="invisible h-9 w-full">
            {turtleActionLabel}
          </span>
        </div>

        {/* Mobile Login target: separate from the hamburger */}
        <div
          ref={mobileTargetRef}
          aria-hidden="true"
          className="
            ml-auto flex h-9 w-[68px] shrink-0
            items-center justify-center md:hidden
          "
        />

        {/* Hamburger stays at the rightmost position */}
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            ml-2 grid size-10 shrink-0 place-items-center
            text-[#641F32] dark:text-[#E85D3F]
            transition-colors hover:text-[#E85D3F] md:hidden
          "
        >
          {open ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* =================================
          MOBILE NAVIGATION
      ================================= */}

      {open && (
        <nav
          className="
            border-t border-[#28323C]/20 bg-background
            px-5 py-5 transition-colors duration-300
            dark:bg-[#101711] md:hidden
          "
          aria-label="Mobile navigation"
        >
          <div
            className="
              mx-auto flex max-w-7xl flex-col
              items-center gap-5
            "
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === link.to
                    ? "text-[#E85D3F]"
                    : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                  pathname === "/admin"
                    ? "text-[#E85D3F]"
                    : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
                }`}
              >
                <Shield className="size-4" />
                Admin
              </Link>
            )}

            <Link
              to="/connect"
              onClick={() => setOpen(false)}
              className="
                text-sm font-medium
                text-[#641F32] dark:text-[#87917F]
                transition-colors hover:text-[#E85D3F]
              "
            >
              Let's connect
            </Link>

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="
                flex items-center gap-2 text-sm font-medium
                text-[#641F32] dark:text-[#E85D3F]
                transition-colors hover:text-[#E85D3F]
              "
            >
              {darkMode ? (
                <>
                  <Sun className="size-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="size-4" />
                  Dark mode
                </>
              )}
            </button>

            {!authLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="
                    flex items-center gap-2 rounded-full
                    bg-[#E85D3F] px-4 py-2
                    text-sm font-medium text-white
                  "
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleLogin();
                    setOpen(false);
                  }}
                  className="
                    flex items-center gap-2 rounded-full
                    bg-[#E85D3F] px-4 py-2
                    text-sm font-medium text-white
                  "
                >
                  <LogIn className="size-4" />
                  Login
                </button>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/* =========================================
   SITE FOOTER
========================================= */

export function SiteFooter() {
  return (
    <footer
      className="
        border-t border-[#28323C]/20 bg-background
        dark:bg-[#101711] transition-colors duration-300
      "
    >
      <div
        className="
          mx-auto flex max-w-7xl flex-col gap-3
          px-5 py-8 text-sm text-[#641F32]
          dark:text-[#87917F]
          sm:flex-row sm:items-center sm:justify-between sm:px-8
        "
      >
        <p>© 2026 Mehreen Rao — Built with curiosity.</p>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/mehreenrao/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="
              text-[#641F32] dark:text-[#87917F]
              transition-colors hover:text-[#E85D3F]
            "
          >
            <Linkedin className="size-5" />
          </a>

          <a
            href="https://github.com/Meenu2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="
              text-[#641F32] dark:text-[#87917F]
              transition-colors hover:text-[#E85D3F]
            "
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
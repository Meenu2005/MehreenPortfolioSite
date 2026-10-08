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
   SITE HEADER
========================================= */

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const headerInnerRef =
    useRef<HTMLDivElement | null>(null);

  const turtleRef =
    useRef<HTMLDivElement | null>(null);

  const turtleTravelRef =
    useRef<SVGSVGElement | null>(null);

  const turtleCapsuleRef =
    useRef<HTMLButtonElement | null>(null);

  const authTargetRef =
    useRef<HTMLDivElement | null>(null);

  const mobileTargetRef =
    useRef<HTMLButtonElement | null>(null);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  /* =========================================
     THEME
  ========================================= */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );
    } else {
      setDarkMode(false);

      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  /* =========================================
     FIREBASE AUTH
  ========================================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setAuthLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  const isAdmin =
    user?.email?.toLowerCase() ===
    ADMIN_EMAIL.toLowerCase();

  /* =========================================
     AUTH ACTIONS
  ========================================= */

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  const turtleAction =
    user
      ? handleLogout
      : handleLogin;

  const turtleActionLabel =
    user
      ? "Logout"
      : "Login";

  /* =========================================
     TURTLE NAVIGATION ANIMATION
  ========================================= */

  useLayoutEffect(() => {
    const container =
      headerInnerRef.current;

    const turtle =
      turtleRef.current;

    const turtleTravel =
      turtleTravelRef.current;

    const capsule =
      turtleCapsuleRef.current;

    const authTarget =
      authTargetRef.current;

    const mobileTarget =
      mobileTargetRef.current;

    if (
      !container ||
      !turtle ||
      !turtleTravel ||
      !capsule
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const revealItems =
        gsap.utils.toArray<HTMLElement>(
          "[data-nav-reveal]"
        );

      /*
       * Desktop target:
       * actual Login position.
       *
       * Mobile target:
       * menu icon position.
       */
      const target =
        window.innerWidth >= 768
          ? authTarget
          : mobileTarget;

      if (!target) return;

      const containerRect =
        container.getBoundingClientRect();

      const targetRect =
        target.getBoundingClientRect();

      /*
       * Reset navigation.
       */
      gsap.set(revealItems, {
        opacity: 0,
        y: 5,
        filter: "blur(6px)",
        scale: 0.98,
      });

      /*
       * Turtle starts as ONLY turtle.
       * No capsule.
       */
      gsap.set(turtle, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      });

      /*
       * Capsule stays completely hidden
       * until turtle reaches Login.
       */
      gsap.set(capsule, {
        opacity: 0,
        scale: 0.78,
        transformOrigin: "left center",
      });

      /*
       * Traveling turtle visible.
       */
      gsap.set(turtleTravel, {
        opacity: 1,
        scale: 1,
      });

      /*
       * Calculate exact destination.
       */
      const turtleWidth =
        window.innerWidth >= 768
          ? 42
          : 36;

      const targetX =
        targetRect.left -
        containerRect.left +
        targetRect.width / 2 -
        turtleWidth / 2;

      const distance =
        Math.max(0, targetX);

      const isMobile =
        window.innerWidth < 768;

      const travelDuration =
        isMobile ? 3.8 : 4.8;

      const timeline =
        gsap.timeline();

      /*
       * Initial cute appearance.
       */
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

      /*
       * Reveal nav items according
       * to their physical position.
       */
      revealItems.forEach(
        (item, index) => {
          const itemRect =
            item.getBoundingClientRect();

          const itemCenter =
            itemRect.left -
            containerRect.left +
            itemRect.width / 2;

          const progress =
            distance > 0
              ? Math.max(
                  0,
                  Math.min(
                    1,
                    itemCenter / distance
                  )
                )
              : 0;

          const revealTime =
            0.65 +
            progress * travelDuration;

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
            revealTime +
              index * 0.025
          );
        }
      );

      /*
       * Turtle travels across header.
       */
      timeline.to(
        turtle,
        {
          x: targetX,
          duration: travelDuration,
          ease: "power2.inOut",
        },
        0.15
      );

      /*
       * Tiny arrival bounce.
       */
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

      /*
       * Traveling turtle fades out.
       */
      timeline.to(
        turtleTravel,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.out",
        }
      );

      /*
       * Login / Logout capsule appears
       * exactly where turtle stopped.
       */
      timeline.to(
        capsule,
        {
          opacity: 1,
          scale: 1.02,
          duration: 0.38,
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
        sticky
        top-0
        z-40
        bg-background/95
        dark:bg-[#101711]/95
        text-[#17100F]
        dark:text-[#F5EFE6]
        backdrop-blur-xl
        transition-colors duration-300
      "
    >
      <div
        ref={headerInnerRef}
        className="
          relative
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          px-4
          sm:px-8
        "
      >
        {/* =================================
            TURTLE JOURNEY
        ================================= */}

        <div
          ref={turtleRef}
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            top-1/2
            z-50
            flex
            -translate-y-1/2
            items-center
            will-change-transform
          "
        >
          {/* =================================
              FINAL LOGIN / LOGOUT CAPSULE
          ================================= */}

          <button
            ref={turtleCapsuleRef}
            type="button"
            onClick={turtleAction}
            aria-label={turtleActionLabel}
            className="
              pointer-events-auto
              absolute
              left-0
              top-1/2
              flex
              h-9
              -translate-y-1/2
              cursor-pointer
              items-center
              gap-1
              rounded-full
              bg-[#E85D3F]
              px-2
              shadow-[0_5px_18px_rgba(232,93,63,0.25)]
              outline-none
              transition-transform
              hover:scale-105
              focus-visible:ring-2
              focus-visible:ring-[#E85D3F]
              focus-visible:ring-offset-2
              md:h-9
              md:gap-1.5
              md:px-2.5
            "
          >
            {/* White turtle at Login */}
            <svg
              width="34"
              height="26"
              viewBox="0 0 52 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              {/* Shell */}
              <path
                d="
                  M8 21
                  C7.5 14
                  12.5 7
                  22 6
                  C31 5
                  38 10
                  40 17
                  C41 22
                  36 26
                  29 27
                  H15
                  C11 27
                  8.5 25
                  8 21Z
                "
                fill="white"
              />

              {/* Shell pattern */}
              <path
                d="
                  M14 11
                  C17 14 18.5 17 18 21

                  M27 7.5
                  C25 12 25 18 27 24

                  M36 11
                  C33 14 32 18 33 22

                  M10 18.5 H38
                "
                stroke="#E85D3F"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Side profile head */}
              <path
                d="
                  M37 14
                  C40 11
                  44 11
                  46.5 13
                  C48.5 14.5
                  49 17
                  47.5 19
                  C46 21
                  42.5 21
                  39.5 19.5
                  L37 18
                  Z
                "
                fill="white"
              />

              {/* Nose */}
              <path
                d="
                  M46.5 15.5
                  L49 16.5
                  L46.7 17.2
                "
                fill="white"
              />

              {/* Eye */}
              <circle
                cx="44.2"
                cy="14.8"
                r="1.1"
                fill="#E85D3F"
              />

              {/* Legs */}
              <path
                d="
                  M34 23
                  C36 24 38 26 38 28

                  M30 24
                  C31 26 31 28 30 29

                  M13 23
                  C11 24 9 26 9 28

                  M17 24
                  C16 26 16 28 17 29
                "
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Tail */}
              <path
                d="
                  M9 19
                  C6 18
                  4.5 18.5
                  3 20
                "
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <span
              className="
                whitespace-nowrap
                pr-1
                text-[11px]
                font-semibold
                text-white
                md:text-xs
              "
            >
              {turtleActionLabel}
            </span>
          </button>

          {/* =================================
              TRAVELING ORANGE TURTLE
              NO BACKGROUND
          ================================= */}

          <svg
            ref={turtleTravelRef}
            width="42"
            height="28"
            viewBox="0 0 52 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
              relative
              z-10
              shrink-0
              overflow-visible
              text-[#E85D3F]
              drop-shadow-[0_3px_8px_rgba(232,93,63,0.18)]
              md:w-[42px]
              md:h-[28px]
            "
          >
            {/* Main shell */}
            <path
              d="
                M8 21
                C7.5 14
                12.5 7
                22 6
                C31 5
                38 10
                40 17
                C41 22
                36 26
                29 27
                H15
                C11 27
                8.5 25
                8 21Z
              "
              fill="currentColor"
            />

            {/* Shell pattern */}
            <path
              d="
                M14 11
                C17 14 18.5 17 18 21

                M27 7.5
                C25 12 25 18 27 24

                M36 11
                C33 14 32 18 33 22
              "
              stroke="white"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.72"
            />

            <path
              d="M10 18.5 H38"
              stroke="white"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.58"
            />

            {/* Side-profile head */}
            <path
              d="
                M37 14
                C40 11
                44 11
                46.5 13
                C48.5 14.5
                49 17
                47.5 19
                C46 21
                42.5 21
                39.5 19.5
                L37 18
                Z
              "
              fill="currentColor"
            />

            {/* Nose */}
            <path
              d="
                M46.5 15.5
                L49 16.5
                L46.7 17.2
              "
              fill="currentColor"
            />

            {/* Eye */}
            <circle
              cx="44.2"
              cy="14.8"
              r="1.15"
              fill="white"
            />

            {/* Legs */}
            <path
              d="
                M34 23
                C36 24 38 26 38 28

                M30 24
                C31 26 31 28 30 29

                M13 23
                C11 24 9 26 9 28

                M17 24
                C16 26 16 28 17 29
              "
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Tail */}
            <path
              d="
                M9 19
                C6 18
                4.5 18.5
                3 20
              "
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* =================================
            LOGO
        ================================= */}

        <Link
          to="/"
          onClick={() => setOpen(false)}
          data-nav-reveal
          className="
            group
            flex
            items-center
            gap-2.5
            sm:gap-3
          "
        >
          <span
            className="
              grid
              size-9
              place-items-center
              overflow-hidden
              rounded-full
              bg-[#641F32]
              transition-colors duration-300
              group-hover:bg-[#A9485D]
            "
          >
            <img
              src={avatarImage}
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
              draggable={false}
            />
          </span>

          <span
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#641F32]
              dark:text-[#E85D3F]
              transition-colors duration-300
              group-hover:text-[#E85D3F]
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
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-8
            md:flex
          "
          aria-label="Main navigation"
        >
          {/* Home */}
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

          {/* About */}
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

          {/* Work */}
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

          {/* Admin */}
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

          {/* Let's connect */}
          <div data-nav-reveal>
            <Link
              to="/connect"
              className="
                text-sm
                font-medium
                text-[#641F32]
                dark:text-[#87917F]
                transition-colors duration-300
                hover:text-[#E85D3F]
              "
            >
              Let's connect
            </Link>
          </div>

          {/* Theme */}
          <div data-nav-reveal>
            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (value) => !value
                )
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                darkMode
                  ? "Light mode"
                  : "Dark mode"
              }
              className="
                grid
                size-9
                place-items-center
                rounded-full
                text-[#641F32]
                dark:text-[#E85D3F]
                transition-all duration-300
                hover:bg-[#641F32]/10
                dark:hover:bg-[#E6D2B5]/10
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

        {/* =================================
            DESKTOP LOGIN TARGET
        ================================= */}

        <div
          ref={authTargetRef}
          className="
            ml-auto
            hidden
            h-9
            w-[92px]
            items-center
            justify-center
            md:flex
          "
        >
          {/*
            This invisible button keeps the exact
            Login position for the turtle animation.
            The visible turtle capsule handles the
            actual click.
          */}
          <button
            type="button"
            onClick={turtleAction}
            aria-label={turtleActionLabel}
            className="
              invisible
              pointer-events-none
              h-9
              w-full
            "
          >
            {turtleActionLabel}
          </button>
        </div>

        {/* =================================
            MOBILE MENU
        ================================= */}

        <button
          ref={mobileTargetRef}
          type="button"
          aria-label={
            open
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={open}
          onClick={() =>
            setOpen(
              (value) => !value
            )
          }
          className="
            ml-auto
            grid
            size-10
            place-items-center
            text-[#641F32]
            dark:text-[#E85D3F]
            transition-colors
            hover:text-[#E85D3F]
            md:hidden
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
            border-t
            border-[#28323C]/20
            bg-background
            px-5
            py-5
            transition-colors duration-300
            dark:bg-[#101711]
            md:hidden
          "
          aria-label="Mobile navigation"
        >
          <div
            className="
              mx-auto
              flex
              max-w-7xl
              flex-col
              items-center
              gap-5
            "
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() =>
                  setOpen(false)
                }
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
                onClick={() =>
                  setOpen(false)
                }
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
              onClick={() =>
                setOpen(false)
              }
              className="
                text-sm
                font-medium
                text-[#641F32]
                dark:text-[#87917F]
                transition-colors duration-300
                hover:text-[#E85D3F]
              "
            >
              Let's connect
            </Link>

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (value) => !value
                )
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#641F32]
                dark:text-[#E85D3F]
                transition-colors duration-300
                hover:text-[#E85D3F]
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
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#E85D3F]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
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
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#E85D3F]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
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
        border-t
        border-[#28323C]/20
        bg-background
        dark:bg-[#101711]
        transition-colors duration-300
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-3
          px-5
          py-8
          text-sm
          text-[#641F32]
          dark:text-[#87917F]
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-8
        "
      >
        <p>
          © 2026 Mehreen Rao — Built with curiosity.
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/mehreenrao/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="
              text-[#641F32]
              dark:text-[#87917F]
              transition-colors duration-300
              hover:text-[#E85D3F]
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
              text-[#641F32]
              dark:text-[#87917F]
              transition-colors duration-300
              hover:text-[#E85D3F]
            "
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
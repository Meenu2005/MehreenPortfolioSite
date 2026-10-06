
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
import { useEffect, useState } from "react";

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

/* Same auth button style on desktop + mobile */
const authButtonClass = `
  flex items-center gap-2
  rounded-full
  bg-[#dc651b]
  px-4 py-2
  text-sm font-medium text-white
  transition-all duration-300
  hover:bg-[#A9485D]
`;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Light mode by default
  const [darkMode, setDarkMode] = useState(false);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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
      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#641F32] transition-colors duration-300 group-hover:bg-[#A9485D]">
            <img
              src={avatarImage}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </span>

          <span
            className="
              text-sm font-semibold uppercase tracking-[0.14em]
              text-[#641F32] dark:text-[#E85D3F]
              transition-colors duration-300
              group-hover:text-[#E85D3F]
            "
          >
            {portfolio.name}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="
            absolute left-1/2 hidden
            -translate-x-1/2
            items-center gap-8
            md:flex
          "
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === link.to
                  ? "text-[#E85D3F]"
                  : "text-[#641F32] dark:text-[#87917F] hover:text-[#E85D3F]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin */}
          {isAdmin && (
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
          )}

          {/* Let's connect */}
          <Link
            to="/connect"
            className="
              text-sm font-medium
              text-[#641F32] dark:text-[#87917F]
              transition-colors duration-300
              hover:text-[#E85D3F]
            "
          >
            Let's connect
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
            className="
              grid size-9 place-items-center rounded-full
              text-[#641F32] dark:text-[#E85D3F]
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
        </nav>

        {/* Desktop auth */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {!authLoading &&
            (user ? (
              <button
                type="button"
                onClick={handleLogout}
                className={authButtonClass}
              >
                <LogOut className="size-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className={authButtonClass}
              >
                <LogIn className="size-4" />
                Login
              </button>
            ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            ml-auto grid size-10 place-items-center
            text-[#641F32] dark:text-[#E85D3F]
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

      {/* Mobile navigation */}
      {open && (
        <nav
          className="
            border-t border-[#28323C]/20
            bg-background dark:bg-[#101711]
            px-5 py-5
            transition-colors duration-300
            md:hidden
          "
          aria-label="Mobile navigation"
        >
          <div
            className="
              mx-auto flex max-w-7xl
              flex-col items-center gap-5
            "
          >
            {/* Main links */}
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

            {/* Admin */}
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

            {/* Let's connect */}
            <Link
              to="/connect"
              onClick={() => setOpen(false)}
              className="
                text-sm font-medium
                text-[#641F32] dark:text-[#87917F]
                transition-colors duration-300
                hover:text-[#E85D3F]
              "
            >
              Let's connect
            </Link>

            {/* Mobile theme toggle */}
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className="
                flex items-center gap-2
                text-sm font-medium
                text-[#641F32] dark:text-[#E85D3F]
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

            {/* Mobile auth */}
            {!authLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className={authButtonClass}
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
                  className={authButtonClass}
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

export function SiteFooter() {
  return (
    <footer
      className="
        border-t border-[#28323C]/20
        bg-background dark:bg-[#101711]
        transition-colors duration-300
      "
    >
      <div
        className="
          mx-auto flex max-w-7xl flex-col gap-3
          px-5 py-8 text-sm
          text-[#641F32] dark:text-[#87917F]
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
      text-[#641F32] dark:text-[#87917F]
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

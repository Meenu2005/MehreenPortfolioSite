import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Shield, X } from "lucide-react";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

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
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl">
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

          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#E6D2B5] transition-colors duration-300 group-hover:text-white">
            {portfolio.name}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === link.to
                  ? "text-[#E85D3F]"
                  : "text-[#87917F] hover:text-[#E85D3F]"
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
                  : "text-[#87917F] hover:text-[#E85D3F]"
              }`}
            >
              <Shield className="size-4" />
              Admin
            </Link>
          )}

          <Link
            to="/connect"
            className="text-sm font-medium text-[#87917F] transition-colors duration-300 hover:text-[#E85D3F]"
          >
            Let's connect
          </Link>
        </nav>

        {/* Auth - right side */}
        <div className="ml-auto hidden items-center md:flex">
          {!authLoading &&
            (user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-[#641F32] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#A9485D]"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-2 rounded-full bg-[#641F32] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#A9485D]"
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
          className="ml-auto grid size-10 place-items-center text-[#87917F] transition-colors hover:text-[#E85D3F] md:hidden"
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
          className="border-t border-[#28323C]/50 bg-black px-5 py-5 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5">

            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === link.to
                    ? "text-[#E85D3F]"
                    : "text-[#87917F] hover:text-[#E85D3F]"
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
                    : "text-[#87917F] hover:text-[#E85D3F]"
                }`}
              >
                <Shield className="size-4" />
                Admin
              </Link>
            )}

            <Link
              to="/connect"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#87917F] transition-colors duration-300 hover:text-[#E85D3F]"
            >
              Let's connect
            </Link>

            {!authLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="mt-1 flex items-center gap-2 rounded-full bg-grid px-5 py-2.5 text-sm font-medium text-white bg-[#dc651b] duration-300 "
                >
                  <LogOut className="size-4  bg-[#dc651b] " />
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleLogin();
                    setOpen(false);
                  }}
                  className="mt-1 flex items-center gap-2 rounded-full bg-grid px-5 py-2.5 text-sm font-medium text-white  duration-300 "
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
    <footer className="border-t border-[#28323C]/60 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#87917F] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Designed and built by {portfolio.name}.</p>
        <p>React portfolio · Details ready to personalize</p>
      </div>
    </footer>
  );
}
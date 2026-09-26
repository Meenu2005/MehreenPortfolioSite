import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { portfolio } from "@/data/portfolio";
import { LinkButton } from "./Button";

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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-sm bg-primary text-xs font-bold text-primary-foreground transition-transform group-hover:-rotate-3">
            MR
          </span>

          <span className="text-sm font-bold uppercase tracking-wide">
            {portfolio.name}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                pathname === link.to
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`ml-2 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Shield className="size-4" />
              Admin
            </Link>
          )}

          <LinkButton to="/connect" tone="connect" className="ml-3">
            Let's connect
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </LinkButton>

          {/* Auth */}
          {!authLoading &&
            (user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="ml-2 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <LogIn className="size-4" />
                Login
              </button>
            ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-md border border-border bg-surface text-foreground md:hidden"
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
          className="border-t border-border bg-background px-5 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-7xl gap-2">

            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-3 font-medium hover:bg-muted"
              >
                <Shield className="size-4" />
                Admin
              </Link>
            )}

            <LinkButton
              to="/connect"
              tone="connect"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              Let's connect
            </LinkButton>

            {!authLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="mt-1 flex items-center justify-center gap-2 rounded-md border border-border px-3 py-3 font-medium hover:bg-muted"
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
                  className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-3 font-medium text-primary-foreground"
                >
                  <LogIn className="size-4" />
                  Login with Google
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
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Designed and built by {portfolio.name}.</p>
        <p>React portfolio · Details ready to personalize</p>
      </div>
    </footer>
  );
}
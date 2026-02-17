"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguagesIcon, MoonIcon, SunIcon, WalletIcon } from "lucide-react";

import { toLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";

type NavbarCopy = {
  appName: string;
  dashboard: string;
  wallet: string;
  language: string;
  menu: string;
  signOut: string;
  signInPrompt: string;
};

function withLocale(pathname: string, locale: string): string {
  const normalizedLocale = toLocale(locale) ?? "en";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return `/${normalizedLocale}`;
  }

  if (toLocale(parts[0])) {
    parts[0] = normalizedLocale;
    return `/${parts.join("/")}`;
  }

  return `/${normalizedLocale}/${parts.join("/")}`;
}

export function Navbar({ locale, copy }: { locale: string; copy: NavbarCopy }) {
  const pathname = usePathname();
  const router = useRouter();
  const normalizedLocale = toLocale(locale) ?? "en";
  const { status } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const isAuthenticated = status === "authenticated";
  const pathWithoutLocale = pathname.replace(/^\/(en|pt-br)(?=\/|$)/i, "") || "/";
  const isAuthPage =
    pathWithoutLocale === "/login" || pathWithoutLocale === "/register";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2">
      <div className="rounded-2xl border bg-background/80 px-3 py-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/${normalizedLocale}`} className="flex items-center gap-2 pl-1">
            <WalletIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">{copy.appName}</span>
          </Link>

          {!isAuthPage && (
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                {isAuthenticated && (
                  <>
                    <NavigationMenuItem className="flex items-center gap-2">
                      <NavigationMenuLink
                        render={
                          <Link
                            href={`/${normalizedLocale}`}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathWithoutLocale === "/" ? "bg-accent" : undefined
                            )}
                          >
                            {copy.dashboard}
                          </Link>
                        }
                      />
                      <NavigationMenuLink
                        render={
                          <Link
                            href={`/${normalizedLocale}/wallet`}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathWithoutLocale === "/wallet" ? "bg-accent" : undefined
                            )}
                          >
                            {copy.wallet}
                          </Link>
                        }
                      />
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-2">
            <div className="relative">
              <LanguagesIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                aria-label={copy.language}
                value={normalizedLocale}
                className="h-9 rounded-md border bg-background pl-8 pr-3 text-sm"
                onChange={(event) => router.replace(withLocale(pathname, event.target.value))}
              >
                <option value="en">EN</option>
                <option value="pt-br">PT-BR</option>
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-9 w-9 p-0"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </Button>

            {!isAuthPage && isAuthenticated && (
              <Button
                type="button"
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => signOut({ redirectTo: `/${normalizedLocale}/login` })}
              >
                {copy.signOut}
              </Button>
            )}

            {!isAuthPage && (
              <NavigationMenu className="md:hidden">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{copy.menu}</NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto w-56">
                      {isAuthenticated ? (
                        <ul className="grid gap-1">
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href={`/${normalizedLocale}`}
                                  className={cn(
                                    "flex w-full items-center",
                                    pathWithoutLocale === "/" ? "border-b border-b-accent" : undefined
                                  )}
                                >
                                  {copy.dashboard}
                                </Link>
                              }
                            />
                          </li>
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href={`/${normalizedLocale}/wallet`}
                                  className={cn(
                                    "flex w-full items-center",
                                    pathWithoutLocale === "/wallet"
                                      ? "border-b border-b-accent"
                                      : undefined
                                  )}
                                >
                                  {copy.wallet}
                                </Link>
                              }
                            />
                          </li>
                          <li>
                            <NavigationMenuLink
                              render={
                                <button
                                  type="button"
                                  className="flex w-full items-center px-3 py-2 text-sm"
                                  onClick={() =>
                                    signOut({ redirectTo: `/${normalizedLocale}/login` })
                                  }
                                >
                                  {copy.signOut}
                                </button>
                              }
                            />
                          </li>
                        </ul>
                      ) : (
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                          {copy.signInPrompt}
                        </p>
                      )}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



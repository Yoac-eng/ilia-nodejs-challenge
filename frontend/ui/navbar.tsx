"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguagesIcon, WalletIcon } from "lucide-react";

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

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2">
      <div className="rounded-2xl border bg-background/80 px-3 py-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 pl-1">
            <WalletIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">Illia Wallet</span>
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
                            href="/"
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathname === "/" ? "bg-accent" : undefined
                            )}
                          >
                            Dashboard
                          </Link>
                        }
                      />
                      <NavigationMenuLink
                        render={
                          <Link
                            href="/wallet"
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathname === "/wallet" ? "bg-accent" : undefined
                            )}
                          >
                            Wallet
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
                aria-label="Language"
                defaultValue="en"
                className="h-9 rounded-md border bg-background pl-8 pr-3 text-sm"
              >
                <option value="en">EN</option>
                <option value="pt-br">PT-BR</option>
              </select>
            </div>

            {!isAuthPage && isAuthenticated && (
              <Button
                type="button"
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => signOut({ redirectTo: "/login" })}
              >
                Sign out
              </Button>
            )}

            {!isAuthPage && (
              <NavigationMenu className="md:hidden">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto w-56">
                      {isAuthenticated ? (
                        <ul className="grid gap-1">
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href="/"
                                  className={cn(
                                    "flex w-full items-center",
                                    pathname === "/" ? "border-b border-b-accent" : undefined
                                  )}
                                >
                                  Dashboard
                                </Link>
                              }
                            />
                          </li>
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href="/wallet"
                                  className={cn(
                                    "flex w-full items-center",
                                    pathname === "/wallet" ? "border-b border-b-accent" : undefined
                                  )}
                                >
                                  Wallet
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
                                  onClick={() => signOut({ redirectTo: "/login" })}
                                >
                                  Sign out
                                </button>
                              }
                            />
                          </li>
                        </ul>
                      ) : (
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                          Sign in to see wallet links.
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



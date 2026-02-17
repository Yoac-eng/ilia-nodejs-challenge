"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguagesIcon, WalletIcon } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/ui/navigation-menu";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2">
      <div className="rounded-2xl border bg-background/80 px-3 py-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 pl-1">
            <WalletIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">Illia Wallet</span>
          </Link>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      render={
                        <Link
                          href="/"
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === "/" ? "bg-accent" : undefined
                          )}
                        >
                          Wallet
                        </Link>
                      }
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      render={
                        <Link
                          href="/transactions/new"
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === "/transactions/new" ? "bg-accent" : undefined
                          )}
                        >
                          New transaction
                        </Link>
                      }
                    />
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

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
                                  pathname === "/" ? "bg-accent" : undefined
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
                              <Link
                                href="/transactions/new"
                                className={cn(
                                  "flex w-full items-center",
                                  pathname === "/transactions/new"
                                    ? "bg-accent"
                                    : undefined
                                )}
                              >
                                New transaction
                              </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}



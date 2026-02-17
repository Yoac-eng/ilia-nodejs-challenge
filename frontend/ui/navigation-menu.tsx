"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type NavigationMenuContextValue = {
  closeAll: () => void;
};

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(
  null
);

type NavigationMenuItemContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
};

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

export function NavigationMenu({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  const [openCount, setOpenCount] = React.useState(0);

  const value = React.useMemo<NavigationMenuContextValue>(
    () => ({
      closeAll: () => setOpenCount((c) => c + 1),
    }),
    []
  );

  return (
    <NavigationMenuContext.Provider value={value}>
      <nav className={cn("relative", className)} {...props} data-close={openCount} />
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  const menu = React.useContext(NavigationMenuContext);
  const [open, setOpen] = React.useState(false);
  const triggerId = React.useId();
  const contentId = React.useId();
  const itemRef = React.useRef<HTMLLIElement | null>(null);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (!itemRef.current) return;
      if (itemRef.current.contains(target)) return;
      setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const value = React.useMemo<NavigationMenuItemContextValue>(
    () => ({
      open,
      setOpen: (next) => {
        if (!next) setOpen(false);
        else {
          menu?.closeAll();
          setOpen(true);
        }
      },
      triggerId,
      contentId,
    }),
    [contentId, menu, open, triggerId]
  );

  return (
    <NavigationMenuItemContext.Provider value={value}>
      <li ref={itemRef} className={cn("relative", className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

export function NavigationMenuTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx) {
    throw new Error("NavigationMenuTrigger must be used within NavigationMenuItem.");
  }

  return (
    <button
      type="button"
      id={ctx.triggerId}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      className={cn(navigationMenuTriggerStyle(), className)}
      onClick={() => ctx.setOpen(!ctx.open)}
      {...props}
    />
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx) {
    throw new Error("NavigationMenuContent must be used within NavigationMenuItem.");
  }

  return (
    <div
      id={ctx.contentId}
      role="menu"
      aria-labelledby={ctx.triggerId}
      data-state={ctx.open ? "open" : "closed"}
      className={cn(
        "absolute left-0 top-full z-50 mt-2 min-w-56 rounded-xl border bg-background p-2 shadow-lg",
        "data-[state=closed]:hidden",
        className
      )}
      {...props}
    />
  );
}

type NavigationMenuLinkProps = Omit<React.ComponentProps<"a">, "children"> & {
  asChild?: boolean;
  render?: React.ReactElement;
  children?: React.ReactNode;
};

export function NavigationMenuLink({
  className,
  asChild,
  render,
  children,
  ...props
}: NavigationMenuLinkProps) {
  const base = cn(
    "flex w-full select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors",
    "hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
  );

  if (render && React.isValidElement(render)) {
    return React.cloneElement(render, {
      className: cn(base, (render.props as { className?: string }).className, className),
    });
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(base, (children.props as { className?: string }).className, className),
    });
  }

  return (
    <a className={cn(base, className)} {...props}>
      {children}
    </a>
  );
}

export function navigationMenuTriggerStyle() {
  return cn(
    "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium",
    "text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );
}



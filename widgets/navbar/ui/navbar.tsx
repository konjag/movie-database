"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Film },
  { href: "/favourites", label: "Favourites", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center px-4" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Film className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="leading-4">Movie Database</span>
        </Link>

        <ul className="ml-auto flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "bg-muted/20 text-foreground"
                      : "text-muted hover:bg-muted/10 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

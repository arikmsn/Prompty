import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROUTE_HOME = "/";
const ROUTE_EXPLORE = "/explore";
const ROUTE_MARKETPLACE = "/marketplace";
const ROUTE_ARCHITECTS = "/architects";
const PLACEHOLDER_SEARCH = "Search";
const LABEL_CONNECT = "Connect";
const BRAND_NAME = "PROMPTY";

const NAV_LINKS = [
  { href: ROUTE_EXPLORE, label: "Explore" },
  { href: ROUTE_MARKETPLACE, label: "Marketplace" },
  { href: ROUTE_ARCHITECTS, label: "Architects" },
] as const;

/**
 * Primary navigation bar for the Nexus Core UI.
 * Implements Obsidian aesthetic with glassmorphism and sticky positioning.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center">
          <Link
            href={ROUTE_HOME}
            className="font-sans text-lg font-bold tracking-tighter text-white transition-opacity hover:opacity-90"
          >
            {BRAND_NAME}
          </Link>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-8 sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Input
            type="search"
            placeholder={PLACEHOLDER_SEARCH}
            className="hidden w-40 border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-white/20 md:block md:w-48"
            aria-label={PLACEHOLDER_SEARCH}
          />
          <Button
            type="button"
            className="bg-white text-[#050505] hover:bg-white/90"
          >
            {LABEL_CONNECT}
          </Button>
        </div>
      </nav>
    </header>
  );
}

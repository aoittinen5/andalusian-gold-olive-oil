import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/collection", label: "The Collection" },
  { to: "/story", label: "Our Story" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
        transparent
          ? "bg-transparent text-noir-foreground"
          : "border-b border-border bg-background/95 text-foreground backdrop-blur",
      )}
    >
      <div className="mx-auto grid h-20 max-w-[1600px] grid-cols-3 items-center px-6 md:px-12">
        <nav className="flex items-center gap-10">
          <Sheet>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </SheetTrigger>
            <SheetContent side="left" className="bg-background p-10">
              <SheetTitle className="wordmark mb-12 text-base">Zafyra</SheetTitle>
              <ul className="space-y-8">
                {NAV.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="font-display text-3xl">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow link-underline hidden md:inline-block">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="wordmark justify-self-center text-xl md:text-2xl" aria-label="Zafyra home">
          Zafyra
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="eyebrow link-underline justify-self-end"
          aria-label={`Open bag, ${count} items`}
        >
          Bag{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </header>
  );
}

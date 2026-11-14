import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-noir text-noir-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="wordmark text-3xl text-gold">Zafyra</span>
          <span className="gold-rule w-40" />
          <p className="eyebrow text-noir-muted">Extra Virgin Olive Oil · Early Harvest · Product of Spain</p>
        </div>
        <nav className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-4">
          <Link to="/collection" className="eyebrow link-underline text-noir-muted hover:text-noir-foreground">
            The Collection
          </Link>
          <Link to="/story" className="eyebrow link-underline text-noir-muted hover:text-noir-foreground">
            Our Story
          </Link>
        </nav>
        <p className="mt-16 text-center text-xs tracking-wider text-noir-muted">
          © {new Date().getFullYear()} Zafyra. Imported from Andalucía, Spain.
        </p>
      </div>
    </footer>
  );
}

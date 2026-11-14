import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { productsQueryOptions } from "@/lib/shopify";
import { VarietalCard } from "@/components/site/VarietalCard";
import groveVideo from "@/assets/grove-flyover-loop.mp4.asset.json";
import grovePoster from "@/assets/grove-flyover-poster.jpg.asset.json";
import harvest from "@/assets/harvest.jpg";
import groveDusk from "@/assets/grove-dusk.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zafyra — Early Harvest Extra Virgin Olive Oil from Andalucía" },
      { name: "description", content: "Zafyra Picual and Arbequina: premium early-harvest extra virgin olive oil imported from Andalucía, Spain." },
      { property: "og:title", content: "Zafyra — Extra Virgin Olive Oil from Andalucía" },
      { property: "og:description", content: "Premium early-harvest Picual and Arbequina olive oil imported from Andalucía, Spain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  return (
    <>
      <section className="relative h-svh min-h-[640px] overflow-hidden bg-noir text-noir-foreground">
        <video className="absolute inset-0 h-full w-full object-cover" src={groveVideo.url} poster={grovePoster.url} autoPlay muted loop playsInline aria-hidden="true" />
        <div className="bg-hero-scrim absolute inset-0" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow animate-rise text-noir-foreground/80">Extra Virgin Olive Oil · Andalucía</p>
          <h1 className="animate-rise mt-8 max-w-4xl text-5xl leading-[1.05] md:text-8xl" style={{ animationDelay: "0.2s" }}>
            The liquid gold <em>of Andalucía</em>
          </h1>
          <div className="animate-rise mt-12" style={{ animationDelay: "0.4s" }}>
            <Button asChild variant="luxeLight" size="xl"><Link to="/collection">Discover the collection</Link></Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 overflow-hidden">
          <span className="animate-scroll-cue block h-full w-full bg-noir-foreground/70" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center md:py-44">
        <p className="eyebrow text-muted-foreground">The House of Zafyra</p>
        <p className="mt-10 font-display text-3xl leading-snug md:text-5xl">
          Two varietals. One early harvest. Pressed in Andalucía and bottled for those who taste the difference.
        </p>
        <span className="gold-rule mx-auto mt-14 block w-32" />
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-32 md:px-12">
        {products.length === 0 ? (
          <p className="text-center font-display text-2xl italic text-muted-foreground">No products found</p>
        ) : (
          <div className="grid gap-20 md:grid-cols-2 md:gap-10">
            {products.map((p) => <VarietalCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="grid bg-noir text-noir-foreground md:grid-cols-2">
        <img src={harvest} alt="Freshly harvested olives in weathered hands" loading="lazy" width={1200} height={1504} className="aspect-[4/5] h-full w-full object-cover" />
        <div className="flex flex-col justify-center px-6 py-24 md:px-20">
          <p className="eyebrow text-gold">The Early Harvest</p>
          <h2 className="mt-6 text-4xl md:text-6xl">Picked green, while the fruit is at its most vivid</h2>
          <p className="mt-8 max-w-lg font-display text-xl leading-relaxed text-noir-muted">
            Harvested early in the season, our olives yield less oil but far more character — a fresher, greener, more expressive taste of the Andalucian land.
          </p>
          <div className="mt-12"><Button asChild variant="luxeLight" size="xl"><Link to="/story">Our story</Link></Button></div>
        </div>
      </section>

      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden text-noir-foreground">
        <img src={groveDusk} alt="Olive groves of Andalucía at dusk" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-scrim absolute inset-0" />
        <div className="relative px-6 text-center">
          <span className="wordmark text-gold">Zafyra</span>
          <p className="mt-8 max-w-3xl font-display text-4xl italic md:text-6xl">From the groves of Andalucía to your table.</p>
          <div className="mt-12"><Button asChild variant="gold" size="xl"><Link to="/collection">Shop now</Link></Button></div>
        </div>
      </section>
    </>
  );
}

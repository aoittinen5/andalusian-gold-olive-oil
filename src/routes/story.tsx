import { createFileRoute } from "@tanstack/react-router";
import groveDusk from "@/assets/grove-dusk.jpg";
import harvest from "@/assets/harvest.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Zafyra" },
      { name: "description", content: "Zafyra brings early-harvest extra virgin olive oil from the groves of Andalucía, Spain, to your table." },
      { property: "og:title", content: "Our Story — Zafyra" },
      { property: "og:description", content: "Early-harvest extra virgin olive oil from the groves of Andalucía." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <>
      <section className="relative flex h-[80vh] items-end bg-noir text-noir-foreground">
        <img src={groveDusk} alt="Olive groves of Andalucía at dusk" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-scrim absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-12">
          <p className="eyebrow text-noir-muted">Our Story</p>
          <h1 className="mt-6 max-w-3xl text-5xl md:text-7xl">Born of the groves of Andalucía</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 py-32 md:grid-cols-2 md:px-12">
        <img src={harvest} alt="Freshly harvested olives" loading="lazy" width={1200} height={1504} className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="eyebrow text-muted-foreground">The Early Harvest</p>
          <h2 className="mt-6 text-4xl md:text-5xl">Picked green, pressed with care</h2>
          <p className="mt-8 font-display text-xl leading-relaxed text-muted-foreground">
            Early in the season, while the olives are still green, the fruit gives less oil — but far more
            character. Zafyra is made from these early-harvest olives, grown in the sun-drenched hills of
            Andalucía and bottled as two distinct varietals: the bold Picual and the delicate Arbequina.
          </p>
        </div>
      </section>
    </>
  );
}

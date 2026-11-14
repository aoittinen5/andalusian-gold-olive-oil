import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/lib/shopify";
import { VarietalCard } from "@/components/site/VarietalCard";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "The Collection — Zafyra Extra Virgin Olive Oil" },
      { name: "description", content: "Shop Zafyra Picual and Arbequina early-harvest extra virgin olive oil from Andalucía, in 500ml and 250ml." },
      { property: "og:title", content: "The Collection — Zafyra" },
      { property: "og:description", content: "Picual and Arbequina early-harvest extra virgin olive oil from Andalucía." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: CollectionPage,
});

function CollectionPage() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-32 pt-40 md:px-12">
      <div className="text-center">
        <p className="eyebrow text-muted-foreground">Extra Virgin Olive Oil</p>
        <h1 className="mt-6 text-5xl md:text-7xl">The Collection</h1>
        <span className="gold-rule mx-auto mt-10 block w-32" />
      </div>
      {products.length === 0 ? (
        <p className="mt-24 text-center font-display text-2xl italic text-muted-foreground">No products found</p>
      ) : (
        <div className="mt-24 grid gap-20 md:grid-cols-2 md:gap-10">
          {products.map((p) => (
            <VarietalCard key={p.node.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

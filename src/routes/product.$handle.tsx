import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, getVarietal, productQueryOptions } from "@/lib/shopify";
import { VARIETALS } from "@/lib/varietals";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.node.title} — Zafyra` : "Unavailable — Zafyra";
    const desc = loaderData?.node.description.slice(0, 155) ?? "Zafyra extra virgin olive oil.";
    const img = loaderData?.node.images.edges[0]?.node.url;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-20 text-center">
      <h1 className="text-4xl">Product not found</h1>
      <Button asChild variant="luxeOutline" size="xl"><Link to="/collection">View the collection</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));
  const p = product!.node;
  const variants = p.variants.edges.map((e) => e.node);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const [adding, setAdding] = useState(false);
  const varietal = getVarietal(p.title);
  const info = varietal ? VARIETALS[varietal] : null;
  const image = p.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    const ok = await addItem({ product: product!, variantId: selected.id, variantTitle: selected.title, price: selected.price, quantity: 1, selectedOptions: selected.selectedOptions });
    setAdding(false);
    if (ok) setOpen(true);
    else toast.error("Couldn't add to your bag. Please try again.");
  };

  return (
    <section className="grid min-h-screen pt-20 md:grid-cols-2">
      <div className="bg-panel flex items-center justify-center py-16">
        {image && (
          <img src={image.url} alt={image.altText ?? p.title} className={cn("h-[70vh] w-auto object-contain drop-shadow-2xl transition-all duration-700", selected?.title.includes("250") && "h-[56vh]")} />
        )}
      </div>
      <div className="flex flex-col justify-center px-6 py-20 md:px-20">
        {info && <p className={cn("eyebrow", varietal === "picual" ? "text-picual" : "text-arbequina")}>{info.character}</p>}
        <h1 className="mt-6 text-4xl md:text-6xl">{p.title}</h1>
        {selected && <p className="mt-6 font-display text-3xl">{formatPrice(selected.price)}</p>}
        <p className="mt-8 font-display text-xl leading-relaxed text-muted-foreground">{p.description}</p>
        {variants.length > 1 && (
          <div className="mt-10">
            <p className="eyebrow mb-4">Size</p>
            <div className="flex gap-2" role="radiogroup" aria-label="Size">
              {variants.map((v) => (
                <button key={v.id} role="radio" aria-checked={v.id === selected?.id} onClick={() => setVariantId(v.id)} disabled={!v.availableForSale}
                  className={cn("eyebrow h-11 min-w-24 border px-4 transition-colors disabled:opacity-40", v.id === selected?.id ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground")}>
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <Button variant="luxe" size="xl" className="mt-10 w-full md:w-auto" onClick={handleAdd} disabled={adding || !selected?.availableForSale}>
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : selected?.availableForSale ? "Add to bag" : "Sold out"}
        </Button>
        {info && (
          <dl className="mt-14 space-y-6 border-t border-border pt-10">
            <div><dt className="eyebrow">Tasting notes</dt><dd className="mt-2 text-muted-foreground">{info.notes}</dd></div>
            <div><dt className="eyebrow">Pairs with</dt><dd className="mt-2 text-muted-foreground">{info.pairings}</dd></div>
            <div><dt className="eyebrow">Origin</dt><dd className="mt-2 text-muted-foreground">Andalucía, Spain · Early harvest</dd></div>
          </dl>
        )}
      </div>
    </section>
  );
}

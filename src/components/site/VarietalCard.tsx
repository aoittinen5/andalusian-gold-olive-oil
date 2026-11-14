import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, getVarietal, type ShopifyProduct } from "@/lib/shopify";
import { VARIETALS } from "@/lib/varietals";
import { cn } from "@/lib/utils";

export function VarietalCard({ product, tone = "light" }: { product: ShopifyProduct; tone?: "light" | "dark" }) {
  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const [adding, setAdding] = useState(false);
  const varietal = getVarietal(p.title);
  const info = varietal ? VARIETALS[varietal] : null;
  const image = p.images.edges[0]?.node;
  const isSmall = selected?.title.includes("250");

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    const ok = await addItem({
      product,
      variantId: selected.id,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      selectedOptions: selected.selectedOptions,
    });
    setAdding(false);
    if (ok) setOpen(true);
    else toast.error("Couldn't add to your bag. Please try again.");
  };

  const dark = tone === "dark";

  return (
    <article className={cn("group flex flex-col", dark ? "text-noir-foreground" : "text-foreground")}>
      <Link
        to="/product/$handle"
        params={{ handle: p.handle }}
        className={cn(
          "relative flex aspect-[4/5] items-end justify-center overflow-hidden pb-[6%]",
          dark ? "bg-panel-noir" : "bg-panel",
        )}
      >
        {image && (
          <img
            src={image.url}
            alt={image.altText ?? p.title}
            loading="lazy"
            className={cn(
              "h-[86%] w-auto object-contain drop-shadow-2xl transition-transform duration-[1200ms] ease-out group-hover:-translate-y-2",
              isSmall && "h-[70%]",
            )}
          />
        )}
      </Link>

      <div className="flex flex-col items-center pt-10 text-center">
        {info && (
          <span className={cn("eyebrow", varietal === "picual" ? "text-picual" : "text-arbequina")}>
            {info.character}
          </span>
        )}
        <Link to="/product/$handle" params={{ handle: p.handle }}>
          <h3 className="wordmark mt-4 text-2xl md:text-3xl">{info?.name ?? p.title}</h3>
        </Link>
        {info && (
          <p className={cn("mt-3 font-display text-lg italic", dark ? "text-noir-muted" : "text-muted-foreground")}>
            {info.notes}
          </p>
        )}

        {variants.length > 1 && (
          <div className="mt-8 flex gap-2" role="radiogroup" aria-label="Size">
            {variants.map((v) => (
              <button
                key={v.id}
                role="radio"
                aria-checked={v.id === selected?.id}
                onClick={() => setVariantId(v.id)}
                disabled={!v.availableForSale}
                className={cn(
                  "eyebrow h-10 min-w-20 border px-4 transition-colors disabled:opacity-40",
                  v.id === selected?.id
                    ? dark
                      ? "border-noir-foreground bg-noir-foreground text-noir"
                      : "border-foreground bg-foreground text-background"
                    : dark
                      ? "border-noir-foreground/30 hover:border-noir-foreground"
                      : "border-border hover:border-foreground",
                )}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        {selected && <p className="mt-6 font-display text-2xl">{formatPrice(selected.price)}</p>}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant={dark ? "gold" : "luxe"}
            size="xl"
            onClick={handleAdd}
            disabled={adding || !selected?.availableForSale}
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : selected?.availableForSale ? "Add to bag" : "Sold out"}
          </Button>
          <Button asChild variant={dark ? "luxeLight" : "luxeOutline"} size="xl">
            <Link to="/product/$handle" params={{ handle: p.handle }}>
              Discover
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

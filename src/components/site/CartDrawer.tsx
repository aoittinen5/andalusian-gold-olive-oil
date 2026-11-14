import { useEffect } from "react";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + Number.parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "USD";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full w-full flex-col border-l-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-8 py-7 text-left">
          <SheetTitle className="wordmark text-sm">Your Bag</SheetTitle>
          <SheetDescription className="eyebrow text-muted-foreground">
            {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-display text-2xl italic text-muted-foreground">Your bag is empty.</p>
            <Button variant="luxeOutline" size="xl" onClick={() => setOpen(false)}>
              Continue browsing
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-8">
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const image = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <li key={item.variantId} className="flex gap-5 py-6">
                      <div className="bg-panel flex h-28 w-20 shrink-0 items-center justify-center">
                        {image && (
                          <img
                            src={image.url}
                            alt={item.product.node.title}
                            className="h-24 w-auto object-contain"
                          />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-display text-lg leading-tight">{item.product.node.title}</h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`Remove ${item.product.node.title}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="eyebrow mt-1 text-muted-foreground">
                          {item.selectedOptions.map((o) => o.value).join(" · ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center border border-border">
                            <button
                              className="flex h-8 w-8 items-center justify-center hover:bg-secondary"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="flex h-8 w-8 items-center justify-center hover:bg-secondary"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-5 border-t border-border px-8 py-7">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-display text-2xl">
                  {formatPrice({ amount: String(totalPrice), currencyCode: currency })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Button
                onClick={handleCheckout}
                variant="luxe"
                size="xl"
                className="w-full"
                disabled={items.length === 0 || isLoading || isSyncing}
              >
                {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

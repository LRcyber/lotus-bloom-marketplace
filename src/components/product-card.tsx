import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/lib/catalog";
import { ProductVisual } from "@/components/product-visual";
import { StatusBadge } from "@/components/status-badge";
import { useStore } from "@/components/store-provider";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useStore();
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-product transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <Link to="/produto/$productId" params={{ productId: product.id }} className="overflow-hidden focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
        <ProductVisual name={product.name} imageUrl={product.imageUrl} index={index} className="transition-transform duration-300 group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-primary">{product.category}</p>
          <StatusBadge stock={product.stock} />
        </div>
        <Link to="/produto/$productId" params={{ productId: product.id }} className="mt-2 font-display text-lg font-semibold text-foreground hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.unit}</p>
        <p className="mt-4 text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
          <div className="flex h-11 items-center rounded-md border border-input bg-background">
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus /></Button>
            <span className="w-7 text-center text-sm" aria-live="polite">{quantity}</span>
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => setQuantity((q) => q + 1)}><Plus /></Button>
          </div>
          <Button className="h-11 min-w-0 px-3" disabled={product.stock < 1 || product.price === null} onClick={() => addItem(product, quantity)}>
            <ShoppingBag /><span className="truncate">Adicionar</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

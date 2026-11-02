import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { ProductVisual } from "@/components/product-visual";
import { StatusBadge } from "@/components/status-badge";
import { StoreShell } from "@/components/store-shell";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/catalog";
import { demoCatalogQueryOptions as catalogQueryOptions } from "@/lib/demo-catalog";

export const Route = createFileRoute("/produto/$productId")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({ meta: [
    { title: "Produto — Loja virtual" }, { name: "description", content: "Consulte detalhes e disponibilidade deste produto na loja virtual." },
    { property: "og:title", content: "Produto — Loja virtual" }, { property: "og:description", content: "Detalhes e disponibilidade do produto na loja virtual." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ProductPage,
  errorComponent: () => <StoreShell><div role="alert" className="mx-auto max-w-7xl px-6 py-20"><h1 className="text-3xl font-semibold">Produto indisponível</h1><p className="mt-3 text-muted-foreground">Não foi possível carregar este produto agora.</p></div></StoreShell>,
  notFoundComponent: () => <StoreShell><div className="mx-auto max-w-7xl px-6 py-20"><h1 className="text-3xl font-semibold">Produto não encontrado</h1></div></StoreShell>,
});

function ProductPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const products = data.products;
  const { productId } = Route.useParams();
  const product = products.find((item) => item.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useStore();
  if (!product) return <StoreShell><div className="mx-auto max-w-7xl px-6 py-20"><h1 className="text-3xl font-semibold">Produto não encontrado</h1><Button asChild className="mt-6"><Link to="/catalogo" search={{ categoria: undefined }}>Voltar ao catálogo</Link></Button></div></StoreShell>;
  return (
    <StoreShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <nav className="text-sm text-muted-foreground"><Link to="/catalogo" search={{ categoria: undefined }} className="hover:text-primary">Catálogo</Link> / {product.name}</nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
          <ProductVisual name={product.name} category={product.category} imageUrl={product.imageUrl} className="rounded-lg border border-border" />
          <div className="lg:py-6"><p className="text-eyebrow">{product.category}</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{product.name}</h1><p className="mt-3 text-muted-foreground">Venda por {product.unit}.</p><div className="mt-6"><StatusBadge stock={product.stock} /></div><p className="mt-6 text-3xl font-bold">{formatPrice(product.price)}</p><p className="mt-2 text-sm text-muted-foreground">{product.stock} unidades disponíveis para pedido.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex h-12 w-fit items-center rounded-md border border-input bg-card"><Button variant="ghost" size="icon" className="size-11" aria-label="Diminuir quantidade" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus /></Button><span className="w-10 text-center" aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" className="size-11" aria-label="Aumentar quantidade" onClick={() => setQuantity((q) => q + 1)}><Plus /></Button></div><Button size="lg" className="h-12 sm:flex-1" disabled={product.price === null || product.stock < 1} onClick={() => addItem(product, quantity)}><ShoppingBag />Adicionar ao carrinho</Button></div>
            {product.price === null && <p className="mt-3 text-sm text-warning-foreground">Entre em contato para consultar o preço deste item.</p>}
          </div>
        </div>
        <section className="mt-16 border-t border-border pt-12"><h2 className="text-3xl font-semibold">Você também pode gostar</h2><div className="mt-6"><ProductGrid products={products.filter((item) => item.id !== product.id).slice(0, 4)} /></div></section>
      </div>
    </StoreShell>
  );
}

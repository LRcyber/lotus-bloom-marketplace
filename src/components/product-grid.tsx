import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="border-y border-border py-16 text-center text-muted-foreground">Nenhum produto encontrado.</div>;
  return <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>;
}

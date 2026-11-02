import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { StoreShell } from "@/components/store-shell";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoCatalogQueryOptions as catalogQueryOptions } from "@/lib/demo-catalog";

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>) => ({ ['categoria']: typeof search['categoria'] === "string" ? search['categoria'] : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({ meta: [
    { title: "Catálogo — Loja virtual" },
    { name: "description", content: "Catálogo com produtos, preços de varejo e condições para atacado." },
    { property: "og:title", content: "Catálogo — Loja virtual" },
    { property: "og:description", content: "Consulte os produtos disponíveis na loja virtual." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Catalogo,
  errorComponent: () => <StoreShell><div role="alert" className="mx-auto max-w-7xl px-6 py-20"><h1 className="text-3xl font-semibold">Catálogo indisponível</h1><p className="mt-3 text-muted-foreground">Não foi possível carregar os produtos agora.</p></div></StoreShell>,
  notFoundComponent: () => <StoreShell><div className="mx-auto max-w-7xl px-6 py-20"><h1 className="text-3xl font-semibold">Catálogo não encontrado</h1></div></StoreShell>,
});

function FilterList({ categories, selected, onSelect }: { categories: string[]; selected: string; onSelect: (value: string) => void }) {
  return <div><p className="mb-3 font-display text-lg font-semibold">Categorias</p><div className="flex flex-col gap-1">{categories.map((category) => <Button key={category} variant={selected === category ? "secondary" : "ghost"} className="min-h-11 justify-start" onClick={() => onSelect(category)}>{category}</Button>)}</div></div>;
}

function Catalogo() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const categories = ["Todos", ...data.categories];
  const products = data.products;
  const { ['categoria']: categoria } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categoria && categories.includes(categoria) ? categoria : "Todos");
  const [order, setOrder] = useState("relevancia");
  const filtered = useMemo(() => {
    const result = products.filter((product) => (category === "Todos" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));
    if (order === "menor") return [...result].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (order === "maior") return [...result].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return result;
  }, [query, category, order]);
  return (
    <StoreShell>
      <section className="border-b border-border bg-card"><div className="mx-auto w-full max-w-7xl px-6 py-10"><p className="text-eyebrow">Loja virtual</p><h1 className="mt-2 text-4xl font-semibold">Catálogo</h1><p className="mt-3 max-w-2xl text-muted-foreground">Busque por nome ou navegue pelas categorias disponíveis.</p><SearchBar value={query} onChange={setQuery} className="mt-6 max-w-2xl" /></div></section>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block"><FilterList categories={categories} selected={category} onSelect={setCategory} /></aside>
        <section aria-labelledby="catalog-results" className="min-w-0">
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <p id="catalog-results" className="min-w-0 text-sm text-muted-foreground"><strong className="text-foreground">{filtered.length}</strong> produtos encontrados</p>
            <div className="flex shrink-0 gap-2">
              <Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="size-11 lg:hidden" aria-label="Abrir filtros"><SlidersHorizontal /></Button></SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>Filtros</SheetTitle></SheetHeader><div className="mt-8"><FilterList categories={categories} selected={category} onSelect={setCategory} /></div></SheetContent></Sheet>
              <Select value={order} onValueChange={setOrder}><SelectTrigger className="h-11 w-40"><SelectValue placeholder="Ordenar" /></SelectTrigger><SelectContent><SelectItem value="relevancia">Relevância</SelectItem><SelectItem value="menor">Menor preço</SelectItem><SelectItem value="maior">Maior preço</SelectItem></SelectContent></Select>
            </div>
          </div>
          <ProductGrid products={filtered} />
        </section>
      </div>
    </StoreShell>
  );
}

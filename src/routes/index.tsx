import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import logoAsset from "@/assets/lotus-73-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { StoreShell } from "@/components/store-shell";
import { categories, products } from "@/lib/mock-products";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Lotus 73 — Tabacaria e loja virtual" },
    { name: "description", content: "Catálogo online da Lotus 73 para compras no varejo e condições de atacado." },
    { property: "og:title", content: "Lotus 73 — Tabacaria e loja virtual" },
    { property: "og:description", content: "Conheça o catálogo da Lotus 73 e encontre produtos para sua compra." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});

const categoryIcons = [Sparkles, PackageCheck, ShieldCheck, Building2];

function Home() {
  return (
    <StoreShell>
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_340px] md:py-16">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-accent">Catálogo para varejo e atacado</p>
            <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">Lotus 73, agora com pedidos pela loja virtual</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">Encontre o que precisa, organize seu pedido e acompanhe cada etapa com praticidade.</p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Button size="lg" asChild className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/catalogo" search={{ categoria: undefined }}>Ver catálogo <ArrowRight /></Link></Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"><Link to="/atacado">Comprar no atacado</Link></Button>
            </div>
          </div>
          <img src={logoAsset.url} alt="Lotus 73 Tabacaria" className="mx-auto w-full max-w-72 rounded-full object-contain md:max-w-80" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12" aria-labelledby="categorias-title">
        <div className="flex items-end justify-between gap-4"><div><p className="text-eyebrow">Encontre rápido</p><h2 id="categorias-title" className="mt-2 text-3xl font-semibold">Categorias</h2></div><Link to="/catalogo" search={{ categoria: undefined }} className="hidden text-sm font-semibold text-primary sm:inline">Ver todas</Link></div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{categories.slice(1).map((category, index) => { const Icon = categoryIcons[index] ?? Sparkles; return <Link key={category} to="/catalogo" search={{ categoria: category }} className="flex min-h-28 flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-product transition-colors hover:border-primary"><Icon className="size-6 text-primary" /><span className="font-display text-lg font-semibold">{category}</span></Link>; })}</div>
      </section>

      <section className="border-y border-border bg-card"><div className="mx-auto w-full max-w-7xl px-6 py-14"><div className="flex items-end justify-between gap-4"><div><p className="text-eyebrow">Seleção Lotus 73</p><h2 className="mt-2 text-3xl font-semibold">Produtos em destaque</h2></div><Button variant="outline" asChild className="hidden sm:inline-flex"><Link to="/catalogo" search={{ categoria: undefined }}>Ver catálogo</Link></Button></div><div className="mt-7"><ProductGrid products={products.filter((product) => product.featured)} /></div></div></section>

      <section className="mx-auto w-full max-w-7xl px-6 py-14"><div className="grid gap-6 border-y border-border py-10 md:grid-cols-3"><div><ShieldCheck className="size-6 text-primary"/><h2 className="mt-4 text-xl font-semibold">Compra organizada</h2><p className="mt-2 text-sm text-muted-foreground">Revise produtos e quantidades antes de finalizar.</p></div><div><PackageCheck className="size-6 text-primary"/><h2 className="mt-4 text-xl font-semibold">Disponibilidade clara</h2><p className="mt-2 text-sm text-muted-foreground">Consulte a indicação de estoque em cada item.</p></div><div><Building2 className="size-6 text-primary"/><h2 className="mt-4 text-xl font-semibold">Condições para revenda</h2><p className="mt-2 text-sm text-muted-foreground">Preços de atacado para cadastros aprovados.</p></div></div></section>
    </StoreShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Lotus 73" },
      {
        name: "description",
        content:
          "Catálogo da tabacaria Lotus 73. Produtos, preços de varejo e condições de atacado para clientes aprovados.",
      },
      { property: "og:title", content: "Catálogo — Lotus 73" },
      {
        property: "og:description",
        content: "Produtos da Lotus 73 com preços conforme o seu canal de compra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <p className="text-eyebrow">Catálogo</p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">Produtos</h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Os produtos serão exibidos aqui na próxima etapa, quando o catálogo passar a
          carregar as informações reais da loja.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-panel h-56 animate-pulse bg-muted/40" />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

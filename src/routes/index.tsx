import { createFileRoute, Link } from "@tanstack/react-router";

import heroImage from "@/assets/hero-lotus73.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lotus 73 — Tabacaria com venda no varejo e atacado" },
      {
        name: "description",
        content:
          "Catálogo da tabacaria Lotus 73 com preços de varejo e condições especiais para clientes atacadistas aprovados.",
      },
      { property: "og:title", content: "Lotus 73 — Tabacaria varejo e atacado" },
      {
        property: "og:description",
        content:
          "Conheça o catálogo da Lotus 73 e solicite acesso às condições de atacado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    title: "Catálogo único",
    text: "Os mesmos produtos para todos os clientes; apenas a regra de preço muda conforme o canal.",
  },
  {
    title: "Atacado aprovado",
    text: "Cadastre o CNPJ e, após aprovação da equipe, os preços de atacado passam a valer.",
  },
  {
    title: "Pedido acompanhado",
    text: "Cada pedido tem status atualizado pela equipe, do recebimento até a entrega.",
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <img
            src={heroImage}
            alt="Balcão de tabacaria com charutos em umidificador e folhas de tabaco"
            width={1600}
            height={1008}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-28">
            <p className="text-eyebrow">Tabacaria desde o primeiro balcão</p>
            <h1 className="mt-4 max-w-2xl text-5xl leading-tight font-semibold text-foreground md:text-6xl">
              Lotus 73, agora com pedidos pela loja virtual
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground">
              Navegue pelo catálogo, monte seu pedido e acompanhe cada etapa. Clientes
              atacadistas aprovados veem automaticamente suas condições.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ver catálogo
              </Link>
              <Link
                to="/atacado"
                className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Sou atacadista
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="surface-panel p-6">
              <h2 className="text-xl font-semibold text-foreground">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/atacado")({
  head: () => ({
    meta: [
      { title: "Atacado — Lotus 73" },
      {
        name: "description",
        content:
          "Como funciona o atacado na Lotus 73: cadastro com CNPJ, aprovação pela equipe e preços de atacado liberados.",
      },
      { property: "og:title", content: "Atacado — Lotus 73" },
      {
        property: "og:description",
        content: "Cadastre seu CNPJ e compre com as condições de atacado da Lotus 73.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Atacado,
});

const steps = [
  { n: "01", t: "Cadastro", d: "Você cria sua conta e informa o CNPJ da empresa." },
  { n: "02", t: "Análise", d: "A equipe da Lotus 73 confere os dados e aprova o cadastro." },
  { n: "03", t: "Preços liberados", d: "Aprovado, o catálogo passa a mostrar seus preços de atacado." },
];

function Atacado() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <p className="text-eyebrow">Atacado</p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          Condições especiais para revenda
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          O catálogo é o mesmo para todos. O que muda é o preço: apenas cadastros de
          atacado aprovados enxergam os valores de atacado. Enquanto a aprovação não sai,
          os preços exibidos são os de varejo.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="surface-panel p-6">
              <span className="text-eyebrow">{s.n}</span>
              <h2 className="mt-3 text-xl font-semibold text-foreground">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-xs text-muted-foreground">
          O cadastro com CNPJ será ativado na etapa de contas de cliente.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

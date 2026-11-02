import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreShell } from "@/components/store-shell";

export const Route = createFileRoute("/atacado")({
  head: () => ({ meta: [
    { title: "Atacado — Loja virtual" }, { name: "description", content: "Entenda as condições de compra no atacado da loja virtual." },
    { property: "og:title", content: "Atacado — Loja virtual" }, { property: "og:description", content: "Cadastro e aprovação para condições de atacado da loja virtual." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Atacado,
});

const steps = [
  { n: "01", t: "Cadastro", d: "Crie sua conta e informe os dados da empresa e o CNPJ." },
  { n: "02", t: "Análise", d: "A equipe confere os dados enviados antes da liberação." },
  { n: "03", t: "Condições liberadas", d: "Após aprovação, o catálogo apresenta os preços de atacado." },
];

function Atacado() {
  return <StoreShell><section className="bg-foreground text-background"><div className="mx-auto max-w-7xl px-6 py-14 sm:py-20"><p className="text-sm font-semibold text-accent">Venda para empresas</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">Condições especiais para revenda</h1><p className="mt-5 max-w-2xl text-background/75">O catálogo é o mesmo. Clientes atacadistas aprovados visualizam as condições correspondentes ao seu cadastro.</p><Button asChild size="lg" className="mt-8 h-12 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/catalogo" search={{ categoria: undefined }}>Conhecer o catálogo <ArrowRight /></Link></Button></div></section><section className="mx-auto max-w-7xl px-6 py-14"><p className="text-eyebrow">Como funciona</p><h2 className="mt-2 text-3xl font-semibold">Três etapas simples</h2><ol className="mt-8 grid gap-4 md:grid-cols-3">{steps.map((step) => <li key={step.n} className="surface-panel p-6"><span className="text-sm font-bold text-accent">{step.n}</span><CheckCircle2 className="mt-8 size-6 text-primary"/><h3 className="mt-4 text-xl font-semibold">{step.t}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.d}</p></li>)}</ol><div className="mt-10 border-l-4 border-warning bg-card p-5 text-sm text-muted-foreground"><strong className="text-foreground">Cadastro ainda não disponível.</strong> A criação de contas será ativada em uma próxima etapa.</div></section></StoreShell>;
}

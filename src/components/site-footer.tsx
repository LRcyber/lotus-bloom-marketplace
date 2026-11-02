import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><p className="font-display text-xl font-semibold">Loja virtual</p><p className="mt-4 max-w-sm text-sm text-background/70">Catálogo para compras no varejo e condições especiais para clientes atacadistas aprovados.</p></div>
        <div><p className="font-display font-semibold">Navegação</p><nav className="mt-4 flex flex-col gap-3 text-sm text-background/70"><Link to="/">Início</Link><Link to="/catalogo" search={{ categoria: undefined }}>Catálogo</Link><Link to="/atacado">Atacado</Link></nav></div>
        <div><p className="font-display font-semibold">Atendimento</p><p className="mt-4 text-sm text-background/70">Contato e horários pendentes de definição.</p></div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchBar } from "@/components/search-bar";
import { useStore } from "@/components/store-provider";

const nav = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/atacado", label: "Atacado" },
] as const;

export function SiteHeader() {
  const { count, setCartOpen } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <Sheet>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Abrir menu"><Menu /></Button></SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">{nav.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} className="flex min-h-11 items-center border-b border-border text-base font-medium">{item.label}</Link></SheetClose>)}</nav>
          </SheetContent>
        </Sheet>
        <Link to="/" aria-label="Loja virtual — Início" className="min-w-0 font-display text-lg font-semibold sm:text-xl lg:col-start-1">
          Loja virtual
        </Link>
        <SearchBar className="hidden min-w-0 md:block lg:mx-6" />
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" className="size-11" aria-label="Acessar conta"><UserRound /></Button>
          <Button variant="ghost" size="icon" className="relative size-11" aria-label={`Abrir carrinho com ${count} itens`} onClick={() => setCartOpen(true)}>
            <ShoppingBag />{count > 0 && <span className="absolute top-0.5 right-0.5 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{count}</span>}
          </Button>
        </div>
        <SearchBar className="col-span-3 md:hidden" />
      </div>
      <nav className="hidden border-t border-border lg:block" aria-label="Navegação principal">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-8 px-6">
          {nav.map((item) => <Link key={item.to} to={item.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" activeProps={{ className: "text-sm font-semibold text-primary" }} activeOptions={{ exact: item.to === "/" }}>{item.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}

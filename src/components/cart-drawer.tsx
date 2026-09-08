import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/mock-products";
import { useStore } from "@/components/store-provider";

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, updateQuantity, removeItem, total } = useStore();
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl">Seu carrinho</SheetTitle>
          <SheetDescription>{items.length ? `${items.length} produto(s) selecionado(s)` : "Seu carrinho está vazio"}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!items.length ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 font-semibold">Comece pelo catálogo</p>
              <p className="mt-1 max-w-60 text-sm text-muted-foreground">Adicione produtos para revisar seu pedido aqui.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="font-semibold text-foreground">{product.name}</p><p className="text-sm text-muted-foreground">{product.unit}</p></div>
                    <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label={`Remover ${product.name}`} onClick={() => removeItem(product.id)}><Trash2 /></Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex h-11 items-center rounded-md border border-input">
                      <Button variant="ghost" size="icon" className="size-11" aria-label="Diminuir quantidade" onClick={() => updateQuantity(product.id, quantity - 1)}><Minus /></Button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <Button variant="ghost" size="icon" className="size-11" aria-label="Aumentar quantidade" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus /></Button>
                    </div>
                    <p className="font-semibold">{formatPrice((product.price ?? 0) * quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="border-t border-border p-6">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-lg"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <Button className="h-12 w-full" disabled={!items.length}>Ir para checkout</Button>
            <SheetClose asChild><Button variant="outline" className="h-11 w-full">Continuar comprando</Button></SheetClose>
            <p className="text-center text-xs text-muted-foreground">Pagamento e frete serão definidos em uma próxima etapa.</p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

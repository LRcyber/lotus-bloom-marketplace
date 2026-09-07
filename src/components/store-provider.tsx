import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/mock-products";

type CartItem = { product: Product; quantity: number };
type StoreContextValue = {
  items: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  count: number;
  total: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const value = useMemo<StoreContextValue>(() => ({
    items,
    cartOpen,
    setCartOpen,
    addItem: (product, quantity = 1) => {
      setItems((current) => {
        const found = current.find((item) => item.product.id === product.id);
        return found
          ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...current, { product, quantity }];
      });
      setCartOpen(true);
    },
    updateQuantity: (id, quantity) => setItems((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.product.id !== id)),
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0),
  }), [items, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}

import { queryOptions } from "@tanstack/react-query";
import type { CatalogData, Product } from "@/lib/catalog";

const examples = [
  { id: "demo-garrafa", name: "Garrafa térmica", category: "Casa e cozinha", price: 59.9, stock: 24 },
  { id: "demo-caneca", name: "Caneca de cerâmica", category: "Casa e cozinha", price: 24.9, stock: 36 },
  { id: "demo-caderno", name: "Caderno pautado", category: "Papelaria", price: 18.5, stock: 48 },
  { id: "demo-canetas", name: "Kit de canetas", category: "Papelaria", price: 12.9, stock: 60 },
  { id: "demo-mochila", name: "Mochila casual", category: "Acessórios", price: 129.9, stock: 12 },
  { id: "demo-estojo", name: "Estojo organizador", category: "Acessórios", price: 29.9, stock: 0 },
  { id: "demo-suporte", name: "Suporte para celular", category: "Tecnologia", price: 39.9, stock: 18 },
  { id: "demo-fone", name: "Fone sem fio", category: "Tecnologia", price: null, stock: 8 },
];

export const demoCatalog: CatalogData = {
  categories: ["Casa e cozinha", "Papelaria", "Acessórios", "Tecnologia"],
  products: examples.map((example, index): Product => ({
    ...example,
    code: `DEMO-${String(index + 1).padStart(3, "0")}`,
    barcode: null,
    categoryId: null,
    unit: "unidade",
    imageUrl: null,
  })),
};

// A separate key keeps simulated data isolated from the real public catalog.
export const demoCatalogQueryOptions = queryOptions({
  queryKey: ["demo-catalog"],
  queryFn: async (): Promise<CatalogData> => demoCatalog,
});
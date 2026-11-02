import { queryOptions } from "@tanstack/react-query";
import garrafaTermica from "@/assets/produto-garrafa-termica.jpg.asset.json";
import canecaCeramica from "@/assets/produto-caneca-ceramica.jpg.asset.json";
import cadernoPautado from "@/assets/produto-caderno-pautado.jpg.asset.json";
import kitCanetas from "@/assets/produto-kit-canetas.jpg.asset.json";
import mochilaCasual from "@/assets/produto-mochila-casual.jpg.asset.json";
import estojoOrganizador from "@/assets/produto-estojo-organizador.jpg.asset.json";
import suporteCelular from "@/assets/produto-suporte-celular.jpg.asset.json";
import foneSemFio from "@/assets/produto-fone-sem-fio.jpg.asset.json";
import type { CatalogData, Product } from "@/lib/catalog";

const examples = [
  { id: "demo-garrafa", name: "Garrafa térmica", category: "Casa e cozinha", price: 59.9, stock: 24, imageUrl: garrafaTermica.url },
  { id: "demo-caneca", name: "Caneca de cerâmica", category: "Casa e cozinha", price: 24.9, stock: 36, imageUrl: canecaCeramica.url },
  { id: "demo-caderno", name: "Caderno pautado", category: "Papelaria", price: 18.5, stock: 48, imageUrl: cadernoPautado.url },
  { id: "demo-canetas", name: "Kit de canetas", category: "Papelaria", price: 12.9, stock: 60, imageUrl: kitCanetas.url },
  { id: "demo-mochila", name: "Mochila casual", category: "Acessórios", price: 129.9, stock: 12, imageUrl: mochilaCasual.url },
  { id: "demo-estojo", name: "Estojo organizador", category: "Acessórios", price: 29.9, stock: 0, imageUrl: estojoOrganizador.url },
  { id: "demo-suporte", name: "Suporte para celular", category: "Tecnologia", price: 39.9, stock: 18, imageUrl: suporteCelular.url },
  { id: "demo-fone", name: "Fone sem fio", category: "Tecnologia", price: null, stock: 8, imageUrl: foneSemFio.url },
];

export const demoCatalog: CatalogData = {
  categories: ["Casa e cozinha", "Papelaria", "Acessórios", "Tecnologia"],
  products: examples.map((example, index): Product => ({
    ...example,
    code: `DEMO-${String(index + 1).padStart(3, "0")}`,
    barcode: null,
    categoryId: null,
    unit: "unidade",
  })),
};

// A separate key keeps simulated data isolated from the real public catalog.
export const demoCatalogQueryOptions = queryOptions({
  queryKey: ["demo-catalog"],
  queryFn: async (): Promise<CatalogData> => demoCatalog,
});

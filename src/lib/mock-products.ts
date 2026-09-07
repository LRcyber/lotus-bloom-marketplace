export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number | null;
  stock: number;
  featured?: boolean;
};

export const categories = ["Todos", "Acessórios", "Armazenamento", "Cuidados", "Presentes"];

export const products: Product[] = [
  { id: "estojo-classico", name: "Estojo clássico", category: "Armazenamento", unit: "unidade", price: 89.9, stock: 12, featured: true },
  { id: "cortador-metal", name: "Cortador em metal", category: "Acessórios", unit: "unidade", price: 42.5, stock: 18, featured: true },
  { id: "umidificador-portatil", name: "Umidificador portátil", category: "Cuidados", unit: "unidade", price: 34.9, stock: 7, featured: true },
  { id: "kit-presente", name: "Kit para presente", category: "Presentes", unit: "kit", price: 149.9, stock: 4, featured: true },
  { id: "cinzeiro-ceramica", name: "Cinzeiro em cerâmica", category: "Acessórios", unit: "unidade", price: 64.9, stock: 9 },
  { id: "porta-acessorios", name: "Porta-acessórios", category: "Armazenamento", unit: "unidade", price: null, stock: 5 },
  { id: "escova-limpeza", name: "Escova para limpeza", category: "Cuidados", unit: "unidade", price: 19.9, stock: 21 },
  { id: "embalagem-presente", name: "Embalagem para presente", category: "Presentes", unit: "unidade", price: 14.9, stock: 30 },
];

export const formatPrice = (price: number | null) =>
  price === null || price <= 0
    ? "Preço sob consulta"
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

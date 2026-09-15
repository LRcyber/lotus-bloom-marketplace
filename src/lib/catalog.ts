export type Product = {
  id: string;
  code: string;
  barcode: string | null;
  name: string;
  category: string;
  categoryId: string | null;
  unit: string;
  price: number | null;
  stock: number;
  imageUrl: string | null;
};

export type CatalogData = {
  categories: string[];
  products: Product[];
};

export const formatPrice = (price: number | null) =>
  price === null || price <= 0
    ? "Preço sob consulta"
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
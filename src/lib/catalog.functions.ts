import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";
import type { CatalogData, Product } from "@/lib/catalog";

function createPublicClient() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];

  if (!url || !key) throw new Error("O catálogo está temporariamente indisponível.");

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getPublicCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<CatalogData> => {
  const supabasePublic = createPublicClient();
  const [productsResult, categoriesResult] = await Promise.all([
    supabasePublic
      .from("catalog_products")
      .select("id, cod_produto, nome, unidade, codigo_barras, category_id, imagem_url, estoque, preco")
      .order("nome"),
    supabasePublic
      .from("categories")
      .select("id, name")
      .eq("active", true)
      .order("sort_order")
      .order("name"),
  ]);

  if (productsResult.error || categoriesResult.error) {
    console.error("Falha ao carregar catálogo público", {
      products: productsResult.error?.code,
      categories: categoriesResult.error?.code,
    });
    throw new Error("Não foi possível carregar o catálogo.");
  }

  const categoryNames = new Map(categoriesResult.data.map((category) => [category.id, category.name]));
  const products: Product[] = productsResult.data.flatMap((row) => {
    if (!row.id || !row.cod_produto || !row.nome || !row.unidade) return [];
    return [{
      id: row.id,
      code: row.cod_produto,
      barcode: row.codigo_barras,
      name: row.nome,
      category: row.category_id ? (categoryNames.get(row.category_id) ?? "Outros") : "Outros",
      categoryId: row.category_id,
      unit: row.unidade,
      price: row.preco !== null && row.preco > 0 ? row.preco : null,
      stock: row.estoque ?? 0,
      imageUrl: row.imagem_url,
    }];
  });

  return {
    categories: categoriesResult.data.map((category) => category.name),
    products,
  };
});
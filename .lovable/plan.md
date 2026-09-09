# Etapa 03 — Backend e banco de dados

Sem alterações visuais: identidade, componentes e páginas da etapa anterior permanecem intactos. Nada de LJ Sistemas, n8n, WhatsApp, pagamento, frete ou login Google.

O backend (Lovable Cloud / Postgres) ainda não está ativo neste projeto; a primeira ação da etapa é habilitá-lo.

## 1. Estrutura de dados (uma migration única)

Convenções: PK `uuid default gen_random_uuid()`, `timestamptz`, RLS habilitada em todas as tabelas, GRANTs explícitos por tabela, `updated_at` via trigger.

Tipos enum: `app_role('admin','staff','customer')`, `customer_type('retail','wholesale')`, `wholesale_status('pending','approved','rejected')`, `order_channel('retail','wholesale')`, `order_status('recebido','confirmado','em_preparacao','saiu_entrega','entregue','cancelado')`, `lj_sync_status('not_sent','pending','sent','error')`, `sync_entity('products','stock','sales')`, `integration_name('lj','n8n','whatsapp')`, `integration_direction('outbound','inbound')`.

Tabelas, na ordem de criação:

1. `user_roles` — user_id → auth.users, role, created_at, unique(user_id, role).
2. `profiles` — id = auth.users.id, full_name, phone, email, customer_type, created_at, updated_at.
3. `customers` — profile_id unique → profiles, document unique, document_type, company_name, notes.
4. `wholesale_customers` — customer_id unique, cnpj not null, company_name, state_registration, status default 'pending', reviewed_by, reviewed_at, rejection_reason.
5. `categories` — name, slug unique, sort_order, active, created_at.
6. `products` — cod_produto text unique not null, nome, unidade, codigo_barras, category_id → categories, preco_varejo, preco_atacado, estoque numeric(12,3), ativo, ultima_sincronizacao, imagem_url nullable, payload_bruto jsonb, created_at, updated_at.
7. `product_images` — product_id → products (cascade), url, sort_order, is_primary.
8. `addresses` — customer_id → customers (cascade), cep, logradouro, numero, complemento, bairro, cidade, uf, is_default.
9. `orders` — order_number unique, customer_id, channel, status default 'recebido', subtotal, discount, shipping, payment_method (previsto, sem regra), address_id, customer_notes, lj_sync_status default 'not_sent', lj_sale_id, lj_synced_at, idempotency_key unique, created_at, updated_at.
10. `order_items` — order_id (cascade), product_id, cod_produto_snapshot, nome_snapshot, unidade_snapshot, quantidade > 0, unit_price, line_total.
11. `order_status_history` — order_id, from_status, to_status, changed_by, changed_at.
12. `sync_control` — entity unique, last_run_at, last_success_at, cursor (documentado: não usado para paginação do LJ), status, error_message, running.
13. `integration_logs` — integration, direction, operation, reference_id, request_payload, response_payload, http_status, success, error_message, created_at.

## 2. Relacionamentos

```text
auth.users ─┬─ user_roles
            └─ profiles ── customers ─┬─ wholesale_customers (1:1)
                                      ├─ addresses (1:N)
                                      └─ orders (1:N) ─┬─ order_items ── products
                                                       └─ order_status_history
categories ── products ── product_images
```

## 3. Segurança (RLS)

- Função `public.has_role(_user_id uuid, _role app_role)` — SQL, stable, security definer, `search_path = public`. Papel nunca no profile.
- Função auxiliar `public.current_customer_id()` (security definer) para políticas de dados do cliente.
- `profiles` / `customers` / `addresses`: dono lê e escreve o próprio; admin e staff leem tudo; admin escreve.
- `wholesale_customers`: cliente lê e insere o próprio; somente admin altera `status` e campos de revisão.
- `categories` / `products` / `product_images`: SELECT público (`anon` e `authenticated`) apenas de registros ativos; escrita somente admin/staff e service_role.
- `orders` / `order_items` / `order_status_history`: cliente lê e cria os próprios; alteração de status apenas admin/staff.
- `sync_control` / `integration_logs`: apenas admin e service_role; nunca guardam credenciais ou tokens.
- `estoque` nunca é gravável por cliente (sem política de update para o papel customer).

## 4. Preços — apenas a base

`preco_atacado` não é exposto por consulta pública: a leitura pública do catálogo será feita por uma função de servidor com projeção explícita de colunas (sem `SELECT *`), que nesta etapa retorna apenas `preco_varejo`. A regra completa (não autenticado e varejo → varejo; atacadista aprovado → atacado; pendente/rejeitado → varejo) fica preparada mas não implementada aqui.

## 5. Detalhes técnicos

- Uma migration de schema; nenhum dado inserido (sem seed de produtos ou clientes).
- Trigger `handle_new_user` cria `profiles` (customer_type 'retail') e concede papel `customer` no cadastro.
- Índices: `products(cod_produto)` unique, `products(ativo)`, `products(category_id)`, `products(codigo_barras)`, índice GIN trigram em `products.nome` para busca; `product_images(product_id)`, `addresses(customer_id)`, `orders(customer_id)`, `orders(status)`, `order_items(order_id)`, `order_items(product_id)`, `order_status_history(order_id)`, `integration_logs(integration, created_at)`.
- Frontend: nenhuma página alterada; as telas continuam com os dados demonstrativos atuais. A ligação do catálogo ao banco é a etapa seguinte.
- Ao final, execução do scan de segurança e relatório com tabelas, relacionamentos, políticas, funções, índices e migration criada.

## 6. Pontos que precisam de decisão antes da etapa seguinte

- Frete e forma de pagamento (campos existem, sem regra).
- Política de estoque zero: bloqueia ou permite pedido.
- Pedido mínimo e regras do atacado.
- Formato do `order_number` (sequencial diário, ano+sequência, etc.).
- Se `staff` pode aprovar atacadistas ou se isso é exclusivo do admin.

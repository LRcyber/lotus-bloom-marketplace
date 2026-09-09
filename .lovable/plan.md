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

## 3. Segurança (RLS) — revisada

Funções de segurança (todas `security definer`, `set search_path = public`):

- `has_role(_user_id uuid, _role app_role)` — autorização por papel; papel nunca no profile.
- `is_staff(_user_id uuid)` — admin ou staff.
- `current_customer_id()` — customer do usuário autenticado, usado pelas policies de dados do cliente.
- `current_price_channel()` — retorna 'wholesale' apenas quando existe `wholesale_customers.status = 'approved'`; caso contrário 'retail'. Preparada para a resolução de preço, sem uso obrigatório nesta etapa.

Policies por tabela:

- **products / product_images**: sem nenhuma policy de SELECT para `anon` ou `authenticated` e sem GRANT de SELECT para esses papéis. RLS controla linhas, não colunas — por isso o acesso direto à tabela é fechado. Escrita apenas admin/staff e service_role. `estoque`, `preco_varejo` e `preco_atacado` não têm nenhum caminho de UPDATE para cliente.
- **categories**: SELECT público apenas de `active = true` (não contém dado sensível).
- **Catálogo público**: leitura exclusivamente por view/RPC de projeção segura (`catalog_products`), que expõe `id, cod_produto, nome, unidade, codigo_barras, category_id, imagem_url, estoque, preco` — onde `preco` é uma única coluna já resolvida pelo servidor (`preco_varejo` nesta etapa) e `preco_atacado` nunca aparece na projeção. Nenhuma consulta usa `SELECT *`.
- **profiles**: dono faz SELECT do próprio; UPDATE do dono restrito a `full_name` e `phone` — `customer_type`, `id` e campos de sistema são bloqueados por trigger `BEFORE UPDATE` que rejeita a alteração quando o autor não é admin. Sem policy de INSERT para o cliente (criado pelo trigger de cadastro). Admin/staff leem; admin escreve.
- **customers / addresses**: dono lê e mantém os próprios (o cliente não pode trocar `profile_id`/`customer_id` para outro); admin/staff leem tudo; admin escreve.
- **wholesale_customers**: cliente lê e insere a própria solicitação com `status` forçado a 'pending' por trigger; alteração de `status`, `reviewed_by`, `reviewed_at`, `rejection_reason` somente admin.
- **orders**: cliente faz SELECT apenas dos pedidos do próprio customer. Nesta etapa **não existe policy de INSERT/UPDATE para o cliente** — pedidos serão criados por função de servidor (identifica usuário → customer → canal → aprovação → resolve preços → valida produtos e estoque → calcula subtotal → cria order e order_items com snapshots). `status`, `channel`, `subtotal`, `discount`, `shipping`, `lj_sync_status`, `lj_sale_id`, `lj_synced_at` só mudam por admin/staff ou service_role; trigger de guarda registra a transição em `order_status_history`.
- **order_items**: cliente apenas lê os itens dos próprios pedidos; sem INSERT/UPDATE/DELETE para cliente. `quantidade > 0` por CHECK, e `line_total` conferido por CHECK contra `quantidade * unit_price`.
- **order_status_history**: leitura pelo dono do pedido e por admin/staff; escrita apenas por trigger/service_role.
- **user_roles**: SELECT do próprio papel; nenhum INSERT/UPDATE/DELETE para `authenticated` — somente admin (via `has_role`) e service_role. O papel `customer` é concedido apenas pelo trigger de criação de usuário.
- **sync_control / integration_logs**: apenas admin e service_role; nunca guardam credenciais ou tokens.

## 4. Matriz de verificação após a migration

Cenários testados com consultas reais (anônimo, varejo, atacado pending, atacado approved, staff, admin) para cada capacidade: ver `preco_atacado`, alterar `customer_type`, alterar preço, alterar estoque, alterar status, alterar `lj_sync_status`, criar pedido com preço arbitrário, criar pedido em nome de outro cliente, ler pedido de outro cliente, alterar papel. Esperado: negado para todos os perfis de cliente; leitura e status apenas para staff/admin; administração de papéis apenas para admin. O resultado é apresentado como tabela no relatório final, junto com o scan de segurança.


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

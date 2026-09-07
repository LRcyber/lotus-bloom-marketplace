# Lotus 73 — Arquitetura Revisada (Etapa 1: apenas plano)

Nada foi criado nesta etapa: sem migrations, tabelas, autenticação, integração LJ, n8n, WhatsApp, pagamento ou frete.

## 1. Arquitetura final

```text
Frontend (React/TanStack Router)
   ↓
Server Functions (*.functions.ts / *.server.ts)
   ↓
Supabase / PostgreSQL (RLS)

Integração:  Server Functions → LJ Sistemas (somente server-side)
Automação:   Supabase/Aplicação → n8n → WhatsApp
```

Modularização em camadas separadas:

```text
src/routes/            apresentação e rotas (públicas / _authenticated / admin)
src/components/        UI (catalog, cart, orders, admin)
src/features/pricing   regra varejo/atacado (pura, testável)
src/features/cart      estado do carrinho (cliente)
src/features/orders    montagem e validação do pedido
src/lib/*.functions.ts server functions (RPC tipado)
src/lib/*.server.ts    helpers server-only (nunca importados por componentes)
src/integrations/lj/   cliente LJ — server-only (etapa futura)
```

Não serão usadas Supabase Edge Functions: toda a lógica de servidor fica em server functions do TanStack; webhooks externos (n8n/LJ) em rotas `src/routes/api/public/*` com verificação de assinatura. n8n nunca guarda estado de domínio nem controla o status dos pedidos.

## 2. Tecnologias

TanStack Start v1 (React 19, Vite 7, SSR), TanStack Router + Query, Tailwind v4 com design system em `src/styles.css`, shadcn/ui, zod para validação, sonner para avisos. Supabase (Lovable Cloud) como banco/auth/storage — ainda não habilitado. Estado atual do projeto: template limpo, apenas `/` placeholder, sem banco, sem auth, sem RLS, sem funções de servidor.

## 3. Banco (estrutura mantida — criar somente após aprovação)

Convenções: PK `uuid default gen_random_uuid()`, `created_at/updated_at timestamptz`, RLS habilitada e GRANTs explícitos por tabela.

- **user_roles** — `user_id → auth.users`, `role app_role('admin','staff','customer')`, unique(user_id, role) + função `has_role()` security definer. Papel NUNCA no profile.
- **profiles** — `id = auth.users.id`, `full_name`, `phone`, `email`, `customer_type('retail','wholesale')`. Self select/update; admin all.
- **customers** — `profile_id (unique)`, `document` (CPF/CNPJ, unique), `document_type`, `company_name`, `notes`.
- **wholesale_customers** — `customer_id (unique)`, `cnpj not null`, `company_name`, `state_registration`, `status('pending','approved','rejected')`, `reviewed_by`, `reviewed_at`, `rejection_reason`. Cliente lê/insere o próprio; só admin muda status.
- **categories** — `name`, `slug (unique)`, `sort_order`, `active`. Leitura pública; escrita admin.
- **products** — `cod_produto text UNIQUE NOT NULL`, `nome`, `unidade`, `codigo_barras`, `category_id`, `preco_varejo numeric(12,2) null`, `preco_atacado numeric(12,2) null`, `estoque numeric(12,3)`, `ativo`, `ultima_sincronizacao`, `imagem_url null`, `payload_bruto jsonb`. Índices: cod_produto, ativo, category_id, codigo_barras, busca por nome. Leitura pública só de ativos; escrita apenas server-side/admin.
- **product_images** — `product_id → products (cascade)`, `url`, `sort_order`, `is_primary`.
- **addresses** — `customer_id (cascade)`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf`, `is_default`. Self; admin all.
- **orders** — `order_number (unique)`, `customer_id`, `channel('retail','wholesale')` congelado na criação, `status('recebido','confirmado','em_preparacao','saiu_entrega','entregue','cancelado')`, `subtotal`, `discount`, `total`, `shipping` (PENDENTE DE DEFINIÇÃO — campo previsto, sem cálculo), `payment_method` (PENDENTE DE DEFINIÇÃO — sem regra), `address_id`, `customer_notes`, `lj_sync_status('not_sent','pending','sent','error')`, `lj_sale_id`, `lj_synced_at`, `idempotency_key text UNIQUE`. Cliente lê/insere o próprio; status só admin/staff.
- **order_items** — `order_id (cascade)`, `product_id`, snapshots `cod_produto`, `nome_snapshot`, `unidade`, `quantidade > 0`, `unit_price`, `line_total`.
- **order_status_history** — `order_id`, `from_status`, `to_status`, `changed_by`, `changed_at`.
- **sync_control** — `entity('products','stock','sales')`, `last_run_at`, `last_success_at`, `cursor`, `status`, `error_message`, `running`. Só admin/service_role.
- **integration_logs** — `integration('lj','n8n','whatsapp')`, `direction`, `operation`, `reference_id`, `request_payload jsonb`, `response_payload jsonb`, `http_status`, `success`, `error_message`. Só admin/service_role; nunca registra credenciais ou tokens.

## 4. Regras de negócio

1. Preço não pertence ao produto: o canal do usuário decide (`retail` por padrão; `wholesale` somente após aprovação).
2. Preço nulo ou 0 no canal → "Preço sob consulta"; nunca R$ 0,00.
3. Catálogo único; nenhum produto é escondido por falta de um dos preços.
4. Canal e preços são resolvidos e revalidados no servidor no checkout; preço enviado pelo cliente nunca é aceito.
5. Itens do pedido guardam snapshot de nome, unidade e preço.
6. Status do pedido controlado apenas pelo painel administrativo; nunca vindo do LJ.
7. Estoque: LJ será fonte de verdade no futuro. Política de estoque zero (bloquear ou permitir pedido) = PENDENTE DE DEFINIÇÃO; nenhum bloqueio rígido agora.
8. Pagamento e frete: sem gateway, sem cálculo, sem regra — campos apenas previstos.

## 5. Segurança

RLS em todas as tabelas com GRANTs explícitos; papéis via `user_roles` + `has_role()`; leitura pública restrita ao catálogo ativo com projeção segura; cliente vê somente seus pedidos; admin com permissões próprias; cliente atacadista não aprovado nunca recebe preço de atacado (verificação server-side).

Secrets do LJ (somente server-side, lidos dentro dos handlers, nunca no frontend, nunca em logs):

```text
LJ_API_BASE_URL
LJ_API_CLIENT_ID
LJ_API_CLIENT_SECRET
```

JWT do LJ nunca é enviado ao frontend nem persistido em logs. Webhooks em `/api/public/*` validam assinatura antes de qualquer escrita.

## 6. Integrações futuras (não implementar agora)

- **LJ Sistemas** — somente `POST /token`, `GET /produtos`, `POST /vendas`. Sincronização de produtos/estoque grava em `products`, `sync_control` e `integration_logs`; envio de venda idempotente por `idempotency_key`, com estado em `orders.lj_sync_status`. Execução exclusivamente no servidor.
- **n8n** — automações, sincronizações programadas, notificações e monitoramento. Não é banco, não controla estado de pedidos, não fica no caminho crítico da criação de venda.
- **WhatsApp** — notificações via n8n.

## 7. Pendências para decisão do cliente

- Frete: PENDENTE DE DEFINIÇÃO (regra, transportadora, faixas de CEP).
- Pagamento: PENDENTE DE DEFINIÇÃO (métodos aceitos, se online ou na entrega).
- Estoque zero: PENDENTE DE DEFINIÇÃO (bloqueia ou permite pedido).
- Pedido mínimo/regras do atacado: PENDENTE DE DEFINIÇÃO.
- Credenciais e ambiente da API LJ: PENDENTE DE CONFIRMAÇÃO.
- Número/provedor de WhatsApp: PENDENTE DE DEFINIÇÃO.
- Identidade visual (logo, cores, tipografia): PENDENTE DE DEFINIÇÃO.
- Regras fiscais/nota: PENDENTE DE DEFINIÇÃO.

## 8. Ordem de implementação

1. Design system Lotus 73 + estrutura de navegação (sem backend).
2. Habilitar Lovable Cloud e criar o schema base: `user_roles` + `has_role`, `profiles`, `customers`.
3. Catálogo: `categories`, `products`, `product_images` + leitura pública + páginas de catálogo e produto.
4. Autenticação **somente e-mail + senha** (Google fica para depois) e área do cliente.
5. Atacado: `wholesale_customers`, resolução de canal no servidor, regra de preço.
6. Carrinho + `addresses` + checkout com recálculo server-side (sem frete/pagamento).
7. `orders`, `order_items`, `order_status_history` + acompanhamento pelo cliente.
8. Painel administrativo: clientes, aprovações, pedidos e status.
9. `sync_control` + `integration_logs` (estrutura pronta, sem integração ativa).
10. Integração LJ (produtos/estoque, depois vendas).
11. n8n + WhatsApp.

Aguardando aprovação antes de criar o banco.

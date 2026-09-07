# Lotus 73 — Plano Técnico (Etapa 1: análise, sem alterações)

Nenhuma alteração de código, migration ou dependência foi feita nesta etapa.

## 1. Análise do estado atual

| Item | Situação |
| --- | --- |
| Arquitetura | Template inicial TanStack Start v1 (React 19 + Vite 7), SSR + server functions |
| Tecnologias | React 19, TanStack Router/Query, Tailwind v4 (`src/styles.css`), shadcn config presente |
| Componentes existentes | Nenhum de domínio. Apenas `src/routes/__root.tsx` (shell, 404, erro) e `src/hooks/use-mobile`, `src/lib/utils` |
| Banco de dados | **Não existe.** Lovable Cloud (Supabase) não está habilitado |
| Tabelas / relacionamentos | Nenhuma |
| Autenticação | Nenhuma |
| Políticas RLS | Nenhuma |
| Rotas | `/` (placeholder de template) |
| Funções backend | Nenhuma |
| Conflitos | `src/routes/index.tsx` é placeholder e deve ser substituído pelo catálogo. Sem conflitos de schema. Restrição da plataforma: lógica interna usa server functions do TanStack, não Edge Functions |
| A preservar | `__root.tsx`, `router.tsx`, `src/styles.css` (design system), `routeTree.gen.ts` (gerado) |
| A criar | Design system Lotus 73, todas as rotas, auth, schema, RLS, camadas de integração |
| A alterar | `index.tsx` (catálogo), `__root.tsx` (head/metadata, providers, toaster) |

## A. Arquitetura proposta (modular)

```text
src/
  routes/            apresentação e rotas (públicas, _authenticated, admin)
  components/        UI reutilizável (catalog, cart, orders, admin)
  features/
    pricing/         regra varejo/atacado (pura, testável)
    cart/            estado do carrinho (client)
    orders/          montagem/validação de pedido
  lib/
    *.functions.ts   server functions (RPC tipado, client-safe path)
    *.server.ts      helpers server-only (nunca importados por componente)
  integrations/
    supabase/        clients gerados (browser, auth-middleware, admin)
    lj/              cliente da API LJ — SOMENTE server-only (etapa futura)
```

Camadas: apresentação → server functions (regras de negócio) → PostgreSQL/RLS. Integrações (LJ, n8n) ficam isoladas atrás de server functions e rotas `src/routes/api/public/*` para webhooks, sem acoplamento com a UI. n8n consome/dispara eventos, nunca guarda estado de domínio.

Segredos LJ (`LJ_BASE_URL`, `LJ_USER`, `LJ_PASSWORD`) somente em Secrets, lidos dentro de handlers. JWT do LJ nunca sai do servidor.

## B. Estrutura do banco proposta

Convenções: PK `uuid default gen_random_uuid()`, `created_at/updated_at timestamptz`, `GRANT` explícito por tabela, RLS habilitada em todas, papéis em tabela separada.

**user_roles** (obrigatório p/ segurança) — `id`, `user_id → auth.users`, `role app_role enum('admin','staff','customer')`; unique(user_id, role); função `has_role(uuid, app_role)` security definer. RLS: leitura própria; escrita só admin.

**profiles** — dados do usuário logado. `id (PK = auth.users.id)`, `full_name`, `phone`, `email`, `customer_type enum('retail','wholesale')` default `retail`. RLS: self select/update; admin all. Trigger `on auth.users insert` cria profile.

**customers** — entidade comercial do cliente. `id`, `profile_id → profiles (unique)`, `document` (CPF/CNPJ), `document_type enum`, `company_name`, `notes`. Índice em `document` (unique). RLS: self; admin all.

**wholesale_customers** — pedido de atacado e aprovação. `id`, `customer_id → customers (unique)`, `cnpj not null`, `company_name`, `state_registration`, `status enum('pending','approved','rejected')` default pending, `reviewed_by → auth.users`, `reviewed_at`, `rejection_reason`. Índice em `status`. RLS: cliente lê o próprio e insere o próprio; **somente admin altera status**.

**categories** — `id`, `name`, `slug (unique)`, `sort_order`, `active`. RLS: SELECT anon/authenticated; escrita admin.

**products** — `id`, `cod_produto text UNIQUE NOT NULL`, `nome`, `unidade`, `codigo_barras`, `category_id → categories (null)`, `preco_varejo numeric(12,2) null`, `preco_atacado numeric(12,2) null`, `estoque numeric(12,3) default 0`, `ativo boolean default true`, `ultima_sincronizacao timestamptz`, `imagem_url text null`, `payload_bruto jsonb`. Índices: `cod_produto`, `ativo`, `category_id`, `codigo_barras`, trigram/`nome` p/ busca. Constraints: preços `>= 0` quando não nulos. RLS: SELECT público apenas de produtos ativos com projeção segura; escrita só service_role/admin.

**product_images** — `id`, `product_id → products on delete cascade`, `url`, `sort_order`, `is_primary`. Índice `(product_id, sort_order)`. RLS: SELECT público; escrita admin.

**addresses** — `id`, `customer_id → customers on delete cascade`, `label`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf`, `is_default`. RLS: self; admin all.

**orders** — `id`, `order_number` (sequência única), `customer_id → customers`, `channel enum('retail','wholesale')` (canal congelado na criação), `status enum('recebido','confirmado','em_preparacao','saiu_entrega','entregue','cancelado')` default recebido, `subtotal`, `discount`, `shipping` (PENDENTE DE DEFINIÇÃO), `total`, `address_id → addresses`, `payment_method` (PENDENTE DE DEFINIÇÃO), `customer_notes`, `lj_sync_status enum('not_sent','pending','sent','error')` default not_sent, `lj_sale_id text null`, `lj_synced_at`, `idempotency_key text unique` (previne venda duplicada). Índices: `customer_id`, `status`, `created_at`, `lj_sync_status`. RLS: cliente lê os próprios; insere só para o próprio customer; **status alterado somente por admin/staff**.

**order_items** — `id`, `order_id → orders on delete cascade`, `product_id → products`, `cod_produto` (snapshot), `nome_snapshot`, `unidade`, `quantidade numeric(12,3) > 0`, `unit_price numeric(12,2) > 0`, `line_total`. Índice `order_id`. RLS: via `order_id` pertencente ao cliente; admin all.

**order_status_history** (recomendado) — `order_id`, `from_status`, `to_status`, `changed_by`, `changed_at`. RLS: leitura do próprio pedido + admin; escrita admin.

**sync_control** — controle de sincronização. `id`, `entity enum('products','stock','sales')`, `last_run_at`, `last_success_at`, `cursor text`, `status`, `error_message`, `running boolean`. RLS: somente admin/service_role.

**integration_logs** — `id`, `integration enum('lj','n8n','whatsapp')`, `direction enum('outbound','inbound')`, `operation`, `reference_id`, `request_payload jsonb`, `response_payload jsonb`, `http_status`, `success boolean`, `error_message`, `created_at`. Índices: `(integration, created_at)`, `reference_id`. RLS: somente admin/service_role (nunca exposto a cliente).

## C. Fluxo principal

```text
Cliente → Catálogo → Produto → Carrinho → Checkout(login exigido)
  → Pedido (status: recebido) → Admin (confirma / avança status)
  → Cliente acompanha
  → [futuro] Edge/server fn envia venda ao LJ (idempotente)
  → [futuro] evento → n8n → WhatsApp
```

Atacado: cadastro → envia CNPJ → status pending → admin aprova → canal `wholesale` passa a valer no preço.

## D. Regras de negócio

1. Preço não pertence ao produto: canal do usuário decide (`retail` padrão; `wholesale` só se aprovado).
2. Preço nulo ou 0 no canal → exibir "Preço sob consulta"; nunca R$ 0,00; item não pode ser adicionado ao carrinho.
3. Catálogo é único; produto nunca é escondido por falta de um dos preços.
4. Preço e canal são resolvidos e revalidados **no servidor** no checkout; nunca confiar no preço vindo do cliente.
5. Itens do pedido guardam snapshot de nome/preço/unidade.
6. Status controlados só pelo painel admin; nunca vindos do LJ.
7. Estoque vem do LJ (fonte de verdade); a app apenas alerta (bloqueio rígido: PENDENTE DE CONFIRMAÇÃO).

## E. Segurança

RLS em todas as tabelas + GRANTs explícitos; papéis em `user_roles` com `has_role()` (nunca em profiles); leitura pública apenas de catálogo ativo via chave publishable; admin client só em operações privilegiadas dentro de handlers; segredos LJ apenas em Secrets; webhooks n8n/LJ em `/api/public/*` com verificação de assinatura HMAC.

## F. Integrações futuras (não implementar agora)

LJ: `POST /token`, `GET /produtos`, `POST /vendas` — apenas estes. Sincronização agendada gravando em `products` + `sync_control` + `integration_logs`; envio de venda idempotente por `idempotency_key`, com retry e status em `orders.lj_sync_status`. n8n: agendamentos e notificações WhatsApp, consumindo eventos/endpoints; nunca no caminho crítico.

## G. Dependências

Lovable Cloud (Supabase) habilitado; TanStack Query (já presente); sonner para toasts; zod para validação. Sem novas dependências nesta etapa.

## H. Riscos técnicos

- Divergência de preço/estoque entre app e LJ → sincronização + `ultima_sincronizacao` visível.
- Venda duplicada no ERP → chave de idempotência e status de sync.
- Escalonamento de privilégio se papel/aprovação forem verificados no cliente → tudo no servidor.
- Runtime serverless: sem libs Node nativas nas integrações.
- Aprovação de atacado manual pode virar gargalo operacional.
- PENDENTE DE DEFINIÇÃO: frete, pagamento, regras fiscais, mínimo de pedido no atacado, credenciais/ambiente do LJ, número WhatsApp, identidade visual/logo.

## I. Ordem recomendada de implementação

1. Design system + shell do app (sem backend).
2. Habilitar Lovable Cloud; migration base: `user_roles`, `has_role`, `profiles`, `customers`, trigger de signup.
3. Catálogo: `categories`, `products`, `product_images` + leitura pública + páginas de catálogo/produto.
4. Auth (e-mail/senha + Google) e área do cliente.
5. Atacado: `wholesale_customers` + resolução de canal no servidor + regra de preço.
6. Carrinho + `addresses` + checkout com recálculo server-side.
7. `orders`, `order_items`, histórico + acompanhamento do cliente.
8. Painel admin: clientes, aprovações, pedidos e status.
9. `sync_control` + `integration_logs` (estrutura, sem integração).
10. Integração LJ (produtos/estoque, depois vendas).
11. n8n + WhatsApp.

Confirme os pontos "PENDENTE" e o passo por onde devo começar.

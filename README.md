# Lotus 73 — Loja Virtual

Plataforma de vendas online com catálogo de produtos, preços de varejo e atacado, gerenciamento de pedidos e integração futura com ERP.

## 🎯 Objetivo

Desenvolver uma aplicação de e-commerce com:

- Catálogo e visualização de produtos.
- Cadastro e autenticação de clientes.
- Aprovação de clientes atacadistas.
- Preços diferenciados para varejo e atacado.
- Carrinho, checkout e acompanhamento de pedidos.
- Painel administrativo.
- Integração futura com o ERP LJ Sistemas.
- Automações via n8n e notificações pelo WhatsApp.

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript e Vite.
- **Backend:** Supabase.
- **Banco de dados:** PostgreSQL.
- **Autenticação e segurança:** Supabase Auth e Row Level Security (RLS).
- **Desenvolvimento:** Lovable.
- **Integrações futuras:** API REST do LJ Sistemas, n8n e WhatsApp.

## 🏗️ Arquitetura

O Supabase será o backend principal, responsável pelo banco de dados, autenticação, armazenamento e funções de servidor.

A arquitetura deverá ser modular, separando frontend, regras de negócio, persistência de dados, administração e integrações externas.

## 👥 Perfis de usuário

- **Varejo:** acesso ao catálogo, preços de varejo e pedidos.
- **Atacado:** acesso aos preços de atacado após aprovação administrativa.
- **Administrador:** gerenciamento de clientes, aprovação de cadastros e controle de pedidos.

### Regras de preços

Cada produto poderá possuir `preco_varejo` e `preco_atacado`.

O catálogo será compartilhado entre os perfis. O preço exibido dependerá do perfil do cliente e, no atacado, da aprovação cadastral.

Preços nulos ou iguais a zero deverão ser apresentados como **"Preço sob consulta"**.

## 📦 Produtos e pedidos

Os produtos deverão suportar identificação única, preços, estoque, imagens e controle de sincronização futura com o ERP.

O fluxo de pedidos será:

**Catálogo → Produto → Carrinho → Checkout → Pedido → Administração**

Os pedidos terão status controlados pela equipe administrativa:

- Recebido
- Confirmado
- Em preparação
- Saiu para entrega
- Entregue

## 🔗 Integrações futuras

### LJ Sistemas
- Sincronização de produtos e estoque.
- Envio de vendas ao ERP.
- Registro de logs e tratamento de erros.
- Prevenção de vendas duplicadas.

A API utiliza REST/JSON e autenticação JWT. A integração ainda não deverá ser implementada.

### n8n e WhatsApp
- Automações e tarefas programadas.
- Notificações de pedidos.
- Monitoramento operacional.

O n8n não deverá ser uma dependência obrigatória para operações críticas do sistema.

## 🔐 Segurança

- Utilizar RLS para proteger os dados no Supabase.
- Restringir o acesso dos clientes aos próprios pedidos.
- Proteger rotas e operações administrativas.
- Impedir o acesso aos preços de atacado por clientes não aprovados.
- Manter credenciais e tokens do ERP exclusivamente no backend, utilizando Secrets ou variáveis de ambiente.

## 🗄️ Modelagem do banco

A estrutura proposta deverá contemplar:

`profiles`, `customers`, `wholesale_customers`, `categories`, `products`, `orders`, `order_items`, `addresses`, `integration_logs`, `sync_control` e `product_images`.

A modelagem deverá considerar normalização, chaves estrangeiras, índices, constraints e políticas RLS.

## 🚧 Status do projeto

**Etapa atual:** análise da arquitetura e planejamento técnico.

Antes de implementar novas funcionalidades, é necessário analisar a estrutura existente e documentar:

- Arquitetura, componentes e rotas atuais.
- Banco de dados, relacionamentos e políticas RLS.
- Autenticação e funções de backend.
- Conflitos, dependências e riscos técnicos.
- Alterações necessárias e componentes a preservar.
- Ordem recomendada de implementação.

**Nesta etapa, não executar migrations, instalar dependências ou alterar código.**

Informações ausentes deverão ser identificadas como *Pendente de definição* ou *Pendente de confirmação*.

## 🔗 Links

- **Aplicação:** [LojaVirtual](https://lotus-bloom-marketplace.lovable.app)


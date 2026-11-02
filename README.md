# lojavirtual

PROJETO: LOTUS 73 — PLATAFORMA DE VENDAS ONLINE

Atue como um engenheiro de software sênior responsável pela arquitetura deste projeto.

IMPORTANTE:

Não implemente tudo de uma vez.

Neste primeiro momento NÃO faça alterações no código, banco de dados ou estrutura existente.

Primeiro analise o projeto atual e produza um plano técnico detalhado.

==================================================

1. OBJETIVO DO SISTEMA

==================================================

A Lotus 73 é uma tabacaria que deseja disponibilizar uma aplicação própria de vendas online.

A aplicação deverá permitir:

- catálogo de produtos;

- visualização de produtos;

- preços de varejo;

- preços de atacado;

- cadastro de clientes;

- autenticação;

- aprovação de clientes atacadistas;

- carrinho;

- criação de pedidos;

- acompanhamento de pedidos;

- painel administrativo;

- integração futura com o ERP LJ Sistemas;

- sincronização de produtos e estoque;

- criação de vendas no LJ;

- automações através do n8n;

- notificações através do WhatsApp.

A aplicação será construída utilizando Lovable como plataforma de desenvolvimento.

O Supabase será utilizado como backend principal da aplicação.

==================================================

2. ARQUITETURA PRETENDIDA

==================================================

Arquitetura:

Frontend

↓

Lovable

↓

Supabase

↓

PostgreSQL

↓

Auth / Storage / Edge Functions

Integrações futuras:

Supabase / Edge Functions

↓

API LJ Sistemas

Supabase / eventos

↓

n8n

↓

WhatsApp

Não transformar o n8n no banco principal da aplicação.

O banco principal será o PostgreSQL do Supabase.

==================================================

3. PRINCÍPIO IMPORTANTE

==================================================

O sistema deverá ser construído de forma modular.

Não criar uma aplicação monolítica difícil de manter.

Separar claramente:

- apresentação;

- autenticação;

- regras de negócio;

- banco de dados;

- integração;

- automações;

- administração.

A aplicação deverá estar preparada para futuras alterações sem necessidade de reconstrução completa.

==================================================

4. USUÁRIOS

==================================================

Existirão inicialmente três níveis principais:

1. Cliente varejo

2. Cliente atacado

3. Administrador/funcionário

Cliente varejo:

- pode navegar pelo catálogo;

- pode visualizar preços de varejo;

- pode criar pedido;

- pode acompanhar seus pedidos.

Cliente atacado:

- possui cadastro;

- informa CNPJ;

- precisa ser aprovado;

- somente após aprovação pode utilizar preço atacado;

- visualiza o mesmo catálogo;

- altera somente a regra de preço exibida.

Administrador:

- acessa painel administrativo;

- gerencia clientes;

- aprova/reprova clientes atacadistas;

- acompanha pedidos;

- altera status dos pedidos;

- acompanha integrações;

- futuramente poderá gerenciar imagens.

==================================================

5. REGRA DE PREÇOS

==================================================

A regra de preço NÃO pertence ao produto.

Cada produto poderá possuir:

preco_varejo

preco_atacado

O catálogo será o mesmo para todos.

Cliente varejo:

→ preco_varejo

Cliente atacado aprovado:

→ preco_atacado

Não esconder produtos simplesmente porque um dos preços não está definido.

Se o preço correspondente ao canal for NULL ou 0:

mostrar:

"Preço sob consulta"

Não mostrar:

R$ 0,00

==================================================

6. PRODUTOS

==================================================

Os produtos serão futuramente sincronizados com o LJ Sistemas.

Campos previstos:

cod_produto

nome

unidade

codigo_barras

preco_varejo

preco_atacado

estoque

ativo

ultima_sincronizacao

imagem_url

payload_bruto

cod_produto deverá ser único.

imagem_url deverá aceitar NULL.

payload_bruto deverá ser mantido para debug e auditoria.

==================================================

7. PEDIDOS

==================================================

O pedido será criado na aplicação.

Estrutura conceitual:

Cliente

↓

Produtos

↓

Carrinho

↓

Checkout

↓

Pedido

↓

Confirmação

↓

Integração futura com LJ

Os pedidos deverão possuir controle de status.

Status:

Recebido

Confirmado

Em preparação

Saiu para entrega

Entregue

Os status serão controlados pelo funcionário através do painel administrativo.

Os status NÃO serão obtidos do LJ.

==================================================

8. INTEGRAÇÃO COM LJ

==================================================

A integração com LJ será implementada posteriormente.

Não implementar a integração agora.

Porém, a arquitetura do banco e do backend deve estar preparada para:

- sincronização de produtos;

- sincronização de estoque;

- envio de vendas;

- controle de sincronização;

- logs;

- tratamento de erros;

- prevenção de vendas duplicadas.

A API LJ utiliza:

REST/JSON

JWT

POST /token

GET /produtos

POST /vendas

Não inventar endpoints adicionais.

==================================================

9. N8N

==================================================

O n8n será implementado posteriormente.

Sua função será principalmente:

- automações;

- sincronizações programadas;

- notificações;

- integração com WhatsApp;

- monitoramento operacional.

Não criar dependência estrutural que obrigue todas as operações da aplicação a passarem pelo n8n.

Operações críticas, como criação da venda no ERP, deverão poder ser executadas através do backend/Edge Functions.

==================================================

10. SEGURANÇA

==================================================

Credenciais da API do LJ nunca poderão ser expostas no frontend.

JWT do LJ nunca deverá ser enviado para o frontend.

Credenciais deverão utilizar Secrets/Environment Variables.

Utilizar Row Level Security (RLS) no Supabase.

Clientes somente podem acessar seus próprios pedidos.

Administradores possuem permissões administrativas.

Clientes atacadistas não aprovados não podem utilizar preço atacado.

==================================================

11. O QUE VOCÊ DEVE ANALISAR

==================================================

Analise a estrutura atual do projeto e informe:

1. Arquitetura atual

2. Tecnologias utilizadas

3. Componentes existentes

4. Banco de dados existente

5. Tabelas existentes

6. Relacionamentos

7. Autenticação atual

8. Políticas RLS

9. Componentes de frontend

10. Rotas

11. Funções backend existentes

12. Possíveis conflitos

13. O que precisa ser criado

14. O que precisa ser alterado

15. O que deve ser preservado

==================================================

12. BANCO DE DADOS

==================================================

Proponha uma estrutura normalizada para:

profiles

customers

wholesale_customers

categories

products

orders

order_items

addresses

integration_logs

sync_control

product_images

Não crie as tabelas ainda.

Apenas apresente:

- nome da tabela;

- finalidade;

- campos;

- tipos;

- chave primária;

- chaves estrangeiras;

- índices;

- constraints;

- relacionamentos;

- RLS necessária.

==================================================

13. FLUXO PRINCIPAL

==================================================

Apresente o fluxo:

Cliente

↓

Catálogo

↓

Produto

↓

Carrinho

↓

Checkout

↓

Pedido

↓

Admin

↓

Confirmação

↓

Futuro envio ao LJ

↓

Futuras notificações via n8n/WhatsApp

==================================================

14. RESULTADO DESTA ETAPA

==================================================

NÃO faça alterações ainda.

Retorne um documento técnico contendo:

A. Arquitetura proposta

B. Estrutura do banco

C. Fluxos

D. Regras de negócio

E. Segurança

F. Integrações futuras

G. Dependências

H. Riscos técnicos

I. Ordem recomendada de implementação

IMPORTANTE:

Se alguma informação estiver ausente, não invente.

Marque como:

"PENDENTE DE DEFINIÇÃO"

ou

"PENDENTE DE CONFIRMAÇÃO".

Não executar migrations nesta etapa.

Não instalar dependências nesta etapa.

Não alterar código nesta etapa.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lotus-bloom-marketplace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5640fee7-5ca2-469e-8c30-31678662c0c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

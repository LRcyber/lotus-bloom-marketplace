# Conectar o catálogo visual ao banco

## Implementação

- Criar uma função pública de servidor para consultar apenas a projeção segura `catalog_products`, usando a chave publicável e campos explícitos.
- Carregar categorias ativas separadamente, sem consultar diretamente a tabela protegida de produtos.
- Converter os registros do banco para o formato já usado pelos cartões, preservando preço nulo, estoque, unidade e categoria.
- Manter o parâmetro `categoria`, busca, filtros, ordenação e todos os links atuais de `/catalogo`.
- Atualizar início, catálogo e página de produto para receber dados reais pelo carregamento inicial com TanStack Query.
- Preservar o carrinho visual; nenhum preço será enviado ao banco ou aceito como dado definitivo.
- Exibir `imagem_url` quando existir e manter o placeholder visual por categoria quando estiver ausente.
- Não inserir dados de demonstração e não implementar checkout, pedidos ou integrações.

## Validação

- Confirmar catálogo vazio de forma adequada enquanto o banco não tiver produtos.
- Confirmar que a resposta pública contém apenas os nove campos autorizados e nunca `preco_atacado`.
- Executar typecheck e conferir o build automático.

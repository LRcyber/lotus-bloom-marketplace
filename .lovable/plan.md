# Plano visual — Lotus 73

## Direção aprovada para execução

- Construir uma loja de tabacaria premium, elegante, contemporânea e orientada à compra.
- Usar o arquivo oficial `logo.png` exatamente como enviado, sem redesenho, filtros, recortes internos, estilização, simplificação ou geração por IA.
- Remover qualquer linguagem automotiva, incluindo referências a carros, corrida, performance, “Racing Division”, “Heritage & Performance” e “Since 1973”.
- Não inventar slogans, datas, símbolos ou elementos de marca.
- Aplicar a paleta escolhida “Marfim editorial”: marfim, carvão, verde profundo e dourado, extraídos visualmente do logotipo.
- Aplicar a tipografia escolhida: Outfit nos títulos e Figtree nos textos e controles.
- Aplicar a estrutura escolhida “Loja organizada”: busca central, categorias claras e produtos em grade.

## Experiência a construir

### Cabeçalho e navegação
- Posicionar o logotipo oficial como principal assinatura da marca.
- Criar cabeçalho responsivo com busca, acesso do cliente e carrinho.
- Criar menu de categorias e links para Início, Catálogo e Atacado.
- No celular, condensar a navegação sem perder busca, conta e carrinho; todos os alvos de toque terão pelo menos 44 px.

### Página inicial
- Criar banner comercial usando somente imagem já fornecida no projeto e aprovada, com texto objetivo e chamadas para catálogo e atacado.
- Exibir categorias em atalhos visuais.
- Exibir produtos em destaque com dados simulados: nome, unidade, disponibilidade, preço e quantidade. Imagens somente quando houver arquivo fornecido e aprovado; nos demais casos, usar placeholders neutros que não simulem produtos, marcas ou ambientes da Lotus 73.
- Reforçar compra prática com chamadas comerciais, sem conteúdo institucional inventado.

### Catálogo
- Substituir os blocos vazios por uma experiência funcional com dados simulados.
- Incluir busca, categorias, filtros, ordenação, contador de resultados e grade responsiva.
- Usar o mesmo componente de produto da página inicial.
- No celular, abrir filtros em painel acessível e manter a leitura da grade compacta.

### Produto
- Criar uma rota visual de detalhe com imagem, nome, unidade, disponibilidade, preço, quantidade e ação de adicionar ao carrinho.
- Usar dados simulados e navegação real entre catálogo e detalhe.
- Mostrar “Preço sob consulta” para exemplos sem preço, nunca “R$ 0,00”.

### Carrinho
- Criar painel lateral reutilizável com itens, quantidade, preço, subtotal, total, continuar comprando e checkout.
- Permitir abrir, fechar, alterar quantidades e remover itens apenas em estado local simulado.
- O checkout será somente uma ação visual, sem pagamento real.

## Componentes reutilizáveis

- Consolidar `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Dropdown`, `Toast`, `SearchBar`, `ProductCard`, `ProductGrid`, `CartDrawer`, `StatusBadge`, `Header` e `Footer`.
- Usar os componentes acessíveis já disponíveis no projeto para diálogos, menus e mensagens.
- Evitar duplicação visual entre páginas e evitar cartões aninhados.

## Design system

- Definir no tema os tokens semânticos `primary`, `secondary`, `background`, `foreground`, `muted`, `border`, `success`, `warning` e `error`, além dos respectivos textos de contraste.
- Usar exclusivamente tokens nos componentes, sem cores hexadecimais espalhadas nas telas.
- Adotar superfícies claras em marfim, texto carvão, verde profundo para ações principais e dourado apenas como destaque refinado.
- Manter cantos discretos, divisórias finas e sombras suaves para uma aparência comercial organizada.
- Atualizar o carregamento das fontes para Outfit e Figtree.

## Tratamento do logotipo oficial

- Publicar o arquivo original como ativo da aplicação e utilizá-lo no cabeçalho e em pontos institucionais adequados.
- Criar o favicon a partir do mesmo arquivo, apenas reduzindo e centralizando proporcionalmente para o formato técnico exigido; o desenho permanecerá intacto.

## Política de imagens

- Utilizar exclusivamente imagens já fornecidas no projeto ou explicitamente aprovadas pelo cliente.
- Não gerar imagens por IA nesta etapa.
- Não usar fotografias de produtos, marcas ou ambientes não autorizados como se fossem da Lotus 73.
- Quando não houver imagem aprovada para um produto ou categoria, exibir um placeholder gráfico neutro construído com o design system, claramente sem caráter fotográfico.
- Remover a marca textual improvisada atual do cabeçalho.

## Acessibilidade e responsividade

- Garantir contraste AA, foco visível, rótulos associados aos campos e nomes acessíveis em botões com ícone.
- Usar regiões semânticas, uma hierarquia correta de títulos e mensagens claras para estados vazios e ações do carrinho.
- Verificar desktop, tablet e celular, priorizando a jornada mobile.
- Respeitar redução de movimento e evitar transições decorativas.

## Limites desta etapa

- Não criar banco de dados, autenticação real, integração LJ, n8n, WhatsApp, frete ou pagamento.
- Não implementar regras comerciais no servidor nesta etapa.
- Produtos, preços, estoque, conta e carrinho serão demonstrações visuais com dados locais simulados.

## Validação

- Confirmar que o logotipo exibido é o arquivo oficial e não sofreu transformação visual.
- Confirmar que todas as imagens exibidas foram fornecidas ou aprovadas e que nenhum produto ou ambiente foi inventado visualmente.
- Verificar Início, Catálogo, Produto e Atacado em desktop e celular.
- Testar busca, filtros, seleção de quantidade, abertura do carrinho e navegação por teclado.
- Revisar textos para garantir ausência total de referências automotivas ou informações de marca não fornecidas.

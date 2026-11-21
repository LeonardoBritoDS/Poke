# Pokédex de Kanto

Catálogo interativo dos 151 primeiros Pokémon, desenvolvido para a disciplina de **Web Development Front-End**. O projeto usa HTML, CSS e JavaScript puro para consultar a [PokéAPI](https://pokeapi.co/docs/v2) e exibir os dados dos Pokémon em cards.

## Funcionalidades

- Busca por nome ou número na Pokédex. Experimente `Pikachu` ou `025`.
- Cards com imagem, nome, tipos, altura e peso.
- Paginação com até oito cards por página.
- Layout responsivo para computadores e celulares.
- Mensagens de carregamento, busca sem resultados e falha de conexão, com opção de tentar novamente.

## Como executar

1. Baixe ou clone o repositório. Se baixar o ZIP, clique com o botão direito no arquivo e selecione **Extrair Tudo…**.
2. Na pasta extraída, confira se `index.html`, `style.css` e `script.js` estão juntos.
3. Abra o `index.html` em um navegador com acesso à internet e aguarde o carregamento dos cards.

Se preferir rodar por um servidor local e tiver Python instalado, abra o terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois, acesse [http://localhost:8000](http://localhost:8000).

## Como funciona

Ao abrir a página, o JavaScript usa `fetch()` para consultar a lista dos 151 Pokémon. A resposta JSON traz o nome e a URL de cada Pokémon. A busca filtra essa lista por nome ou número, e o site consulta os detalhes dos Pokémon da página exibida. Os detalhes já carregados são guardados em memória enquanto a página permanece aberta.

A grade de cards começa vazia no `index.html`. O JavaScript cria os elementos de cada card com `document.createElement()`, preenche os dados recebidos da API e insere os cards na página com `appendChild()`. O CSS Grid ajusta a quantidade de colunas à largura da tela.

Para acompanhar as consultas, abra as ferramentas do desenvolvedor (`F12`), selecione **Rede → Fetch/XHR** e recarregue a página. A primeira requisição traz a lista de Pokémon. As seguintes trazem os detalhes usados para montar os cards.

## Estrutura do projeto

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da página, campo de busca e área dos cards. |
| `style.css` | Estilos, layout responsivo e apresentação dos cards. |
| `script.js` | Consultas à API, busca, paginação e criação dinâmica dos cards. |
| `README.md` | Documentação e instruções de execução. |

Os dados e as imagens exibidos no catálogo são fornecidos pela [PokéAPI](https://pokeapi.co/).
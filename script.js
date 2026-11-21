const api = 'https://pokeapi.co/api/v2/pokemon';
const perPage = 8;
const cache = new Map();
const typeNames = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada'
};

const cards = document.querySelector('#cards');
const notice = document.querySelector('#notice');
const search = document.querySelector('#search');
const retry = document.querySelector('#retry');
const pagination = document.querySelector('#pagination');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const pageLabel = document.querySelector('#page');
const formatNumber = new Intl.NumberFormat('pt-BR');
let catalogue = [];
let page = 1;
let renderVersion = 0;
let searchTimer;

function fetchJson(url) {
  return fetch(url, { signal: AbortSignal.timeout(12000) }).then(response => {
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  });
}

function getPokemon(url) {
  if (!cache.has(url)) {
    cache.set(url, fetchJson(url).catch(error => {
      cache.delete(url);
      throw error;
    }));
  }
  return cache.get(url);
}

function element(tag, cssClass, text) {
  const node = document.createElement(tag);
  if (cssClass) node.className = cssClass;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createCard(pokemon) {
  const name = pokemon.name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' ');
  const card = element('article', 'card');
  const portrait = element('div', 'portrait');
  const image = element('img');
  image.src = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '';
  image.alt = 'Ilustração de ' + name;
  image.loading = 'lazy';
  if (image.getAttribute('src')) portrait.appendChild(image);
  const body = element('div', 'card-body');
  const types = pokemon.types.map(({ type }) => typeNames[type.name] ?? type.name);
  body.appendChild(element('p', 'number', '#' + String(pokemon.id).padStart(3, '0')));
  body.appendChild(element('h3', '', name));
  body.appendChild(element('p', 'types', types.join(' · ')));
  body.appendChild(element('p', 'metrics', formatNumber.format(pokemon.height / 10) + ' m · ' + formatNumber.format(pokemon.weight / 10) + ' kg'));
  card.appendChild(portrait);
  card.appendChild(body);
  return card;
}

async function renderCards() {
  const version = ++renderVersion;
  const query = search.value.trim().toLowerCase().replace(/\s+/g, '-');
  const idQuery = query.replace(/^#/, '');
  const filtered = catalogue.filter(item =>
    /^\d+$/.test(idQuery) ? item.id === Number(idQuery) : item.name.includes(query)
  );
  const pageCount = Math.ceil(filtered.length / perPage);
  const batch = filtered.slice((page - 1) * perPage, page * perPage);
  pagination.hidden = pageCount < 2;
  previous.disabled = page === 1;
  next.disabled = page >= pageCount;
  pageLabel.textContent = 'Página ' + page + ' de ' + pageCount;
  cards.replaceChildren();
  retry.hidden = true;
  if (!batch.length) {
    cards.setAttribute('aria-busy', 'false');
    notice.textContent = 'Nenhum Pokémon encontrado.';
    return;
  }
  cards.setAttribute('aria-busy', 'true');
  notice.textContent = 'Carregando Pokémon…';
  try {
    const detail = await Promise.all(batch.map(item => getPokemon(item.url)));
    if (version !== renderVersion) return;
    const fragment = document.createDocumentFragment();
    detail.forEach(pokemon => fragment.appendChild(createCard(pokemon)));
    cards.appendChild(fragment);
    notice.textContent = filtered.length === 1 ? '1 Pokémon encontrado' : filtered.length + ' Pokémon encontrados';
  } catch {
    if (version !== renderVersion) return;
    notice.textContent = 'Não foi possível carregar os cards. Verifique a conexão e tente de novo.';
    retry.hidden = false;
  } finally {
    if (version === renderVersion) cards.setAttribute('aria-busy', 'false');
  }
}

async function start() {
  retry.hidden = true;
  notice.textContent = 'Carregando Pokédex…';
  cards.setAttribute('aria-busy', 'true');
  try {
    const data = await fetchJson(api + '?limit=151&offset=0');
    catalogue = data.results.map(item => ({ ...item, id: Number(item.url.split('/').filter(Boolean).pop()) }));
    search.disabled = false;
    await renderCards();
  } catch {
    cards.setAttribute('aria-busy', 'false');
    notice.textContent = 'Não foi possível acessar a PokéAPI. Verifique a conexão e tente de novo.';
    retry.hidden = false;
  }
}

search.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page = 1;
    renderCards();
  }, 220);
});
previous.addEventListener('click', () => { page -= 1; renderCards(); });
next.addEventListener('click', () => { page += 1; renderCards(); });
retry.addEventListener('click', () => {
  if (catalogue.length) renderCards();
  else start();
});
start();

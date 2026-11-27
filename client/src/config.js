// Configuração do front para os dois jeitos de publicar o site:
// - com o servidor Express (npm start): usa /api/projects e /api/contact
// - estático no GitHub Pages (npm run build:pages): dados locais + Web3Forms

// true no build do GitHub Pages (definido em client/package.json)
export const IS_STATIC = import.meta.env.VITE_STATIC === 'true';

// Chave de acesso do Web3Forms (https://web3forms.com). Ela é pública por
// design: só serve para enviar mensagens ao e-mail cadastrado nela.
export const WEB3FORMS_KEY = '';

// Caminhos de /public respeitando a pasta do site (ex.: /portfolio-web/ no Pages).
// Links externos (https://...) passam sem mudança.
export function asset(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  return import.meta.env.BASE_URL + path.slice(1);
}

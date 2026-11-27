// Aceita texto simples ou { pt, en } e devolve o texto no idioma atual
export function localize(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.pt ?? '';
}

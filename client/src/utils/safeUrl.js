// Aceita só links http(s). Qualquer outro esquema (javascript:, data:...) vira null.
// Segunda barreira: o servidor já filtra, mas o front não confia cegamente na API.
export function safeUrl(value) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

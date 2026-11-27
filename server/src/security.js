import crypto from 'node:crypto';
import fs from 'node:fs';

// Cabeçalhos de segurança aplicados a todas as respostas (equivalente ao helmet,
// sem dependência extra).

// Hash dos <script> inline do index.html compilado, para liberar só eles na CSP
// (hoje é o script que aplica tema e idioma antes do React carregar).
function inlineScriptHashes(indexPath) {
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    const hashes = [];
    for (const [, body] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      hashes.push(`'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`);
    }
    return hashes;
  } catch {
    return [];
  }
}

export function buildCsp({ indexPath, isProd }) {
  const scripts = ["'self'", ...inlineScriptHashes(indexPath)];
  const directives = {
    'default-src': ["'self'"],
    'script-src': scripts,
    // React aplica estilos via atributo style (ex.: rotação dos cards)
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net', 'https://cdn.simpleicons.org'],
    'font-src': ["'self'", 'data:'],
    'media-src': ["'self'"],
    'connect-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };
  const csp = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`);
  if (isProd) csp.push('upgrade-insecure-requests');
  return csp.join('; ');
}

export function securityHeaders({ csp, isProd }) {
  return (_req, res, next) => {
    if (csp) res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    // Navegadores só respeitam HSTS em HTTPS; em produção o site deve estar atrás de HTTPS
    if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  };
}

// Respostas da API nunca ficam em cache (navegador ou proxy)
export function noStore(_req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  next();
}

// Aceita só links http(s); qualquer outro esquema (javascript:, data:...) vira null
export function safeUrl(value) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

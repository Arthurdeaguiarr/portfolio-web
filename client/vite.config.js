import crypto from 'node:crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No GitHub Pages não dá para enviar cabeçalhos HTTP, então a política de
// segurança (CSP) vai numa <meta> no index.html, com o hash do script inline.
function staticCsp() {
  return {
    name: 'static-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (process.env.VITE_STATIC !== 'true') return html;
        const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(
          ([, body]) => `'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`
        );
        const csp = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://cdn.jsdelivr.net https://cdn.simpleicons.org",
          "font-src 'self' data:",
          "media-src 'self'",
          "connect-src 'self' https://api.web3forms.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ].join('; ');
        const meta =
          `<meta http-equiv="Content-Security-Policy" content="${csp}" />\n    ` +
          '<meta name="referrer" content="strict-origin-when-cross-origin" />\n    ';
        return html.replace(/<meta charset="UTF-8" \/>\n\s*/i, (m) => m + meta);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), staticCsp()],
  // Sem source maps em produção: o código-fonte original não fica público
  build: { sourcemap: false },
  server: {
    port: 5173,
    // Em desenvolvimento, as chamadas /api vão para o Express
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});

import './env.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import { buildCsp, securityHeaders, noStore } from './security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === 'production';
const dist = path.resolve(__dirname, '../../client/dist');

// Não revela que o servidor é Express
app.disable('x-powered-by');

// Só confie no X-Forwarded-For quando houver um proxy reverso na frente
// (Nginx, Render, Railway...). Sem proxy, qualquer um poderia forjar o IP
// e burlar o limite de envios. Defina TRUST_PROXY=1 no .env nesse caso.
app.set('trust proxy', Number(process.env.TRUST_PROXY) || false);

app.use(
  securityHeaders({
    isProd,
    // Em desenvolvimento o Vite serve o HTML; a CSP vale para o site compilado
    csp: isProd ? buildCsp({ indexPath: path.join(dist, 'index.html'), isProd }) : null,
  })
);
app.use(express.json({ limit: '20kb' }));
if (!isProd) {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
}

app.use('/api', noStore);
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);

app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

// Em produção, o Express também serve o front já compilado
if (isProd) {
  app.use(express.static(dist, { dotfiles: 'ignore', index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Erros: nunca devolve stack trace ou mensagem interna para o cliente
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid_json' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'payload_too_large' });
  if (err.status >= 400 && err.status < 500) return res.status(err.status).json({ error: 'bad_request' });
  console.error(err);
  res.status(500).json({ error: 'internal' });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[contact] SMTP não configurado: preencha SMTP_PASS em server/.env para receber as mensagens por e-mail.');
  } else {
    console.log('[contact] envio de e-mail configurado');
  }
});

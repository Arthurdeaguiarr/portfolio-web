import { Router } from 'express';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';

const router = Router();

// Limite por IP: 5 tentativas a cada 15 minutos (em memória)
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();
// Teto de IPs guardados, para um ataque com muitos IPs não esgotar a memória
const MAX_TRACKED_IPS = 10000;

// Limite global de mensagens válidas: protege a caixa de entrada
// mesmo que alguém use muitos IPs diferentes
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const MAX_GLOBAL = 30;
let accepted = [];

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW || (!hits.has(ip) && hits.size >= MAX_TRACKED_IPS)) {
    return res.status(429).json({ error: 'rate_limited' });
  }
  recent.push(now);
  hits.set(ip, recent);
  next();
}

function globalLimitReached() {
  const now = Date.now();
  accepted = accepted.filter((t) => now - t < GLOBAL_WINDOW_MS);
  return accepted.length >= MAX_GLOBAL;
}

// Limpa IPs antigos de tempos em tempos para o Map não crescer sem limite
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(ip);
  }
}, 60 * 1000).unref();

// E-mail sem espaços, aspas, <>, vírgulas ou ; (nada que quebre cabeçalhos)
const EMAIL_RE =
  /^[^\s@"<>,;:()[\]\\]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i;

// Remove caracteres de controle. O nome vai no assunto do e-mail, então
// perde também as quebras de linha; a mensagem mantém as quebras.
const cleanLine = (s) =>
  s.replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, ' ').replace(/\s+/g, ' ').trim();
const cleanText = (s) =>
  s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').trim();

function validate({ name, email, message }) {
  const errors = {};
  if (name.length < 2 || name.length > 120) errors.name = 'invalid';
  if (email.length > 160 || !EMAIL_RE.test(email)) errors.email = 'invalid';
  if (message.length < 10 || message.length > 5000) errors.message = 'invalid';
  return errors;
}

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Nunca aceita certificado inválido nem conexão sem TLS
    requireTLS: Number(SMTP_PORT) !== 465,
    tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
  });
}

// POST /api/contact
router.post('/', rateLimit, async (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const str = (v) => (typeof v === 'string' ? v : '');

  // Honeypot: humanos não veem esse campo. Se veio preenchido, é robô.
  // Respondemos sucesso para não dar pistas, mas não salvamos nada.
  if (body.website) return res.status(201).json({ ok: true });

  const data = {
    name: cleanLine(str(body.name)),
    email: cleanLine(str(body.email)).toLowerCase(),
    message: cleanText(str(body.message)),
  };

  const errors = validate(data);
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'validation', fields: errors });
  }

  if (globalLimitReached()) {
    return res.status(429).json({ error: 'rate_limited' });
  }
  accepted.push(Date.now());

  // 1. Salva no banco primeiro (consulta parametrizada: sem SQL injection)
  let saved = false;
  try {
    await pool.execute('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [
      data.name,
      data.email,
      data.message,
    ]);
    saved = true;
  } catch (err) {
    console.error('[contact] erro ao salvar mensagem:', err.code || 'db_error');
  }

  // 2. Avisa por e-mail. Só texto puro: nada do visitante vira HTML.
  let mailed = false;
  const transport = getTransport();
  if (transport) {
    try {
      await transport.sendMail({
        from: { name: 'Portfólio', address: process.env.SMTP_USER },
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        replyTo: { name: data.name, address: data.email },
        subject: `Nova mensagem do portfólio: ${data.name.slice(0, 80)}`,
        text: `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`,
      });
      mailed = true;
    } catch (err) {
      // Só o código do erro: a mensagem completa pode conter dados do SMTP
      console.error('[contact] erro ao enviar e-mail:', err.code || 'smtp_error');
    }
  }

  if (!saved && !mailed) {
    return res.status(503).json({ error: 'unavailable' });
  }
  res.status(201).json({ ok: true });
});

export default router;

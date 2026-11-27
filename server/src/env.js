import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Carrega server/.env independente da pasta de onde o servidor foi iniciado.
// Fica num módulo próprio e é o primeiro import do index.js, para as
// variáveis já existirem quando db.js e as rotas forem carregados.
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

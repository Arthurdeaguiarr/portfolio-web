# Portfólio do Arthur

Portfólio pessoal bilíngue (PT/EN) com **React + Vite** no front-end, **Express** na API e **MySQL** no banco.

```
client/     React + Vite (CSS puro, sem framework)
server/     API Express (projetos e formulário de contato)
database/   schema.sql e seed.sql
```

## 1. Pré-requisitos

- **Node.js 20 ou mais novo**: https://nodejs.org (versão LTS)
- **MySQL 8**: https://dev.mysql.com/downloads/mysql/ (ou `brew install mysql`)

> Neste Mac foi baixado um Node portátil em `.tools/node` só para testar o projeto.
> Para usar no dia a dia, instale o Node pelo site oficial. A pasta `.tools/` pode ser apagada depois.

## 2. Instalar as dependências

Na raiz do projeto:

```bash
npm run install:all
```

## 3. Criar o banco de dados

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p portfolio < database/seed.sql
```

O `schema.sql` cria o banco `portfolio` com as tabelas `projects` e `messages`.
O `seed.sql` insere os 3 projetos (Spaceform, AWS Campus Leader e este portfólio).

## 4. Configurar o `.env`

```bash
cp server/.env.example server/.env
```

Preencha pelo menos `DB_USER` e `DB_PASSWORD`.
O SMTP é opcional: sem ele, as mensagens do formulário ficam salvas só no banco (tabela `messages`).
Para receber um aviso no Gmail, crie uma **senha de app** em https://myaccount.google.com/apppasswords e use em `SMTP_PASS`.

## 5. Rodar em desenvolvimento

```bash
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:3001/api/health

O site funciona mesmo sem o MySQL rodando: se a API não responder, os projetos vêm de `client/src/data/projects.js`.

## 6. Produção

```bash
npm run build
npm start
```

O Express passa a servir o site compilado (`client/dist`) e a API na mesma porta.

## Publicar no GitHub Pages

O site está em https://arthurdeaguiarr.github.io/portfolio-web/ e é publicado sozinho a cada push na `main` (`.github/workflows/deploy.yml`).

- O Pages só hospeda arquivos estáticos, então lá o site não usa o Express nem o MySQL: os projetos vêm de `client/src/data/projects.js` e o formulário envia pelo **Web3Forms** direto para o seu e-mail.
- A chave do Web3Forms fica em `WEB3FORMS_KEY`, em `client/src/config.js` (ela é pública por design).
- Para testar o build do Pages localmente: `cd client && npm run build:pages && npx vite preview --base=/portfolio-web/`.
- Se o nome do repositório mudar, troque `/portfolio-web/` no script `build:pages` de `client/package.json`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Verifica se a API está no ar |
| GET | `/api/projects` | Lista os projetos publicados (ordem por `sort_order`) |
| POST | `/api/contact` | Recebe `name`, `email`, `message` (+ honeypot `website`). Limite de 5 envios a cada 15 min por IP |

## Onde colocar seus arquivos

| O quê | Onde | Observação |
|---|---|---|
| Sua foto | `client/public/images/arthur.jpg` | Já adicionada. Para trocar, mantenha o mesmo nome |
| Prints dos projetos | `client/public/images/projects/` | Ex.: `spaceform-1.jpg`. Depois troque os links picsum em `client/src/data/projects.js` **e** em `database/seed.sql` (ou direto na tabela `projects`) por `/images/projects/spaceform-1.jpg` |
| Fotos e vídeo do programa AWS | `client/public/images/projects/aws-*` | Já adicionados. Vídeos usam `type: 'video'` no item da galeria |
| Prints deste portfólio | `client/public/images/projects/portfolio-1.jpg` e `portfolio-2.jpg` | Gerados por `.tools/shots/capture.mjs` com o site rodando (`PLAYWRIGHT_BROWSERS_PATH=.tools/shots/browsers node .tools/shots/capture.mjs`). Rode de novo quando mudar o visual |
| Fotos dos eventos | `client/public/images/events/` | Já adicionadas. A lista fica em `eventsList` em `client/src/i18n/pt.js` e `en.js` |
| Notebook da seção Stacks | `client/public/images/setup-macbook.png` | Recorte gerado por `.tools/shots/macbook.mjs` a partir de `.tools/shots/macbook-foto.png`, com o print `portfolio-1.jpg` na tela. Rode de novo se mudar o hero |
| CV em PDF | `client/public/cv-arthur.pdf` | Depois descomente o botão "Baixar CV" em `client/src/components/Contact/Contact.jsx` |
| Imagem de compartilhamento | `client/public/images/og.jpg` (1200x630) | Adicione a tag `og:image` no `client/index.html` |

## Adicionar um novo projeto

Insira uma linha na tabela `projects` (veja o formato em `database/seed.sql`). Ele aparece no site sem mudar código.
Para o site funcionar também sem banco, adicione o mesmo projeto em `client/src/data/projects.js`.

## Textos e idiomas

Todos os textos estão em `client/src/i18n/pt.js` e `client/src/i18n/en.js`.
O conteúdo dos projetos fica no campo `content` (com `pt` e `en`).

## Segurança

- **Cabeçalhos** (`server/src/security.js`): CSP com hash do script inline, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS em produção. A CSP vale para o site compilado (`npm start`).
- **Formulário**: limite de 5 tentativas por IP a cada 15 min e 30 mensagens por hora no total; caracteres de controle removidos; e-mail validado contra injeção de cabeçalho; e-mail só em texto puro.
- **IP real**: deixe `TRUST_PROXY=0` se o Express estiver exposto direto. Use `TRUST_PROXY=1` só atrás de um proxy reverso (Nginx, Render, Railway...).
- **Links do banco**: só `http(s)` passam, no servidor e no front.
- **Erros**: a API nunca devolve stack trace; os logs mostram só o código do erro.
- **Banco**: em produção, crie o usuário `portfolio_app` com `database/user.sql` (só `SELECT` em `projects` e `INSERT` em `messages`) em vez de usar o root.
- **Segredos**: ficam só em `server/.env`, que está no `.gitignore`. Nada de `.env` vai para o build do front e não há source maps em produção.
- **Dependências**: rode `npm audit --omit=dev` em `server/` e `client/` de vez em quando.
- **Em produção**: sirva o site só por HTTPS.

## Próxima fase

Painel admin com login para cadastrar projetos e ler as mensagens. A tabela `admins` já está esboçada (comentada) em `database/schema.sql`.

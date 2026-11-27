-- Banco do portfólio do Arthur
-- Uso: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio;

-- Projetos exibidos na seção "Projetos"
CREATE TABLE IF NOT EXISTS projects (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(80)  NOT NULL UNIQUE,
  title        VARCHAR(120) NOT NULL,
  status       ENUM('in_progress', 'done', 'community') NOT NULL DEFAULT 'done',
  display_url  VARCHAR(160) NULL,
  demo_url     VARCHAR(255) NULL,
  repo_url     VARCHAR(255) NULL,
  stack        JSON NOT NULL,   -- ["React", "Express", ...]
  images       JSON NOT NULL,   -- [{ "src": "...", "alt": { "pt": "...", "en": "..." } }]
  content      JSON NOT NULL,   -- { "pt": { summary, problem, role, solution, result }, "en": {...} }
  sort_order   INT NOT NULL DEFAULT 0,
  published    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Mensagens enviadas pelo formulário de contato
CREATE TABLE IF NOT EXISTS messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at     TIMESTAMP NULL DEFAULT NULL
);

-- Fase 2 (painel admin): tabela de usuários administradores
-- CREATE TABLE IF NOT EXISTS admins (
--   id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   email          VARCHAR(160) NOT NULL UNIQUE,
--   password_hash  VARCHAR(255) NOT NULL,
--   created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

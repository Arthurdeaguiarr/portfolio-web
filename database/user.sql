-- Usuário do banco com o mínimo de permissões que a API precisa.
-- Uso (troque a senha antes): mysql -u root -p < database/user.sql
-- Depois coloque DB_USER=portfolio_app e a senha em server/.env

CREATE USER IF NOT EXISTS 'portfolio_app'@'localhost' IDENTIFIED BY 'TROQUE_POR_UMA_SENHA_FORTE';

-- Lê os projetos e grava mensagens. Não pode apagar, alterar nem ler as mensagens.
GRANT SELECT ON portfolio.projects TO 'portfolio_app'@'localhost';
GRANT INSERT ON portfolio.messages TO 'portfolio_app'@'localhost';

FLUSH PRIVILEGES;

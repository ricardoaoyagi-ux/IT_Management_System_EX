# SIG — Sistema Interno de Gestão

Sistema web para gestão de uma equipe de sustentação (suporte a incidentes), com módulos adicionais de projetos e RH.

Desenvolvido do zero, com Angular no front-end e Node.js/Express + MySQL no back-end.

## Sobre este repositório

Este projeto foi originalmente desenvolvido para uso interno de uma empresa. Nomes e dados de empresas/clientes reais foram removidos ou substituídos por valores genéricos antes da publicação (veja "Sobre a sanitização" abaixo). O código é publicado aqui como portfólio.

## Funcionalidades

- Login com MFA (TOTP) e captcha (reCAPTCHA)
- Gestão de incidentes, problemas e RCA
- Controle de SLA e justificativas de reabertura
- Módulo de analistas, alocação, férias, plantão e skills
- Timebox / capacity planning de projetos
- Módulo de RH (candidatos, carga de horas)
- Exportação de relatórios (Excel/CSV)
- Multi-base: o sistema suporta múltiplas "contas" (bancos de dados) diferentes

## Tecnologias

- **Frontend:** Angular 19, Angular Material, Chart.js
- **Backend:** Node.js, Express, MySQL2
- **Autenticação:** bcrypt, TOTP (MFA), reCAPTCHA v2

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- MySQL 8+

### 1. Banco de dados

Crie um banco de dados (ex: `empresa1`) e importe a estrutura. Duas opções:

```bash
# Opção A: só a estrutura das tabelas, tudo vazio
mysql -u root -p empresa1 < backend/schema.sql

# Opção B (recomendado para testar): estrutura + tabelas de domínio/catálogo já
# populadas (sistemas, módulos, status, tipos de problema, motivos, feriados...),
# para a aplicação não abrir completamente vazia
mysql -u root -p empresa1 < backend/seed.sql
```

> Nenhum dos dois arquivos contém dados reais de incidentes, usuários, analistas ou apontamento de horas — só estrutura, e no caso do `seed.sql`, dados de catálogo genéricos.

Depois de importar, crie um usuário de teste para conseguir logar:

```bash
cd backend
npm install
node seed-test-user.js
```

Isso cria o usuário **TESTE1** / senha **teste1** no banco (ajustável via variável `SEED_DB_NAME` se você usar um nome de banco diferente de `empresa1`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # ajuste host/usuário/senha do MySQL se necessário
node server.js
```

### 3. Frontend

```bash
npm install
ng serve --open
```

A aplicação abre em `http://localhost:4200`. Na tela de login, selecione a conta correspondente ao banco que você criou.

> Atalho para Windows: `sig.bat` sobe backend e frontend juntos.

## Sobre a sanitização deste repositório

Como este sistema foi usado internamente por uma empresa, antes de publicar o código:

- Nomes reais de empresas/clientes foram substituídos por identificadores genéricos (`empresa1`, `empresa2`, `empresa3`, e os campos `Cliente`/`Fornecedor`).
- Nomes de sistemas internos reais (usados no módulo de skills, no catálogo de sistemas/módulos e em um campo do módulo de plantão) foram generalizados para `Sistema A`, `Sistema B` etc.
- A senha do banco de dados foi removida do código-fonte e movida para variável de ambiente (`.env`, não versionado — veja `backend/.env.example`).
- A chave secreta do reCAPTCHA foi substituída pela chave pública de teste oficial do Google (sempre válida, sem custo/risco).
- Nenhum dado real (incidentes, usuários, analistas, apontamento de horas, projetos) foi incluído. `backend/schema.sql` tem só a estrutura das tabelas; `backend/seed.sql` acrescenta apenas dados de catálogo/domínio genéricos, sem nada pessoal ou transacional.

## Licença

<!-- Defina aqui a licença desejada, por exemplo MIT, antes de tornar o repositório público. -->

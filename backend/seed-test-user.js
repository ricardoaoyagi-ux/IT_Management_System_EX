// Cria (ou recria) um usuario de teste para login local, apos importar schema.sql ou seed.sql.
// Uso: node seed-test-user.js
// Variavel opcional SEED_DB_NAME define o banco alvo (padrao: empresa1).

import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_NAME = process.env.SEED_DB_NAME || 'empresa1';
const USERNAME = 'TESTE1';
const PLAIN_PASSWORD = 'teste1';

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'teste1',
    database: DB_NAME,
  });

  const passwordHash = await bcrypt.hash(PLAIN_PASSWORD, 10);

  await conn.query('DELETE FROM users WHERE Username = ?', [USERNAME]);
  await conn.query(
    'INSERT INTO users (AnalistaId, Perfil, Username, PasswordHash, MFAAtivo) VALUES (?, ?, ?, ?, 0)',
    [1, 1, USERNAME, passwordHash]
  );

  console.log(`Usuario de teste criado em "${DB_NAME}": usuario=${USERNAME} senha=${PLAIN_PASSWORD}`);
  await conn.end();
}

main().catch((err) => {
  console.error('Erro ao criar usuario de teste:', err.message);
  process.exit(1);
});

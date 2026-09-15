// teste-banco.js
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function teste() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'teste1',
      database: 'empresa1'   // o banco que você quer checar
    });

    // Mostra qual banco está usando
    const [rowsDb] = await conn.query('SELECT DATABASE() AS db');
    console.log('Conectado ao banco:', rowsDb[0].db);

    // Mostra a tabela modulo
    const [rowsTable] = await conn.query('SELECT * FROM modulo');
    console.log('Conteúdo da tabela modulo:', rowsTable);

    await conn.end();
  } catch (err) {
    console.error('Erro ao conectar ou consultar:', err.message);
  }
}

teste();

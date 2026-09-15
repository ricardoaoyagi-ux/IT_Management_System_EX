import 'dotenv/config';
import mysql from 'mysql2/promise';

const poolEmpresa1 = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'teste1',
  database: 'empresa1'
});

const poolEmpresa2 = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'teste1',
  database: 'empresa2'
});


const poolEmpresa3 = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'teste1',
  database: 'empresa3'
});

// mapa de bases disponíveis
export const pools = {
  empresa1: poolEmpresa1,
  empresa2: poolEmpresa2,
  empresa3: poolEmpresa3
};

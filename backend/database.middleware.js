import { pools } from './db.js';

export function databaseMiddleware(req, res, next) {

  const base =
    req.headers['x-base'] ||
    req.body?.base;   // body é opcional

  if (!base) {
    return res.status(400).json({
      message: 'Base não informada'
    });
  }

  const pool = pools[base];

  if (!pool) {
    return res.status(400).json({
      message: 'Base inválida'
    });
  }

  req.db = pool;
  req.base = base;

  next();
}

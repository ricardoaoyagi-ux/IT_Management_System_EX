import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET - Relatório dinâmico de Problems
router.get('/', async (req, res) => {
  try {
    const {
      tipoData,
      periodo,
      dataInicio,
      dataFim,
      tipProblem,
      status
    } = req.query;

    let where = [];
    let params = [];

    // Define qual campo de data será usado
    let campoData = null;

    if (tipoData === 'abertura') {
      campoData = 'a.Dt_Abertura';
    }

    if (tipoData === 'encerramento') {
      campoData = 'a.Dt_Encerramento';
    }

    let query = `
      SELECT  
        a.Cod_Problem as Id,
        a.Nom_Problem,
        a.Desc_Problem as Descricao,
        DATE_FORMAT(a.Dt_Abertura, '%Y-%m-%dT%H:%i:%s') AS Dt_Abertura,
        DATE_FORMAT(a.Dt_Encerramento, '%Y-%m-%dT%H:%i:%s') AS Dt_Encerramento,
        a.Tip_Problem,
        b.Desc_Tip_Problem,
        a.Status,
        c.Desc_Status,
        a.PM_CLIENTE,
        a.Analista_Cadastro,
        a.Analista_Responsavel,
        (
          SELECT COUNT(1)
          FROM inc_problem inc
          WHERE inc.Cod_Problem = a.Cod_Problem
        ) AS cont_inc_problem
      FROM problems a
      JOIN tip_problem b ON b.Tip_Problem = a.Tip_Problem
      JOIN status_problem c ON c.Status = a.Status
    `;

    // =========================
    // Filtros numéricos
    // =========================
    if (tipProblem) {
      where.push('a.Tip_Problem = ?');
      params.push(Number(tipProblem));
    }

    if (status) {
      where.push('a.Status = ?');
      params.push(Number(status));
    }

    // =========================
    // Filtros de data (dinâmicos)
    // =========================
    if (campoData) {

      // Período personalizado
      if (periodo === 'personalizado') {

        if (dataInicio) {
          where.push(`${campoData} >= ?`);
          params.push(dataInicio);
        }

        if (dataFim) {
          where.push(`${campoData} <= ?`);
          params.push(dataFim);
        }

      } else if (periodo) {

        // Períodos pré-definidos
        if (periodo === '3m') {
          where.push(`${campoData} >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)`);
        }

        if (periodo === 'mes') {
          where.push(`MONTH(${campoData}) = MONTH(CURDATE())`);
          where.push(`YEAR(${campoData}) = YEAR(CURDATE())`);
        }

        if (periodo === 'ano') {
          where.push(`YEAR(${campoData}) = YEAR(CURDATE())`);
        }
      }
    }

    // =========================
    // Aplica WHERE
    // =========================
    if (where.length > 0) {
      query += ' WHERE ' + where.join(' AND ');
    }

    // Ordenação padrão
    query += ' ORDER BY a.Dt_Abertura DESC'; 
    const [rows] = await req.db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de problems' });
  }
});


export default router;

import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
/**
 * ======================================================
 * ABA 1 - Pendentes x Feitos (FEITAS por enquanto)
 * ======================================================
 */
router.get('/pendencias', async (req, res) => {
  try {
    const { periodo, dataInicio, dataFim, tipo } = req.query;

    let where = [];
    let params = [];

    let query = `
      SELECT
        v.lider as analista,
    COUNT(CASE WHEN v.obs IS NULL THEN 1 END) AS pendentes,
    COUNT(CASE WHEN v.obs IS NOT NULL THEN 1 END) AS feitas
      FROM vw_justificativas v
    `;

    // =========================
    // Tipo: SLA / REABERTURA
    // =========================
    if (tipo && tipo !== 'TODOS') {
      where.push('v.tipo_justificativa = ?');
      params.push(tipo);
    }

    // =========================
    // Filtro de período
    // =========================
    if (periodo === 'personalizado') {

      if (dataInicio) {
        where.push('v.data_evento >= ?');
        params.push(dataInicio);
      }

      if (dataFim) {
        where.push('v.data_evento <= ?');
        params.push(dataFim);
      }

    } else if (periodo === '3m') {
      where.push('v.data_evento >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)');
    }

    // =========================
    // Aplica WHERE
    // =========================
    if (where.length > 0) {
      query += ' WHERE ' + where.join(' AND ');
    }

    query += ' GROUP BY v.lider ORDER BY feitas DESC';

    const [rows] = await req.db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de pendências' });
  }
});

/**
 * ======================================================
 * ABA 2 - Principais Motivos (últimos 3 meses)
 * ======================================================
 */
router.get('/motivos', async (req, res) => {
  try {
    const { periodo, dataInicio, dataFim, tipo } = req.query;

    let where = [];
    let params = [];

    let query = `
      SELECT
        DATE_FORMAT(v.data_evento, '%Y-%m') AS mes,
        m.descricao AS motivo,
        COUNT(*) AS quantidade
      FROM vw_justificativas v
      JOIN motivo_justificativa m
        ON m.cod_motivo = v.motivo_id
    `;

    where.push(`m.ativo = 'S'`);

    // =========================
    // Tipo: SLA / REABERTURA
    // =========================
    if (tipo && tipo !== 'TODOS') {
      where.push('v.tipo_justificativa = ?');
      params.push(tipo);
    }

    // =========================
    // Filtro de período
    // =========================
    if (periodo === 'personalizado') {

      if (dataInicio) {
        where.push('v.data_evento >= ?');
        params.push(dataInicio);
      }

      if (dataFim) {
        where.push('v.data_evento <= ?');
        params.push(dataFim);
      }

    } else {
      // default: últimos 3 meses
      where.push('v.data_evento >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)');
    }

    // =========================
    // Aplica WHERE
    // =========================
    if (where.length > 0) {
      query += ' WHERE ' + where.join(' AND ');
    }

    query += `
      GROUP BY mes, motivo
      ORDER BY mes DESC, quantidade DESC
    `;

    const [rows] = await req.db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de motivos' });
  }
});

/**
 * ======================================================
 * ABA 3 - Analistas Ofensores
 * ======================================================
 */
router.get('/analistas', async (req, res) => {
  try {
    const { periodo, dataInicio, dataFim, tipo } = req.query;

    let where = [];
    let params = [];

    let query = `
      SELECT
        v.analista,
        COUNT(*) AS total
      FROM vw_justificativas v
    `;

    // =========================
    // Tipo: SLA / REABERTURA
    // =========================
    if (tipo && tipo !== 'TODOS') {
      where.push('v.tipo_justificativa = ?');
      params.push(tipo);
    }

    // =========================
    // Filtro de período
    // =========================
    if (periodo === 'personalizado') {

      if (dataInicio) {
        where.push('v.data_evento >= ?');
        params.push(dataInicio);
      }

      if (dataFim) {
        where.push('v.data_evento <= ?');
        params.push(dataFim);
      }

    } else if (periodo === '3m') {
      where.push('v.data_evento >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)');
    }

    // =========================
    // Aplica WHERE
    // =========================
    if (where.length > 0) {
      query += ' WHERE ' + where.join(' AND ');
    }

    query += ' GROUP BY v.analista ORDER BY total DESC';

    const [rows] = await req.db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de analistas' });
  }
});

export default router;

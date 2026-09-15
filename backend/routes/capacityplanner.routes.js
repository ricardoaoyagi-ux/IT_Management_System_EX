import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();
router.use(databaseMiddleware);

// =====================
// Analistas
// =====================
router.get('/analistas', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        a.Id_Analista,
        a.Matricula,
        a.Nom_Analista,
        COALESCE(a.Dt_Inicio, '2026-01-01') AS Dt_Inicio,
        COALESCE(a.Dt_Fim, '9999-12-31') AS Dt_Fim,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM timebox_projeto_participacao tpm
            WHERE tpm.UserId = a.Id_Analista
          )
          THEN 'PROJETOS'
          ELSE 'SUSTAIN'
        END AS Grupo
      FROM analistas a
      WHERE a.Matricula IS NOT NULL
        AND a.Nom_Analista IS NOT NULL
      ORDER BY a.Nom_Analista
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar analistas' });
  }
});


// =====================
// Projetos
// =====================
router.get('/timebox-projeto', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        p.Id,
        p.Nome,
        p.Descricao,
        p.HorasPrevistas,
        p.HorasConsumidas,
        DATE_FORMAT(p.DataInicio, '%Y-%m-%d') AS DataInicio,
        DATE_FORMAT(p.DataPrevisaoFim, '%Y-%m-%d') AS DataPrevisaoFim,
        DATE_FORMAT(p.DataFimReal, '%Y-%m-%d') AS DataFimReal,
        p.Status,
        c.Id AS ContratoId,
        c.Descricao AS ContratoDescricao,
        c.HorasContratadas,
        c.HorasConsumidas AS ContratoHorasConsumidas,
        DATE_FORMAT(c.DataInicio, '%Y-%m-%d') AS ContratoDataInicio,
        DATE_FORMAT(c.DataFim, '%Y-%m-%d') AS ContratoDataFim,
        c.Status AS ContratoStatus
      FROM timebox_projeto p
      LEFT JOIN timebox_contrato c
        ON p.TimeboxContratoId = c.Id
      WHERE p.DataPrevisaoFim >= '2026-01-01'
      ORDER BY p.DataInicio
    `);

    const projetos = rows.map(r => ({
      ...r,
      contrato: r.ContratoId ? {
        Id: r.ContratoId,
        Descricao: r.ContratoDescricao,
        HorasContratadas: r.HorasContratadas,
        HorasConsumidas: r.ContratoHorasConsumidas,
        DataInicio: r.ContratoDataInicio,
        DataFim: r.ContratoDataFim,
        Status: r.ContratoStatus
      } : undefined
    }));

    res.json(projetos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar projetos' });
  }
});


// =====================
// Projeto x Membro
// =====================
router.get('/timebox-projeto-membro', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        Id,
        TimeboxProjetoId,
        UserId,
        HorasPordia as QuantidadeHoras
      FROM timebox_projeto_participacao
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar membros de projeto' });
  }
});

// =====================
// Feriados
// =====================
router.get('/feriados', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        Id,
        Data,
        Nome
      FROM feriado
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar feriados' });
  }
});

// =====================
// Férias / Licenças / Ausências
// =====================
router.get('/ferias', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        Id,
        Matricula,
        Dt_Inicio,
        Dt_Fim,
        Nota
      FROM ferias
      WHERE Dt_Inicio >= '2026-01-01'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar férias' });
  }
});

// =====================
// Participações
// =====================
router.get('/participacoes', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        p.Id,
        p.TimeboxProjetoId,
        p.UserId,
        p.Papel,
        DATE_FORMAT(p.DataInicio, '%Y-%m-%d') AS DataInicio,
        DATE_FORMAT(p.DataFim, '%Y-%m-%d') AS DataFim,
        p.HorasPorDia
      FROM timebox_projeto_participacao p
      WHERE p.DataFim >= '2026-01-01'
      ORDER BY p.TimeboxProjetoId, p.UserId, p.DataInicio
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar participações' });
  }
});

export default router;

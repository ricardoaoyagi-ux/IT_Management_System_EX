import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();
 
// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET – busca filtrada
router.get('/buscar', async (req, res) => {
  try {
    const { cod_sistema, Cod_Modulo, Cod_agrupamento, cod_subagrupamento } = req.query;

    // Checa se todos os filtros obrigatórios estão presentes
    if (!cod_sistema || !Cod_Modulo || !Cod_agrupamento || !cod_subagrupamento) {
      return res.status(400).json({ error: 'Todos os filtros são obrigatórios' });
    }

    const [rows] = await req.db.query(`
      SELECT s.nom_sistema AS nome_sistema,
             m.nom_modulo AS nome_modulo,
             a.nom_agrupamento AS nome_agrupamento,
             sa.nom_subagrupamento AS nome_subagrupamento,
             ss.*
      FROM sub_subagrupamento ss
      JOIN sistema s ON s.Cod_Sistema = ss.cod_sistema
      JOIN modulo m ON m.cod_modulo = ss.Cod_Modulo AND m.Cod_Sistema = ss.cod_sistema
      JOIN agrupamento a ON a.cod_agrupamento = ss.cod_agrupamento AND a.Cod_Modulo = ss.Cod_Modulo AND a.Cod_Sistema = ss.cod_sistema
      JOIN sub_agrupamento sa ON sa.cod_subagrupamento = ss.cod_subagrupamento AND sa.cod_agrupamento = ss.cod_agrupamento AND sa.Cod_Modulo = ss.Cod_Modulo AND sa.Cod_Sistema = ss.cod_sistema
      WHERE ss.cod_sistema = ?
        AND ss.Cod_Modulo = ?
        AND ss.cod_agrupamento = ?
        AND ss.cod_subagrupamento = ?
      ORDER BY ss.cod_subsubagrupamento
    `, [cod_sistema, Cod_Modulo, Cod_agrupamento, cod_subagrupamento]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar sub_subagrupamento' });
  }
});

// =========================
// POST – criar
// =========================
router.post('/', async (req, res) => {
  const s = req.body;

  try {
    await req.db.query(`
      INSERT INTO sub_subagrupamento
      (cod_sistema, Cod_Modulo, cod_agrupamento, cod_subagrupamento, cod_subsubagrupamento, nom_subsubagrupamento)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      s.cod_sistema,
      s.Cod_Modulo,
      s.cod_agrupamento,
      s.cod_subagrupamento,
      s.cod_subsubagrupamento,
      s.nom_subsubagrupamento
    ]);

    res.status(201).json({ message: 'Sub-Sub-Agrupamento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar sub_subagrupamento' });
  }
});

// =========================
// PUT – atualizar
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const s = req.body;

  try {
    await req.db.query(`
      UPDATE sub_subagrupamento SET
        cod_sistema = ?,
        Cod_Modulo = ?,
        cod_agrupamento = ?,
        cod_subagrupamento = ?,
        cod_subsubagrupamento = ?,
        nom_subsubagrupamento = ?
      WHERE Id = ?
    `, [
      s.cod_sistema,
      s.Cod_Modulo,
      s.cod_agrupamento,
      s.cod_subagrupamento,
      s.cod_subsubagrupamento,
      s.nom_subsubagrupamento,
      id
    ]);

    res.json({ message: 'Sub-Sub-Agrupamento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar sub_subagrupamento' });
  }
});

// =========================
// DELETE
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query('DELETE FROM sub_subagrupamento WHERE Id = ?', [id]);
    res.json({ message: 'Sub-Sub-Agrupamento deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar sub_subagrupamento' });
  }
});

// ==========================
// GET – Lista sub-sub-agrupamentos filtrando por sistema, módulo, agrupamento e subagrupamento
// ==========================
router.get('/dropdown/:sistemaId/:moduloId/:agrupamentoId/:subagrupamentoId', async (req, res) => {
  const { sistemaId, moduloId, agrupamentoId, subagrupamentoId } = req.params;
  try {
    const [rows] = await req.db.query(
      `SELECT cod_subsubagrupamento, nom_subsubagrupamento 
       FROM sub_subagrupamento 
       WHERE cod_sistema = ? AND Cod_Modulo = ? AND cod_agrupamento = ? AND cod_subagrupamento = ?
       order by nom_subsubagrupamento`,
      [sistemaId, moduloId, agrupamentoId, subagrupamentoId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar sub-sub-agrupamentos' });
  }
});

// ==========================
// GET – Próximo código Sub-Sub-Agrupamento
// ==========================
router.get('/next-cod', async (req, res) => {
  const {
    cod_sistema,
    Cod_Modulo,
    cod_agrupamento,
    cod_subagrupamento
  } = req.query;

  try {
    const [rows] = await req.db.query(
      `
      SELECT
        COALESCE(MAX(cod_subsubagrupamento), 0) + 1 AS nextcod_subsubagrupamento
      FROM sub_subagrupamento
      WHERE cod_sistema = ?
        AND Cod_Modulo = ?
        AND cod_agrupamento = ?
        AND cod_subagrupamento = ?
      `,
      [
        cod_sistema,
        Cod_Modulo,
        cod_agrupamento,
        cod_subagrupamento
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Erro ao gerar próximo código de sub-sub-agrupamento'
    });
  }
});

export default router;

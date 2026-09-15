import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET – BUSCAR sub_agrupamento (filtrado)
router.get('/buscar', async (req, res) => {
  const { cod_sistema, Cod_Modulo, cod_agrupamento } = req.query;

  try {
    const [rows] = await req.db.query(
      `      SELECT s.nom_sistema AS nome_sistema,
             m.nom_modulo AS nome_modulo,
             a.nom_agrupamento AS nom_agrupamento, 
             sa.*
             from sub_agrupamento sa
      JOIN sistema s ON s.Cod_Sistema = sa.cod_sistema
      JOIN modulo m ON m.cod_modulo = sa.Cod_Modulo AND m.Cod_Sistema = sa.cod_sistema
      JOIN agrupamento a ON a.cod_agrupamento = sa.cod_agrupamento AND a.Cod_Modulo = sa.Cod_Modulo AND a.Cod_Sistema = sa.cod_sistema
        WHERE sa.cod_sistema = ?
        AND sa.Cod_Modulo = ?
        AND sa.cod_agrupamento = ?
      ORDER BY sa.cod_subagrupamento`,
      [cod_sistema, Cod_Modulo, cod_agrupamento]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar sub_agrupamento' });
  }
});


// POST
router.post('/', async (req, res) => {
  const s = req.body;
  try {
    await req.db.query(`
      INSERT INTO sub_agrupamento 
      (cod_sistema, Cod_Modulo, cod_agrupamento, cod_subagrupamento, nom_subagrupamento)
      VALUES (?, ?, ?, ?, ?)
    `, [
      s.cod_sistema,
      s.Cod_Modulo,
      s.cod_agrupamento,
      s.cod_subagrupamento,
      s.nom_subagrupamento
    ]);
    res.status(201).json({ message: 'Sub-Agrupamento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar sub-agrupamento' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const s = req.body;
  try {
    await req.db.query(`
      UPDATE sub_agrupamento SET
        cod_sistema = ?, Cod_Modulo = ?, cod_agrupamento = ?, cod_subagrupamento = ?, nom_subagrupamento = ?
      WHERE Id = ?
    `, [
      s.cod_sistema,
      s.Cod_Modulo,
      s.cod_agrupamento,
      s.cod_subagrupamento,
      s.nom_subagrupamento,
      id
    ]);
    res.json({ message: 'Sub-Agrupamento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar sub-agrupamento' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM sub_agrupamento WHERE Id = ?', [id]);
    res.json({ message: 'Sub-Agrupamento deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar sub-agrupamento' });
  }
});

// =========================
// GET - Lista subagrupamentos por sistema, módulo e agrupamento
// =========================
router.get('/dropdown/:sistemaId/:moduloId/:agrupamentoId', async (req, res) => {
  const { sistemaId, moduloId, agrupamentoId } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT cod_subagrupamento, nom_subagrupamento FROM sub_agrupamento WHERE cod_sistema = ? AND cod_modulo = ? AND cod_agrupamento = ? order by nom_subagrupamento',
      [sistemaId, moduloId, agrupamentoId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar subagrupamentos' });
  }
});

// ==========================
// GET – Próximo código Sub-Agrupamento
// ==========================
router.get('/next-cod', async (req, res) => {
  const {
    cod_sistema,
    Cod_Modulo,
    cod_agrupamento
  } = req.query;

  try {
    const [rows] = await req.db.query(
      `
      SELECT
        COALESCE(MAX(cod_subagrupamento), 0) + 1 AS nextcod_subagrupamento
      FROM sub_agrupamento
      WHERE cod_sistema = ?
        AND Cod_Modulo = ?
        AND cod_agrupamento = ?
      `,
      [
        cod_sistema,
        Cod_Modulo,
        cod_agrupamento
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

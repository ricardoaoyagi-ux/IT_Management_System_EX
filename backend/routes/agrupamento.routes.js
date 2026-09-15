import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();
 
// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);

// POST
router.post('/', async (req, res) => {
  const { Cod_Sistema, Cod_Modulo, Cod_agrupamento, nom_agrupamento } = req.body;

  try {
    await req.db.query(
      `INSERT INTO agrupamento
       (Cod_Sistema, Cod_Modulo, Cod_agrupamento, nom_agrupamento)
       VALUES (?, ?, ?, ?)`,
      [Cod_Sistema, Cod_Modulo, Cod_agrupamento, nom_agrupamento]
    );
    res.status(201).json({ message: 'Agrupamento criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar agrupamento' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Cod_Sistema, Cod_Modulo, Cod_agrupamento, nom_agrupamento } = req.body;

  try {
    const [result] = await req.db.query(
      `UPDATE agrupamento
       SET Cod_Sistema = ?, Cod_Modulo = ?, Cod_agrupamento = ?, nom_agrupamento = ?
       WHERE Id = ?`,
      [Cod_Sistema, Cod_Modulo, Cod_agrupamento, nom_agrupamento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agrupamento não encontrado' });
    }

    res.json({ message: 'Agrupamento atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar agrupamento' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM agrupamento WHERE Id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agrupamento não encontrado' });
    }

    res.json({ message: 'Agrupamento deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar agrupamento' });
  }
});

// =========================
// GET - Lista agrupamentos por sistema e módulo
// =========================
router.get('/dropdown/:sistemaId/:moduloId', async (req, res) => {
  const { sistemaId, moduloId } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT cod_agrupamento, nom_agrupamento FROM agrupamento WHERE cod_sistema = ? AND cod_modulo = ? order by nom_agrupamento',
      [sistemaId, moduloId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar agrupamentos' });
  }
});

// GET
router.get('/buscar', async (req, res) => {
  const { Cod_Sistema, Cod_Modulo } = req.query;

  const [rows] = await req.db.query(
    `      SELECT s.nom_sistema AS nome_sistema,
             m.nom_modulo AS nome_modulo,
             a.*
             from agrupamento a
      JOIN sistema s ON s.Cod_Sistema = a.cod_sistema
      JOIN modulo m ON m.cod_modulo = a.Cod_Modulo AND m.Cod_Sistema = a.cod_sistema
      WHERE a.cod_sistema = ?
        AND a.Cod_Modulo = ?
      ORDER BY a.Cod_agrupamento`,
    [Cod_Sistema, Cod_Modulo]
  );

  res.json(rows);
});


// ==========================
// GET – Próximo código Agrupamento
// ==========================
router.get('/next-cod', async (req, res) => {
  const {
    cod_sistema,
    Cod_Modulo
  } = req.query;

  try {
    const [rows] = await req.db.query(
      `
      SELECT
        COALESCE(MAX(cod_agrupamento), 0) + 1 AS nextcod_agrupamento
      FROM agrupamento
      WHERE cod_sistema = ?
        AND Cod_Modulo = ?
      `,
      [
        cod_sistema,
        Cod_Modulo
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Erro ao gerar próximo código de agrupamento'
    });
  }
});

export default router;

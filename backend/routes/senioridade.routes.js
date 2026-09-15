import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// =========================
// GET - Lista Senioridades
// =========================
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        ID_Senioridade,
        Categoria,
        Cat
      FROM Senioridade
      ORDER BY ID_Senioridade
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar senioridades' });
  }
});

// =========================
// POST - Criar Senioridade
// =========================
router.post('/', async (req, res) => {
  const { Categoria, Cat } = req.body;

  try {
    await req.db.query(
      `
      INSERT INTO Senioridade (Categoria, Cat)
      VALUES (?, ?)
      `,
      [Categoria, Cat]
    );

    res.status(201).json({ message: 'Senioridade criada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar senioridade' });
  }
});

// =========================
// PUT - Atualizar Senioridade
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Categoria, Cat } = req.body;

  try {
    await req.db.query(
      `
      UPDATE Senioridade
      SET
        Categoria = ?,
        Cat = ?
      WHERE ID_Senioridade = ?
      `,
      [Categoria, Cat, id]
    );

    res.json({ message: 'Senioridade atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar senioridade' });
  }
});

// =========================
// DELETE - Deletar Senioridade
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      'DELETE FROM Senioridade WHERE ID_Senioridade = ?',
      [id]
    );

    res.json({ message: 'Senioridade deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar senioridade' });
  }
});

// =========================
// GET - Dropdown Senioridade
// =========================
router.get('/dropdown', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        ID_Senioridade,
        Categoria,
        Cat
      FROM Senioridade
      ORDER BY ID_Senioridade
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar senioridades' });
  }
});

export default router;

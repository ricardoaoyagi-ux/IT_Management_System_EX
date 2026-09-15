import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET – retorna todos os campos
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT Id, Tip_Problem, Desc_Tip_Problem
      FROM tip_problem
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar tip_problem' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Tip_Problem, Desc_Tip_Problem } = req.body;
  try {
    await req.db.query(
      `INSERT INTO tip_problem (Tip_Problem, Desc_Tip_Problem)
       VALUES (?, ?)`,
      [Tip_Problem, Desc_Tip_Problem]
    );
    res.status(201).json({ message: 'Tip Problem criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tip_problem' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Tip_Problem, Desc_Tip_Problem } = req.body;
  try {
    await req.db.query(
      `UPDATE tip_problem SET Tip_Problem = ?, Desc_Tip_Problem = ? WHERE Id = ?`,
      [Tip_Problem, Desc_Tip_Problem, id]
    );
    res.json({ message: 'Tip Problem atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tip_problem' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM tip_problem WHERE Id = ?', [id]);
    res.json({ message: 'Tip Problem deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar tip_problem' });
  }
});

export default router;

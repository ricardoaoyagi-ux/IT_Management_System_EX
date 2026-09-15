import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET – retorna todos os campos
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT Id, Status, Desc_Status
      FROM status_problem
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar status_problem' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Status, Desc_Status } = req.body;

  try {
    await req.db.query(
      `INSERT INTO status_problem (Status, Desc_Status)
       VALUES (?, ?)`,
      [Status, Desc_Status]
    );
    res.status(201).json({ message: 'Status criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar status' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Status, Desc_Status } = req.body;

  try {
    await req.db.query(
      `UPDATE status_problem
       SET Status = ?, Desc_Status = ?
       WHERE Id = ?`,
      [Status, Desc_Status, id]
    );
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      'DELETE FROM status_problem WHERE Id = ?',
      [id]
    );
    res.json({ message: 'Status deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar status' });
  }
});

export default router;

import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`SELECT Id, Rate, Valor, Especialidade FROM rates`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar rates' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Rate, Valor, Especialidade } = req.body;
  try {
    await req.db.query(
      'INSERT INTO rates (Rate, Valor, Especialidade) VALUES (?, ?, ?)',
      [Rate, Valor, Especialidade]
    );
    res.status(201).json({ message: 'Rate criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar rate' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Rate, Valor, Especialidade } = req.body;
  try {
    await req.db.query(
      'UPDATE rates SET Rate = ?, Valor = ?, Especialidade = ? WHERE Id = ?',
      [Rate, Valor, Especialidade, id]
    );
    res.json({ message: 'Rate atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar rate' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM rates WHERE Id = ?', [id]);
    res.json({ message: 'Rate deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar rate' });
  }
});

// =========================
// GET - Lista Rates
// =========================
router.get('/dropdown', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT Rate, Valor FROM rates ORDER BY Rate'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar rates' });
  }
});

export default router;

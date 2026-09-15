import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT Id, Cod_Alocacao, Desc_Alocacao FROM alocacao'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar alocações' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Cod_Alocacao, Desc_Alocacao } = req.body;

  try {
    await req.db.query(
      'INSERT INTO alocacao (Cod_Alocacao, Desc_Alocacao) VALUES (?, ?)',
      [Cod_Alocacao, Desc_Alocacao]
    );
    res.status(201).json({ message: 'Alocação criada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar alocação' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Cod_Alocacao, Desc_Alocacao } = req.body;

  try {
    const [result] = await req.db.query(
      'UPDATE alocacao SET Cod_Alocacao = ?, Desc_Alocacao = ? WHERE Id = ?',
      [Cod_Alocacao, Desc_Alocacao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alocação não encontrada' });
    }

    res.json({ message: 'Alocação atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar alocação' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM alocacao WHERE Id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alocação não encontrada' });
    }

    res.json({ message: 'Alocação deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar alocação' });
  }
});

// =========================
// GET - Lista Alocacao
// =========================
router.get('/dropdown', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT Cod_alocacao, Desc_alocacao FROM alocacao ORDER BY Cod_alocacao'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar alocação' });
  }
});

export default router;

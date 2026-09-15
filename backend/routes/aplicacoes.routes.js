import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`SELECT Codigo, Id_Aplicacao, Nom_Aplicacao FROM aplicacoes`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar aplicações' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Id_Aplicacao, Nom_Aplicacao } = req.body;
  try {
    await req.db.query(
      'INSERT INTO aplicacoes (Id_Aplicacao, Nom_Aplicacao) VALUES (?, ?)',
      [Id_Aplicacao, Nom_Aplicacao]
    );
    res.status(201).json({ message: 'Aplicação criada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar aplicação' });
  }
});

// PUT
router.put('/:codigo', async (req, res) => {
  const { Id_Aplicacao, Nom_Aplicacao } = req.body;
  const { codigo } = req.params;
  try {
    await req.db.query(
      'UPDATE aplicacoes SET Id_Aplicacao=?, Nom_Aplicacao=? WHERE Codigo=?',
      [Id_Aplicacao, Nom_Aplicacao, codigo]
    );
    res.json({ message: 'Aplicação atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar aplicação' });
  }
});

// DELETE
router.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  try {
    await req.db.query('DELETE FROM aplicacoes WHERE Codigo=?', [codigo]);
    res.json({ message: 'Aplicação deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar aplicação' });
  }
});

export default router;

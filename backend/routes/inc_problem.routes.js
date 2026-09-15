import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`SELECT Id, Cod_Problem, Id_Incidente FROM inc_problem`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar inc_problem' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Cod_Problem, Id_Incidente } = req.body;
  try {
    await req.db.query(
      'INSERT INTO inc_problem (Cod_Problem, Id_Incidente) VALUES (?, ?)',
      [Cod_Problem, Id_Incidente]
    );
    res.status(201).json({ message: 'Inc_problem criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar inc_problem' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { Cod_Problem, Id_Incidente } = req.body;
  const { id } = req.params;
  try {
    await req.db.query(
      'UPDATE inc_problem SET Cod_Problem=?, Id_Incidente=? WHERE Id=?',
      [Cod_Problem, Id_Incidente, id]
    );
    res.json({ message: 'Inc_problem atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar inc_problem' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM inc_problem WHERE Id=?', [id]);
    res.json({ message: 'Inc_problem deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar inc_problem' });
  }
});

// GET by Id_Incidente
router.get('/by-incidente/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await req.db.query('SELECT * FROM inc_problem WHERE Id_Incidente = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar inc_problem pelo incidente' });
  }
});


export default router;

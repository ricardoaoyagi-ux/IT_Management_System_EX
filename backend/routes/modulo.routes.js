import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT Id, Cod_Sistema, Cod_Modulo, Nom_Modulo FROM modulo order by cod_sistema, cod_modulo'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar módulos' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { Cod_Sistema, Cod_Modulo, Nom_Modulo } = req.body;

  try {
    await req.db.query(
      'INSERT INTO modulo (Cod_Sistema, Cod_Modulo, Nom_Modulo) VALUES (?, ?, ?)',
      [Cod_Sistema, Cod_Modulo, Nom_Modulo]
    );
    res.status(201).json({ message: 'Módulo criado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar módulo' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Cod_Sistema, Cod_Modulo, Nom_Modulo } = req.body;

  try {
    await req.db.query(
      'UPDATE modulo SET Cod_Sistema = ?, Cod_Modulo = ?, Nom_Modulo = ? WHERE Id = ?',
      [Cod_Sistema, Cod_Modulo, Nom_Modulo, id]
    );
    res.json({ message: 'Módulo atualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar módulo' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM modulo WHERE Id = ?', [req.params.id]);
    res.json({ message: 'Módulo deletado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar módulo' });
  }
});

// =========================
// GET - Lista módulos por sistema
// =========================
router.get('/dropdown/:sistemaId', async (req, res) => {
  const { sistemaId } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT cod_modulo, nom_modulo FROM modulo WHERE cod_sistema = ? order by nom_modulo',
      [sistemaId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar módulos' });
  }
});

export default router;

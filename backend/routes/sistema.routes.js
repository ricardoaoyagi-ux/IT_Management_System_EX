import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// =========================
// GET - Lista todos os sistemas
// =========================
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT Id, Cod_Sistema, Nom_Sistema FROM sistema order by cod_sistema'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar sistemas' });
  }
});

// =========================
// POST - Cria um sistema
// =========================
router.post('/', async (req, res) => {
  const { Cod_Sistema, Nom_Sistema } = req.body;

  if (!Cod_Sistema || !Nom_Sistema) {
    return res.status(400).json({ error: 'Campos obrigatórios não informados' });
  }

  try {
    await req.db.query(
      'INSERT INTO sistema (Cod_Sistema, Nom_Sistema) VALUES (?, ?)',
      [Cod_Sistema, Nom_Sistema]
    );
    res.status(201).json({ message: 'Sistema criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar sistema' });
  }
});

// =========================
// PUT - Atualiza um sistema
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Cod_Sistema, Nom_Sistema } = req.body;

  if (!Cod_Sistema || !Nom_Sistema) {
    return res.status(400).json({ error: 'Campos obrigatórios não informados' });
  }

  try {
    const [result] = await req.db.query(
      'UPDATE sistema SET Cod_Sistema = ?, Nom_Sistema = ? WHERE Id = ?',
      [Cod_Sistema, Nom_Sistema, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sistema não encontrado' });
    }

    res.json({ message: 'Sistema atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar sistema' });
  }
});

// =========================
// DELETE - Remove um sistema
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await req.db.query(
      'DELETE FROM sistema WHERE Id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sistema não encontrado' });
    }

    res.json({ message: 'Sistema deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar sistema' });
  }
});


// =========================
// GET - Lista todos os sistemas (para dropdown)
// Retorna Id_aplicacao e nom_aplicacao concatenados
// =========================
router.get('/dropdown', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT cod_sistema AS Id_aplicacao, Nom_Sistema AS nom_aplicacao FROM sistema order by Nom_Sistema' 
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar sistemas para dropdown' });
  }
});

export default router;

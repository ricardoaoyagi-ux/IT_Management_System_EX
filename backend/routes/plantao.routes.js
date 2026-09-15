import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// =========================
// GET - Lista todos os plantões
// =========================
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT Id,
      DATE_FORMAT(data_ini, '%Y-%m-%d') AS data_ini,
      DATE_FORMAT(data_fim, '%Y-%m-%d') AS data_fim,
      fechamento, 
      nivel1_sistemaA,
      nivel1_sistemaD, 
      nivel1_codeadmin, 
      nivel2, 
      obs, 
      DATE_FORMAT(data_alteracao, '%Y-%m-%d %H:%i:%s') AS data_alteracao,
      usuario_alteracao
      FROM Plantao
      ORDER BY data_ini ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar plantões' });
  }
});

// =========================
// POST - Criar novo plantão
// =========================
router.post('/', async (req, res) => {
  const { data_ini, data_fim, fechamento, nivel1_sistemaA, nivel1_sistemaD, nivel1_codeadmin, nivel2, obs, data_alteracao, usuario_alteracao } = req.body;
  try {
    await req.db.query(
      `INSERT INTO Plantao 
        (data_ini, data_fim, fechamento, nivel1_sistemaA, nivel1_sistemaD, nivel1_codeadmin, nivel2, obs, data_alteracao, usuario_alteracao) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data_ini, data_fim, fechamento, nivel1_sistemaA, nivel1_sistemaD, nivel1_codeadmin, nivel2, obs, data_alteracao, usuario_alteracao]
    );
    res.status(201).json({ message: 'Plantão criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar plantão' });
  }
});

// =========================
// PUT - Atualizar plantão
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data_ini, data_fim, fechamento, nivel1_sistemaA, nivel1_sistemaD, nivel1_codeadmin, nivel2, obs, data_alteracao, usuario_alteracao } = req.body;
  try {
    await req.db.query(
      `UPDATE Plantao SET 
        data_ini = ?, data_fim = ?, fechamento = ?, nivel1_sistemaA = ?, nivel1_sistemaD = ?, nivel1_codeadmin = ?, nivel2 = ?, obs = ?, data_alteracao = ?, usuario_alteracao = ?
      WHERE Id = ?`,
      [data_ini, data_fim, fechamento, nivel1_sistemaA, nivel1_sistemaD, nivel1_codeadmin, nivel2, obs, data_alteracao, usuario_alteracao, id]
    );
    res.json({ message: 'Plantão atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar plantão' });
  }
});

// =========================
// DELETE - Excluir plantão
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM Plantao WHERE Id = ?', [id]);
    res.json({ message: 'Plantão deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar plantão' });
  }
});

export default router;

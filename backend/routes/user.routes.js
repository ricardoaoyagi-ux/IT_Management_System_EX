import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router(); 

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// Listar todos os usuários
router.get('/', async (req, res) => {
  try {

const [rows] = await req.db.query(
  'SELECT Id, AnalistaId, Perfil, Username, MFAAtivo FROM users'
);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Obter usuário por Id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {

const [rows] = await req.db.query(
  'SELECT Id, AnalistaId, Perfil, Username, MFAAtivo FROM users WHERE Id = ?',
  [id]
);

    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

router.post('/', async (req, res) => {
  const { Perfil, Username, PasswordHash } = req.body;

  try {
    // 🔹 Busca o último AnalistaId
    const [rows] = await req.db.query(
      'SELECT COALESCE(MAX(id_analista), 0) + 1 AS nextAnalistaId FROM analistas'
    );

    const nextAnalistaId = rows[0].nextAnalistaId;

    // 🔹 Hash da senha
    const hashedPassword = await bcrypt.hash(PasswordHash, 10);

    await req.db.query(
      `INSERT INTO users (AnalistaId, Perfil, Username, PasswordHash)
       VALUES (?, ?, ?, ?)`,
      [nextAnalistaId, Perfil, Username, hashedPassword]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      AnalistaId: nextAnalistaId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});



// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { AnalistaId, Perfil, Username, PasswordHash } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(PasswordHash, 10);

    await req.db.query(
      'UPDATE users SET Perfil = ?, PasswordHash = ? WHERE Id = ?',
      [Perfil, hashedPassword, id]
    );
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});
 

// Troca senha
router.put('/:id/password', async (req, res) => {
  const { senha } = req.body;
  const { id } = req.params;

  if (!senha) {
    return res.status(400).json({ message: 'Senha obrigatória' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    await req.db.query(
      'UPDATE users SET PasswordHash = ? WHERE Id = ?',
      [hash, id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

// Resetar MFA de um usuário
router.put('/:id/mfa-reset', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      'UPDATE users SET MFAAtivo = 0, TOTPSecret = NULL WHERE Id = ?',
      [id]
    );
    res.json({ message: 'MFA resetado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao resetar MFA' });
  }
});

export default router;

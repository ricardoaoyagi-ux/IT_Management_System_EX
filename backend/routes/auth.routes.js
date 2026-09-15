import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();
router.use(databaseMiddleware);


router.post('/login', async (req, res) => {
  const { username, senha, captcha } = req.body;

  if (!username || !senha) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  if (!captcha) {
    return res.status(400).json({ message: 'Captcha obrigatório' });
  }

  try {
    // 1️⃣ Validar CAPTCHA
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const captchaResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // chave pública de teste do Google (sempre valida)
        response: captcha
      }
    });

    if (!captchaResponse.data.success) {
      return res.status(401).json({ message: 'Captcha inválido' });
    }

    // 2️⃣ Validar usuário
    const [rows] = await req.db.query(
      `SELECT Id, AnalistaId, Perfil, Username, PasswordHash, MFAAtivo
       FROM users
       WHERE Username = ?`,
      [username.toUpperCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const user = rows[0];

    // 3️⃣ Validar senha
    const senhaValida = await bcrypt.compare(senha, user.PasswordHash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
let mfaRequired = true;
let setupMFA = false;
if (!user.MFAAtivo) {
  // Usuário precisa configurar MFA
  setupMFA = true;
}
    // 4️⃣ Construir objeto completo do usuário
const userPayload = {
  userId: user.Id,
  analistaId: user.AnalistaId,
  perfil: user.Perfil,
  username: user.Username,
  base: req.base,
  mfaRequired,
  setupMFA,
  mfaVerified: false
};

    return res.json(userPayload);

  } catch (error) {
    console.error('🔥 Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
});
export default router;

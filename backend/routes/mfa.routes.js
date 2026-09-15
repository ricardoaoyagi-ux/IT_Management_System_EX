import express from 'express';
import { databaseMiddleware } from '../database.middleware.js'; 
import { authenticator } from '@otplib/preset-default';
import qrcode from 'qrcode';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const router = express.Router(); 
router.use(databaseMiddleware); 

// Simulação de usuário (trocar por JWT depois)
router.use((req, res, next) => {
  req.user = { id: req.body.userId || 1, username: req.body.username || 'demo' };
  next();
});

/**
 * POST /generate-mfa
 */
router.post('/generate-mfa', async (req, res) => {

  const { id, username } = req.user;

  try {
    const secret = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(username, 'MeuSistema', secret);

    const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

    await req.db.query(
      'UPDATE users SET TOTPSecret = ? WHERE Id = ?',
      [secret, id]
    );

    res.json({ qrCodeDataUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar MFA' });
  }
});

/**
 * POST /validate-totp
 */
router.post('/validate-totp', async (req, res) => {
  const { id } = req.user;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Código TOTP obrigatório' });
  }

  try {
    const [rows] = await req.db.query(
      'SELECT TOTPSecret FROM users WHERE Id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const secret = rows[0].TOTPSecret;

    if (!secret) {
      return res.status(400).json({ error: 'MFA não iniciado' });
    }

    authenticator.options = { step: 30, window: 1 };
    const isValid = authenticator.check(code, secret);

    if (!isValid) {
      
      return res.status(400).json({ error: 'Código inválido' });
    }

    await req.db.query(
      'UPDATE users SET MFAAtivo = 1 WHERE Id = ?',
      [id]
    );

    res.json({ message: 'MFA ativado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao validar TOTP' });
  }
});

export default router;
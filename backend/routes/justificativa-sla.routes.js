import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// ------------------------
// GET /justificativa-sla
// Consulta geral dos incidentes
// ------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      `SELECT DISTINCT
         sla.cod_incidente, 
         i.Solucionador,
         sla.data_resolved as data
       FROM justificativa_sla sla
       LEFT JOIN incidente i 
         ON sla.cod_incidente = i.id_incidente
       where obs is null`
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar justificativas SLA' });
  }
});

// ------------------------
// GET /justificativa-sla/meus/:username
// Consulta apenas os incidentes do usuário logado
// ------------------------
router.get('/meus/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await req.db.query(
      `SELECT DISTINCT
         sla.cod_incidente, 
         i.Solucionador,
         sla.data_resolved as data
       FROM justificativa_sla sla
       LEFT JOIN incidente i 
         ON sla.cod_incidente = i.id_incidente
       JOIN analistas a ON a.id_cliente = i.Solucionador
       JOIN users u ON u.AnalistaId = a.Id_analista
       WHERE u.username = ?
       and obs is null`,
      [username]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar justificativas SLA do usuário' });
  }
});


// POST /justificativa-sla/bulk-check
router.post('/bulk-check', async (req, res) => {
  const { itens } = req.body;
  // itens = [{ cod_incidente: 'IM0001', seq: 1 }, ...]

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: 'Nenhum item fornecido' });
  }

  try {
    const conditions = itens
      .map(() => '(cod_incidente = ? AND seq = ?)')
      .join(' OR ');

    const values = itens.flatMap(i => [i.cod_incidente, i.seq]);

    const [rows] = await req.db.query(
      `SELECT cod_incidente, seq
         FROM justificativa_sla
        WHERE ${conditions}`,
      values
    );

    const existing = rows.map(
      r => `${r.cod_incidente}_${r.seq}`
    );

    const novos = itens.filter(
      i => !existing.includes(`${i.cod_incidente}_${i.seq}`)
    );

    res.json({ novos });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao verificar justificativas SLA' });
  }
});

// POST /justificativa-sla
router.post('/', async (req, res) => {
  const {
    cod_incidente,
    seq,
    data_resolved,
    obs, 
    usuario_upd,
    data_upd
  } = req.body;
 

  try {
    await req.db.query(
      `INSERT INTO justificativa_sla
        (cod_incidente, seq, data_resolved, obs, usuario_upd, data_upd)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cod_incidente,
        seq,
        data_resolved,
        obs || null,
        usuario_upd,
        data_upd
      ]
    );

    res.status(201).json({ message: 'Justificativa SLA inserida' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Registro já existe' });
    }

    console.error(err);
    res.status(500).json({ error: 'Erro ao inserir justificativa SLA' });
  }
});


// PUT /justificativa-sla/:cod_incidente/obs
router.put('/:cod_incidente/obs', async (req, res) => {
  const { cod_incidente } = req.params;
  const { obs, motivo_id, usuario_upd } = req.body; // ✅ adicionamos usuario_upd

  if (!obs || !usuario_upd) {
    return res.status(400).json({ error: 'Observação e usuário são obrigatórios' });
  }

  try {
    const [result] = await req.db.query(
      `UPDATE justificativa_sla
         SET obs = ?,
             motivo_id = ?,
             usuario_upd = ?,
             data_upd = NOW()  -- ✅ atualiza a data/hora atual do servidor
       WHERE cod_incidente = ?`,
      [obs, motivo_id, usuario_upd, cod_incidente]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json({ message: 'Justificativa SLA atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar justificativa SLA' });
  }
});



export default router;
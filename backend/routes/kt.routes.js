import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);

// =========================
// GET - Listar KTs
// =========================
router.get('/', async (req, res) => {
  const { status } = req.query;

  // status default
  const statusFiltro = status || 'AGENDADO';

  try {
    const [rows] = await req.db.query(
      `
      SELECT
        cod_kt,
        titulo,
        area_destino,
        data_realizacao,
        status_kt
      FROM kt_controle
      WHERE ativo = 'S'
        AND status_kt = ?
      ORDER BY data_realizacao
      `,
      [statusFiltro]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar KTs' });
  }
});

// Detalhe completo do KT
router.get('/:cod_kt', async (req, res) => {
  const { cod_kt } = req.params;
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM kt_controle WHERE cod_kt = ? AND ativo = "S"',
      [cod_kt]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'KT não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar KT' });
  }
});

// =========================
// POST - Criar KT
// =========================
router.post('/', async (req, res) => {
  const {
    titulo,
    descricao,
    participantes,
    responsavel_kt,
    area_origem,
    area_destino,
    data_envio,
    data_realizacao,
    status_kt = 'AGENDADO',
    aceito = 'N',
    data_aceite,
    observacao_aceite,
    data_inicio_vigencia,
    link_material,
    link_gravacao
  } = req.body;

  try {
    await req.db.query(
      `
      INSERT INTO kt_controle (
        titulo,
        descricao,
        participantes,
        responsavel_kt,
        area_origem,
        area_destino,
        data_envio,
        data_realizacao,
        status_kt,
        aceito,
        data_aceite,
        observacao_aceite,
        data_inicio_vigencia,
        link_material,
        link_gravacao,
        ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'S')
      `,
      [
        titulo,
        descricao,
        participantes,
        responsavel_kt,
        area_origem,
        area_destino,
        formatDateToMySQL(data_envio),
        formatDateToMySQL(data_realizacao),
        status_kt,
        aceito,
        formatDateToMySQL(data_aceite),
        observacao_aceite,
        formatDateToMySQL(data_inicio_vigencia),
        link_material,
        link_gravacao
      ]
    );

    res.status(201).json({ message: 'KT criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar KT' });
  }
});



// =========================
// PUT - Atualizar KT
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const {
    titulo,
    descricao,
    participantes,
    responsavel_kt,
    area_origem,
    area_destino,
    data_envio,
    data_realizacao,
    status_kt,
    aceito,
    observacao_aceite,
    link_material,
    link_gravacao,
    data_aceite,
    data_inicio_vigencia
  } = req.body;

  try {
    // 🔎 Busca estado atual
    const [[atual]] = await req.db.query(
      'SELECT aceito FROM kt_controle WHERE cod_kt = ?',
      [id]
    );
 
    await req.db.query(
      `
      UPDATE kt_controle SET
        titulo = ?,
        descricao = ?,
        participantes = ?,
        responsavel_kt = ?,
        area_origem = ?,
        area_destino = ?,
        data_envio = ?,
        data_realizacao = ?,
        status_kt = ?,
        aceito = ?,
        observacao_aceite = ?,
        link_material = ?,
        link_gravacao = ?,
        data_aceite = COALESCE(data_aceite, ?),
        data_inicio_vigencia = COALESCE(data_inicio_vigencia, ?),
        data_atualizacao = NOW()
      WHERE cod_kt = ?
      `,
      [
        titulo,
        descricao,
        participantes,
        responsavel_kt,
        area_origem,
        area_destino,
    formatDateToMySQL(data_envio),
    formatDateToMySQL(data_realizacao),
        status_kt,
        aceito,
        observacao_aceite,
        link_material,
        link_gravacao,
    formatDateToMySQL(data_aceite),
    formatDateToMySQL(data_inicio_vigencia),
        id
      ]
    );

    res.json({ message: 'KT atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar KT' });
  }
});

function formatDateToMySQL(date) {
  if (!date) return null;
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// =========================
// DELETE - Soft delete KT
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      `
      UPDATE kt_controle
      SET ativo = 'N', data_atualizacao = NOW()
      WHERE cod_kt = ?
      `,
      [id]
    );

    res.json({ message: 'KT removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover KT' });
  }
});

export default router;

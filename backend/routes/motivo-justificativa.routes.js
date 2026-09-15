import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
/**
 * GET
 * Lista todos os motivos
 * Opcional: ?tipo=SLA | REABERTURA
 */
router.get('/', async (req, res) => {
  const { tipo } = req.query;

  try {
    let sql = `
      SELECT
        cod_motivo,
        descricao,
        abono,
        tipo_motivo,
        ativo
      FROM motivo_justificativa 
    `;

    const params = [];

    if (tipo) {
      sql += ` WHERE tipo_motivo = ? AND ativo = 'S' `;
      params.push(tipo);
    }

    sql += ' ORDER BY cod_motivo';

    const [rows] = await req.db.query(sql, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar motivos de justificativa' });
  }
});

/**
 * POST
 */
router.post('/', async (req, res) => {
  const { descricao, abono, tipo_motivo, ativo } = req.body;

  try {
    await req.db.query(
      `
      INSERT INTO motivo_justificativa
        (descricao, abono, tipo_motivo, ativo)
      VALUES (?, ?, ?, ?)
      `,
      [
        descricao,
        abono,
        tipo_motivo,
        ativo ?? 'S'
      ]
    );

    res.status(201).json({ message: 'Motivo criado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar motivo' });
  }
});

/**
 * PUT
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, abono, tipo_motivo, ativo } = req.body;

  try {
    await req.db.query(
      `
      UPDATE motivo_justificativa
      SET
        descricao = ?,
        abono = ?,
        tipo_motivo = ?,
        ativo = ?,
        data_atualizacao = NOW()
      WHERE cod_motivo = ?
      `,
      [
        descricao,
        abono,
        tipo_motivo,
        ativo,
        id
      ]
    );

    res.json({ message: 'Motivo atualizado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar motivo' });
  }
});

/**
 * DELETE
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      'DELETE FROM motivo_justificativa WHERE cod_motivo = ?',
      [id]
    );

    res.json({ message: 'Motivo deletado com sucesso' });

  } catch (err) {
    console.error(err);

    // FK em uso (ex: justificativa_sla)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Motivo não pode ser excluído pois está em uso'
      });
    }

    res.status(500).json({ error: 'Erro ao deletar motivo' });
  }
});

export default router;

import express from 'express';
import crypto from 'crypto';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

router.use(databaseMiddleware);

// 🔐 gerar hash baseado no conteúdo
function gerarHash(rows) {
  const json = JSON.stringify(rows);
  return crypto.createHash('sha256').update(json).digest('hex');
}

// POST - importação de horas
router.post('/import', async (req, res) => {
  const { rows, fileName } = req.body;

  if (!rows || !Array.isArray(rows)) {
    return res.status(400).json({ error: 'Rows inválidos' });
  }

  const db = req.db;

  try {
    const hash = gerarHash(rows);

    // 🔥 remove dados antigos do mesmo arquivo
    await db.query(
      `DELETE FROM horas_import WHERE hash_arquivo = ?`,
      [hash]
    );

    let linha = 2; // começa na linha 2 (header = 1)

    for (const row of rows) {

      await db.query(`
        INSERT INTO horas_import (
          nome_arquivo,
          hash_arquivo,
          linha_arquivo,

          email_usuario,
          responsavel,

          data_trabalho,
          hora_inicio,
          hora_fim,

          pausa_minutos,
          observacoes,
          tipo_registro,

          horas_trabalhadas,
          horas_guardia,
          tipo_dia,
          percentual,

          status_validacao,
          data_validacao,
          ano_mes,

          raw_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        fileName,
        hash,
        linha,

        row['Dirección de correo electrónico'] || null,
        row['Indique o responsável'] || null,

        normalizarData(row['Data']),
        normalizarDataHora(row['Hora de início']),
        normalizarDataHora(row['Hora de saída']),

        row['Pausa (em minutos)'] || 0,
        row['Observações'] || null,
        row['Tipo de registro'] || null,

        row['Horas Trabajadas'] || null,
        row['Horas Trabajadas Guardia'] || null,
        row['Tipo de Día'] || null,
        row['% de Recargo Sindpd-SP'] || null,

        row['Validación'] || null,
        normalizarDataHora(row['Fecha de validación']),
        row['ANO-MES'] || null,

        JSON.stringify(row)
      ]);

      linha++;
    }

    res.json({
      success: true,
      total: rows.length,
      message: 'Importação realizada com sucesso'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao importar horas' });
  }
});

export default router;
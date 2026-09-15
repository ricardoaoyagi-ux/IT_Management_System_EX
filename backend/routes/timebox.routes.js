import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();
router.use(databaseMiddleware);

// =========================
// CONTRATO
// =========================

// GET todos contratos com projetos e membros 
router.get('/contratos', async (req, res) => {
  try {
    const [contratos] = await req.db.query(
      `SELECT * FROM timebox_contrato ORDER BY Id ASC`
    );

    for (const c of contratos) {
      const [projetos] = await req.db.query(
        `SELECT * FROM timebox_projeto WHERE TimeboxContratoId = ?`,
        [c.Id]
      );

      for (const p of projetos) {
        const [participacoes] = await req.db.query(
          `
 SELECT 
    p.Id,
    p.TimeboxProjetoId,
    p.UserId,
    p.Papel,
    p.DataInicio,
    p.DataFim,
    p.HorasPorDia,
    a.Nom_Analista AS Nome
  FROM timebox_projeto_participacao p
  JOIN analistas a ON a.Id_Analista = p.UserId
  WHERE p.TimeboxProjetoId = ?
          `,
          [p.Id]
        );

p.Membros = participacoes; // pode manter o nome temporariamente
      }

      c.Projetos = projetos;
    }

    res.json(contratos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar contratos' });
  }
});

// POST criar contrato
router.post('/contratos', async (req, res) => {
  const { Descricao, HorasContratadas, DataInicio, DataFim } = req.body;
  try {
    const [result] = await req.db.query(
      'INSERT INTO timebox_contrato (ClienteId, Descricao, HorasContratadas, HorasConsumidas, DataInicio, DataFim) VALUES (1, ?, ?, 0, ?, ?)',
      [Descricao, HorasContratadas, DataInicio || null, DataFim || null]
    );
    res.status(201).json({ Id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar contrato' });
  }
});

// PUT atualizar contrato
router.put('/contratos/:id', async (req, res) => {
  const { id } = req.params;
  const { Descricao, HorasContratadas, DataInicio, DataFim } = req.body;
  try {
    await req.db.query(
      'UPDATE timebox_contrato SET Descricao = ?, HorasContratadas = ?, DataInicio = ?, DataFim = ? WHERE Id = ?',
      [Descricao, HorasContratadas, DataInicio || null, DataFim || null, id]
    );
    res.json({ message: 'Contrato atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar contrato' });
  }
});

// DELETE contrato
router.delete('/contratos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // deletar projetos e membros do contrato antes
    const [projetos] = await req.db.query('SELECT Id FROM timebox_projeto WHERE TimeboxContratoId = ?', [id]);
    for (const p of projetos) {
      await req.db.query('DELETE FROM timebox_projeto_membro WHERE TimeboxProjetoId = ?', [p.Id]);
    }
    await req.db.query('DELETE FROM timebox_projeto WHERE TimeboxContratoId = ?', [id]);
    await req.db.query('DELETE FROM timebox_contrato WHERE Id = ?', [id]);

    res.json({ message: 'Contrato deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar contrato' });
  }
});

// =========================
// PROJETO
// =========================

// POST criar projeto
router.post('/projetos', async (req, res) => {
  const { TimeboxContratoId, 
    Nome, 
    Descricao, 
    HorasPrevistas, 
    DataInicio, 
    DataPrevisaoFim,
    DataFimReal,
    Status

} = req.body;
  try {
    const [result] = await req.db.query(
      `INSERT INTO timebox_projeto (TimeboxContratoId, Nome, Descricao, 
      HorasPrevistas, HorasConsumidas, DataInicio, DataPrevisaoFim,
      DataFimReal, Status)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [TimeboxContratoId, Nome, Descricao, HorasPrevistas, 
        DataInicio || null, DataPrevisaoFim || null, DataFimReal , Status]
    );
    res.status(201).json({ Id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

// PUT atualizar projeto
router.put('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const { Nome, Descricao, HorasPrevistas, DataInicio, DataPrevisaoFim,
    DataFimReal,
    Status } = req.body;
  try {
    await req.db.query(
      `UPDATE timebox_projeto 
      SET Nome=?, Descricao=?, HorasPrevistas=?, 
      DataInicio=?, DataPrevisaoFim=? ,
      DataFimReal=?, Status=? 
      WHERE Id=?`,
      [Nome, Descricao, HorasPrevistas, 
        DataInicio || null, DataPrevisaoFim || null, DataFimReal , Status, id]
    );
    res.json({ message: 'Projeto atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

// DELETE projeto
router.delete('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM timebox_projeto_membro WHERE TimeboxProjetoId = ?', [id]);
    await req.db.query('DELETE FROM timebox_projeto WHERE Id = ?', [id]);
    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar projeto' });
  }
});

// =========================
// MEMBRO
// =========================
 
// POST criar membro
router.post('/membros', async (req, res) => {
const {
  TimeboxProjetoId,
  UserId,
  Papel,
  DataInicio,
  DataFim,
  HorasPorDia
} = req.body;

if (new Date(DataFim) < new Date(DataInicio)) {
  return res.status(400).json({
    error: 'DataFim não pode ser menor que DataInicio'
  });
}

  try {
await req.db.query(
  `
  INSERT INTO timebox_projeto_participacao
  (TimeboxProjetoId, UserId, Papel, DataInicio, DataFim, HorasPorDia)
  VALUES (?, ?, ?, ?, ?, ?)
  `,
  [
    TimeboxProjetoId,
    UserId,
    Papel || null,
    DataInicio,
    DataFim,
    HorasPorDia
  ]
);

    res.status(201).json({ message: 'Membro vinculado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao vincular membro' });
  }
});

// PUT atualizar membro
router.put('/membros/:id', async (req, res) => {
  const { id } = req.params;
 const {
  UserId,
  Papel,
  DataInicio,
  DataFim,
  HorasPorDia
} = req.body;

  try {

await req.db.query(
  `
  UPDATE timebox_projeto_participacao
  SET
    UserId = ?,
    Papel = ?,
    DataInicio = ?,
    DataFim = ?,
    HorasPorDia = ?
  WHERE Id = ?
  `,
  [
    UserId,
    Papel || null,
    DataInicio,
    DataFim,
    HorasPorDia,
    id
  ]
);

    res.json({ message: 'Membro atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});

// DELETE membro
router.delete('/membros/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query(
      'DELETE FROM timebox_projeto_participacao WHERE Id = ?',
      [id]
    );

    res.json({ message: 'Membro removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar membro' });
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

export default router;

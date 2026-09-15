import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET: listar todos os problems
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        Id, Cod_Problem, Nom_Problem, Desc_Problem,
        DATE(Dt_Abertura) AS Dt_Abertura,
        DATE(Dt_Encerramento) AS Dt_Encerramento,
        Status, Tip_Problem, PM_CLIENTE,
        Analista_Cadastro, Analista_Responsavel
      FROM problems
    `);

    // Retorna as datas como string YYYY-MM-DD
    const converted = rows.map(r => ({
      ...r,
      Dt_Abertura: r.Dt_Abertura ? r.Dt_Abertura.toISOString().slice(0, 10) : null,
      Dt_Encerramento: r.Dt_Encerramento ? r.Dt_Encerramento.toISOString().slice(0, 10) : null
    }));

    res.json(converted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar problems' });
  }
});

// POST: criar problem
router.post('/', async (req, res) => {
  const {
    Nom_Problem,
    Desc_Problem,
    Dt_Encerramento,
    Tip_Problem,
    PM_CLIENTE,
    Analista_Cadastro,
    Analista_Responsavel
  } = req.body;

  try {
    // 1️⃣ Buscar o próximo Cod_Problem
    const [rows] = await req.db.query(
      'SELECT IFNULL(MAX(Cod_Problem), 0) + 1 AS nextCod FROM problems'
    );

    const nextCodProblem = rows[0].nextCod;
    const Dt_Abertura = new Date(); // data atual
    const Status = 1;

    // 2️⃣ Inserir
    await req.db.query(
      `INSERT INTO problems
        (Cod_Problem, Nom_Problem, Desc_Problem, Dt_Abertura, Dt_Encerramento, Status, Tip_Problem, PM_CLIENTE, Analista_Cadastro, Analista_Responsavel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextCodProblem,
        Nom_Problem,
        Desc_Problem,
        Dt_Abertura ,
        Dt_Encerramento || null,
        Status,
        Tip_Problem,
        PM_CLIENTE || null,
        Analista_Cadastro || null,
        Analista_Responsavel || null
      ]
    );

    // 3️⃣ Retornar o código criado
    res.status(201).json({
      message: 'Problem criado com sucesso',
      Cod_Problem: nextCodProblem
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar problem' });
  }
});

// PUT: atualizar problem pelo Id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    Cod_Problem, Nom_Problem, Desc_Problem,
    Dt_Abertura, Dt_Encerramento,
    Status, Tip_Problem, PM_CLIENTE,
    Analista_Cadastro, Analista_Responsavel
  } = req.body;

  try {
    await req.db.query(
      `UPDATE problems SET
       Nom_Problem = ?, Desc_Problem = ?,
        Dt_Abertura = ?, Dt_Encerramento = ?,
        Status = ?, Tip_Problem = ?, PM_CLIENTE = ?, Analista_Cadastro = ?, Analista_Responsavel = ?
       WHERE Id = ?`,
      [
        
        Nom_Problem,
        Desc_Problem,
        Dt_Abertura || null,
        Dt_Encerramento || null,
        Status,
        Tip_Problem,
        PM_CLIENTE || null,
        Analista_Cadastro || null,
        Analista_Responsavel || null,
        id
      ]
    );

    res.json({ message: 'Problem atualizado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar problem' });
  }
});

// DELETE: deletar problem pelo Id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await req.db.query('DELETE FROM problems WHERE Id = ?', [id]);
    res.json({ message: 'Problem deletado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar problem' });
  }
});


// GET /problems/busca?query=xxxx
router.get('/busca', async (req, res) => {
  const query = req.query.query || '';
  try {
    const [rows] = await req.db.query(`
      SELECT
        Id, Cod_Problem, Nom_Problem, Desc_Problem,
        DATE_FORMAT(Dt_Abertura, '%Y-%m-%d') AS Dt_Abertura,
        DATE_FORMAT(Dt_Encerramento, '%Y-%m-%d') AS Dt_Encerramento,
        Status, Tip_Problem, PM_CLIENTE,
        Analista_Cadastro, Analista_Responsavel
      FROM problems
      WHERE Nom_Problem LIKE ?
      LIMIT 1000
    `, [`%${query}%`]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar Problem' });
  }
});

export default router;

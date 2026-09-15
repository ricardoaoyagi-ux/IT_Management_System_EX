import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET (datas truncadas)
router.get('/', async (req, res) => {
    try {
      const [rows] = await req.db.query(`
        SELECT 
          Id,
          Cod_RCA,
          Cod_Problem,
          Desc_RCA,
          DATE_FORMAT(Dt_Inicio, '%Y-%m-%d') AS Dt_Inicio,
          DATE_FORMAT(Dt_Conclusao, '%Y-%m-%d') AS Dt_Conclusao,
          Tot_Hors_dev,
          Tot_Hors_orc
        FROM rca
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar RCA' });
    }
  });
  

// POST
router.post('/', async (req, res) => {
  const {
    Cod_Problem,
    Desc_RCA,
    Dt_Inicio,
    Dt_Conclusao,
    Tot_Hors_dev,
    Tot_Hors_orc
  } = req.body;

  try {
    // 1️⃣ Buscar o próximo Cod_RCA
    const [rows] = await req.db.query(
      'SELECT IFNULL(MAX(Cod_RCA), 0) + 1 AS nextCod FROM rca'
    );

    const nextCodRCA = rows[0].nextCod;

    // 2️⃣ Inserir
    await req.db.query(
      `INSERT INTO rca
      (Cod_RCA, Cod_Problem, Desc_RCA, Dt_Inicio, Dt_Conclusao, Tot_Hors_dev, Tot_Hors_orc)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nextCodRCA,
        Cod_Problem,
        Desc_RCA,
        Dt_Inicio,
        Dt_Conclusao,
        Tot_Hors_dev,
        Tot_Hors_orc
      ]
    );

    // 3️⃣ Retornar o código criado
    res.status(201).json({
      message: 'RCA criado com sucesso',
      Cod_RCA: nextCodRCA
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar RCA' });
  }
});


// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    Cod_Problem,
    Desc_RCA,
    Dt_Inicio,
    Dt_Conclusao,
    Tot_Hors_dev,
    Tot_Hors_orc
  } = req.body;
  if ('Cod_RCA' in req.body) {
    return res.status(400).json({
      error: 'Cod_RCA não pode ser alterado'
    });
  }

  try {
    await req.db.query(
      `UPDATE rca SET
        Cod_Problem = ?,
        Desc_RCA = ?,
        Dt_Inicio = ?,
        Dt_Conclusao = ?,
        Tot_Hors_dev = ?,
        Tot_Hors_orc = ?
      WHERE Id = ?`,
      [
        Cod_Problem,
        Desc_RCA,
        Dt_Inicio,
        Dt_Conclusao,
        Tot_Hors_dev,
        Tot_Hors_orc,
        id
      ]
    );
    res.json({ message: 'RCA atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar RCA' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM rca WHERE Id = ?', [id]);
    res.json({ message: 'RCA deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar RCA' });
  }
});

// GET /rca/busca?query=xxxx
router.get('/busca', async (req, res) => {
  const query = req.query.query || '';
  try {
    const [rows] = await req.db.query(`
      SELECT 
        Id,
        Cod_RCA,
        Cod_Problem,
        Desc_RCA,
        DATE_FORMAT(Dt_Inicio, '%Y-%m-%d') AS Dt_Inicio,
        DATE_FORMAT(Dt_Conclusao, '%Y-%m-%d') AS Dt_Conclusao,
        Tot_Hors_dev,
        Tot_Hors_orc
      FROM rca
      WHERE Desc_RCA LIKE ?
      LIMIT 1000
    `, [`%${query}%`]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar RCA' });
  }
});

export default router;

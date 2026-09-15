import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// Função auxiliar para mapear Pendente e datas
function mapFerias(rows) {
  return rows.map(f => ({
    ...f,
    Pendente: f.Pendente && f.Pendente[0] === 1 ? true : false, // BIT(1) -> boolean
    Dt_Inicio: f.Dt_Inicio ? f.Dt_Inicio.toISOString().slice(0,10) : null,
    Dt_Fim: f.Dt_Fim ? f.Dt_Fim.toISOString().slice(0,10) : null
  }));
}

// GET - lista todas as férias
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT 
        Id, Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, 
        Pendente, Sequencia, Nota,
        Usr_Cadastro, Dt_Cadastro
      FROM ferias 
      WHERE Pendente = 1
    `);
    res.json(mapFerias(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar férias' });
  }
});


// POST - criar férias
router.post('/', async (req, res) => {
  const { Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, Pendente, Sequencia, Nota, Usr_Cadastro, Dt_Cadastro } = req.body;
  try {
    const pendenteValue = Pendente ? 1 : 0;

    await req.db.query(
      `INSERT INTO ferias 
       (Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, Pendente, Sequencia, Nota, Usr_Cadastro, Dt_Cadastro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, pendenteValue, Sequencia, Nota, Usr_Cadastro, Dt_Cadastro]
    );

    res.status(201).json({ message: 'Férias cadastradas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar férias' });
  }
});



// PUT - atualizar férias
router.put('/:id', async (req, res) => {
  const { Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, Pendente, Sequencia, Nota, Usr_Cadastro, Dt_Cadastro } = req.body;
  const { id } = req.params;
  try {
    const pendenteValue = Pendente ? 1 : 0;

    await req.db.query(
      `UPDATE ferias SET 
       Matricula=?, Nom_Analista=?, Aquisitivo=?, Dt_Inicio=?, Dt_Fim=?, 
       Pendente=?, Sequencia=?, Nota=?,
       Usr_Cadastro=?, Dt_Cadastro=?
       WHERE Id=?`,
      [Matricula, Nom_Analista, Aquisitivo, Dt_Inicio, Dt_Fim, pendenteValue, Sequencia, Nota, Usr_Cadastro, Dt_Cadastro, id]
    );

    res.json({ message: 'Férias atualizadas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar férias' });
  }
});



// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM ferias WHERE Id=?', [id]);
    res.json({ message: 'Férias deletadas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar férias' });
  }
});

// GET /buscar - busca dinâmica
router.get('/buscar', async (req, res) => {
  try {
    const { Nom_Analista, Dt_Inicio, Pendente } = req.query;

    let sql = 'SELECT * FROM ferias WHERE 1=1 ';
    const params = [];

    if (Nom_Analista) {
      sql += ' AND Nom_Analista LIKE ?';
      params.push(`%${Nom_Analista}%`);
    }

    if (Dt_Inicio) {
      sql += ' AND DATE(Dt_Inicio) >= ?';
      params.push(Dt_Inicio);
    }

    if (Pendente === 'true') {
      sql += ' AND Pendente = 1';
    } else if (Pendente === 'false') {
      sql += ' AND Pendente = 0';
    }

    const [rows] = await req.db.query(sql, params);

    res.json(mapFerias(rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar férias.' });
  }
});

// GET /analistas/matricula/:matricula
router.get('/matricula/:matricula', async (req, res) => {
  const { matricula } = req.params;

  try {
    const [rows] = await req.db.query(
      `
      SELECT Nom_Analista
      FROM analistas
      WHERE Matricula = ?
      LIMIT 1
      `,
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Analista não encontrado' });
    }

    res.json({
      Nom_Analista: rows[0].Nom_Analista
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar analista' });
  }
});

// GET - lista todos os nomes de analistas distintos
router.get('/analistas', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT DISTINCT Nom_Analista
      FROM ferias
      ORDER BY Nom_Analista
    `);
    const nomes = rows.map(r => r.Nom_Analista);
    res.json(nomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar analistas' });
  }
});


export default router;

import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT Id, Id_Incidente, Sistema, Modulo, Tip_Solicitacao,
             Cod_Classificacao1, Cod_Classificacao2, Cod_Classificacao3,
             Desc_Incidente, Desc_Resolucao,
             DATE(Dt_Resolucao) AS Dt_Resolucao,
             DATE(Dt_Abertura) AS Dt_Abertura,
             DATE(Dt_Carga) AS Dt_Carga,
             Solucionador, RCA, Cod_RCA, St
      FROM incidente
     WHERE st = 0
    `);
    const converted = rows.map(r => {
        let rcaBoolean = false;
        if (r.RCA instanceof Buffer) {
          rcaBoolean = r.RCA[0] === 1; // pega o byte correto
        }
      
        return {
          ...r,
          RCA: rcaBoolean,
          Dt_Abertura: r.Dt_Abertura ? r.Dt_Abertura.toISOString().slice(0, 10) : null,
          Dt_Resolucao: r.Dt_Resolucao ? r.Dt_Resolucao.toISOString().slice(0, 10) : null,
          Dt_Carga: r.Dt_Carga ? r.Dt_Carga.toISOString().slice(0, 10) : null
        };
      });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar incidentes' });
  }
});

// POST
router.post('/', async (req, res) => {
  const {
    Id_Incidente, Sistema, Modulo, Tip_Solicitacao,
    Cod_Classificacao1, Cod_Classificacao2, Cod_Classificacao3,
    Desc_Incidente, Desc_Resolucao, Dt_Resolucao, Dt_Abertura, Dt_Carga,
    Solucionador, RCA, Cod_RCA, St
  } = req.body;

  try {
    const RCAvalue = RCA ? 1 : 0;

    await req.db.query(
      `INSERT INTO incidente (
        Id_Incidente, Sistema, Modulo, Tip_Solicitacao,
        Cod_Classificacao1, Cod_Classificacao2, Cod_Classificacao3,
        Desc_Incidente, Desc_Resolucao, Dt_Resolucao, Dt_Abertura, Dt_Carga,
        Solucionador, RCA, Cod_RCA, St
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Id_Incidente,
        Sistema,
        Modulo,
        Tip_Solicitacao,
        Cod_Classificacao1,
        Cod_Classificacao2,
        Cod_Classificacao3,
        Desc_Incidente,
        Desc_Resolucao,
        Dt_Resolucao,
        Dt_Abertura,
        Dt_Carga,
        Solucionador,
        RCAvalue,  // ✅ aqui
        Cod_RCA,
        St
      ]
    );
    
    res.status(201).json({ message: 'Incidente criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar incidente' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const {
    Sistema,
    Modulo,
    Tip_Solicitacao,
    Cod_Classificacao1,
    Cod_Classificacao2,
    Cod_Classificacao3,
    Desc_Incidente,
    Desc_Resolucao,
    Dt_Resolucao,
    Dt_Abertura,
    Dt_Carga,
    Solucionador,
    RCA,
    Cod_RCA,
    St
  } = req.body;

  try {
    const RCAvalue = RCA ? 1 : 0;
    const St = 1;

    await req.db.query(
      `UPDATE incidente SET
        Sistema = ?,
        Modulo = ?,
        Tip_Solicitacao = ?,
        Cod_Classificacao1 = ?,
        Cod_Classificacao2 = ?,
        Cod_Classificacao3 = ?,
        Desc_Incidente = ?,
        Desc_Resolucao = ?,
        Dt_Resolucao = ?,
        Dt_Abertura = ?,
        Dt_Carga = ?,
        Solucionador = ?,
        RCA = ?,
        Cod_RCA = ?,
        St = ?
       WHERE Id_Incidente = ?`,
      [
        Sistema,
        Modulo,
        Tip_Solicitacao,
        Cod_Classificacao1,
        Cod_Classificacao2,
        Cod_Classificacao3,
        Desc_Incidente,
        Desc_Resolucao,
        Dt_Resolucao,
        Dt_Abertura,
        Dt_Carga,
        Solucionador,
        RCAvalue,
        Cod_RCA,
        St,
        id   // ✅ AQUI está o identificador correto
      ]
    );

    res.json({ message: 'Incidente atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar incidente' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM incidente WHERE Id=?', [id]);
    res.json({ message: 'Incidente deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar incidente' });
  }
});

//antes
// router.get('/:id', async (req, res) => {
//  const { id } = req.params;
//  const [rows] = await req.db.query(
//    'SELECT * FROM incidente WHERE Id_Incidente = ?',
//    [id]
//  );
//  res.json(rows[0]);
//});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows]   = await req.db.query(
      `SELECT 
        Id,
        Id_Incidente,
        Sistema,
        Modulo,
        Tip_Solicitacao,
        Cod_Classificacao1,
        Cod_Classificacao2,
        Cod_Classificacao3,
        Desc_Incidente,
        Desc_Resolucao,
        DATE(Dt_Resolucao) AS Dt_Resolucao,
        DATE(Dt_Abertura) AS Dt_Abertura,
        DATE(Dt_Carga) AS Dt_Carga,
        Solucionador,
        IF(RCA=1, TRUE, FALSE) AS RCA,  -- ✅ aqui convertemos BIT(1) para boolean
        Cod_RCA,
        St  
       FROM incidente WHERE Id_Incidente = ? 
      `,
      [id]
    );

    if (rows.length > 0) {
      const incidente = rows[0];

      // Converter BIT(1) para boolean
      if (incidente.RCA instanceof Buffer) {
        incidente.RCA = incidente.RCA[0] === 1;
      }

      // Datas
      incidente.Dt_Abertura = incidente.Dt_Abertura?.toISOString().slice(0,10);
      incidente.Dt_Resolucao = incidente.Dt_Resolucao?.toISOString().slice(0,10);
      incidente.Dt_Carga = incidente.Dt_Carga?.toISOString().slice(0,10);

      res.json(incidente);
    } else {
      res.status(404).json({ error: 'Incidente não encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar incidente' });
  }
});

// POST /incidente/bulk-check
router.post('/bulk-check', async (req, res) => {
  const { ids } = req.body; // ids = ["IM04992059", "IM05045941", ...]

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Nenhum ID fornecido' });
  }

  try {
    // Seleciona os IDs que já existem
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await req.db.query(
      `SELECT Id_Incidente FROM incidente WHERE Id_Incidente IN (${placeholders})`,
      ids
    );

    const existingIds = rows.map(row => row.Id_Incidente);
    // Retorna apenas os IDs que NÃO existem
    const newIds = ids.filter(id => !existingIds.includes(id));

    res.json({ newIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao verificar IDs' });
  }
});

router.get('/meus/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const [rows] = await req.db.query(`
      SELECT i.Id_Incidente, 
             i.Cod_Classificacao1, 
             i.Dt_Resolucao, 
             i.Solucionador
      FROM users u
      JOIN analistas a ON u.AnalistaId = a.Id_analista
      JOIN incidente i ON a.id_cliente = i.Solucionador
      WHERE u.username = ?
        AND i.st = 0
    `, [username]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar incidentes do usuário' });
  }
});

export default router;

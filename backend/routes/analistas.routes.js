import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET 
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT
        a.Id_Analista,
        a.Matricula,
        a.Nom_Analista,
        a.Lider_Gerente,

        a.NOM_USUARIO_SIG,
        a.CID_RESIDENCIA,
        a.UF_RESIDENCIA,

        a.Id_Fornecedor,
        a.Id_Cliente,
        a.Alocacao,
        al.Desc_alocacao AS AlocacaoDesc,
        a.Senioridade,
        s.ID_Senioridade AS SenioridadeCod,
        s.Cat AS SenioridadeCat,
        s.Categoria AS SenioridadeCatDesc,

        DATE_FORMAT(a.Dt_Inicio, '%Y-%m-%d') AS Dt_Inicio,
        DATE_FORMAT(a.Dt_Fim, '%Y-%m-%d') AS Dt_Fim
      FROM analistas a
      LEFT JOIN alocacao al
        ON al.Cod_alocacao = a.Alocacao
      LEFT JOIN Senioridade s
        ON s.ID_Senioridade = a.Senioridade
      ORDER BY a.Id_Analista DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar analistas' });
  }
});

  
  
  // comentado, o POST não será mais publico, insert será via trigger.
  //router.post('/', async (req, res) => {
  //  const { Dt_Inicio, Dt_Fim, ...rest } = req.body;
  //
  //  try {
  //    await req.db.query(
  //      `INSERT INTO analistas (Matricula, Nom_Analista, Id_Fornecedor, Id_Cliente, Alocacao, Senioridade, Rate, Dt_Inicio, Dt_Fim)
  //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //      [
  //        rest.Matricula,
  //        rest.Nom_Analista,
  //        rest.Id_Fornecedor,
  //        rest.Id_Cliente,
  //        rest.Alocacao,
  //        rest.Senioridade,
  //        rest.Rate,
  //        Dt_Inicio, // YYYY-MM-DD
  //        Dt_Fim || null
  //      ]
  //    );
  //    res.status(201).json({ message: 'Analista criado com sucesso' });
  //  } catch (err) {
  //    console.error(err);
  //    res.status(500).json({ error: 'Erro ao criar analista' });
  //  }
  //});
  
 // PUT
 router.put('/:id', async (req, res) => {
  const {
    Dt_Inicio,
    Dt_Fim,
    Dt_Atualizacao,
    Id_Atualizacao,

    NOM_USUARIO_SIG,
    CID_RESIDENCIA,
    UF_RESIDENCIA,
    Lider_Gerente, // 👈 NOVO

    ...rest
  } = req.body;

  const { id } = req.params;

  try {
    await req.db.query(
      `
      UPDATE analistas
      SET
        Matricula = ?,
        Nom_Analista = ?,
        Lider_Gerente = ?,

        NOM_USUARIO_SIG = ?,
        CID_RESIDENCIA = ?,
        UF_RESIDENCIA = ?,

        Id_Fornecedor = ?,
        Id_Cliente = ?,
        Alocacao = ?,
        Senioridade = ?,
        Rate = 0,
        Dt_Inicio = ?,
        Dt_Fim = ?,
        Dt_Atualizacao = ?,
        Id_Atualizacao = ?
      WHERE Id_Analista = ?
      `,
      [
        rest.Matricula,
        rest.Nom_Analista,
        Lider_Gerente,

        NOM_USUARIO_SIG,
        CID_RESIDENCIA,
        UF_RESIDENCIA,

        rest.Id_Fornecedor,
        rest.Id_Cliente,
        rest.Alocacao,
        rest.Senioridade,
        Dt_Inicio,
        Dt_Fim || null,
        Dt_Atualizacao,
        Id_Atualizacao,
        id
      ]
    );

    res.json({ message: 'Analista atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar analista' });
  }
});


  

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query('DELETE FROM analistas WHERE Id_Analista=?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Analista não encontrado' });
    }
    res.json({ message: 'Analista deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar analista' });
  }
});

// =========================
// ANALISTAS (dropdown)
// =========================
router.get('/dropdown', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT 
        Id_Analista,
        Nom_Analista
      FROM analistas
      WHERE Matricula IS NOT NULL
      ORDER BY Nom_Analista
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar analistas' });
  }
});

export default router;

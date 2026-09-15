import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET
router.get('/', async (req, res) => {
    try {
      const [rows] = await req.db.query(`
        SELECT s.*,
      ROUND(  
      (COALESCE(s.SistemaA,0) +
      COALESCE(s.SistemaA_Cadastro,0) +
      COALESCE(s.SistemaA_Cadenas,0) +
      COALESCE(s.SistemaA_Cobranca,0) +
      COALESCE(s.SistemaA_Comissao,0) +
      COALESCE(s.SistemaA_Contabil,0) +
      COALESCE(s.SistemaA_Cosseguro,0) +
      COALESCE(s.SistemaA_Emissao,0) +
      COALESCE(s.SistemaA_Sinistro,0) +
      COALESCE(s.SistemaA_SSR,0)
     +
      COALESCE(s.SistemaB,0) +
      COALESCE(s.SistemaC,0) +
      COALESCE(s.SistemaE,0) +
      COALESCE(s.SistemaF,0) +
      COALESCE(s.\`BI-Cognos\`,0)
     +
      COALESCE(s.SistemaD_Auto,0) +
      COALESCE(s.SistemaD_Auto_Front,0) +
      COALESCE(s.SistemaD_Residencial,0) +
      COALESCE(s.SistemaD_Residencial_Front,0) +
      COALESCE(s.SistemaD_Vida,0) +
      COALESCE(s.SistemaD_Vida_Front,0)
     +
      COALESCE(s.\`SistemaG\`,0) +
      COALESCE(s.SistemaH,0) +
      COALESCE(s.Crm_salesforce,0)
      +
      COALESCE(s.\`PL-SQL\`,0) +
      COALESCE(s.Webmethods,0) +
      COALESCE(s.Java,0) +
      COALESCE(s.\`Java - API\`,0) +
      COALESCE(s.Angular,0) +
      COALESCE(s.DataStage,0) +
      COALESCE(s.PowerCenter,0) +
      COALESCE(s.Cognos,0) +
      COALESCE(s.Forms,0)
    +
    COALESCE(s.Gestao,0) 
    ) /34 , 2 ) as media FROM skills s  ORDER BY id desc
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar skills' });
    }
  });
  

// POST
router.post('/', async (req, res) => {
    const s = req.body;
  
    try {
      await req.db.query(`
        INSERT INTO skills (
          Matricula, Nom_Analista, SistemaA, SistemaA_Cadastro, SistemaA_Sinistro, SistemaA_Cobranca,
          SistemaA_Emissao, SistemaA_Comissao, SistemaA_Contabil, SistemaA_Cosseguro, SistemaA_Cadenas, SistemaA_SSR,
          SistemaB, SistemaC, SistemaD_Auto, SistemaD_Auto_Front, SistemaD_Vida, SistemaD_Vida_Front,
          SistemaD_Residencial, SistemaD_Residencial_Front, SistemaE, SistemaF, \`BI-Cognos\`,
          \`SistemaG\`, SistemaH, Crm_salesforce, \`PL-SQL\`, Webmethods,
          Java, \`Java - API\`, Angular, DataStage, PowerCenter,
          Cognos, Forms, Gestao
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `, [
        s.Matricula, s.Nom_Analista, s.SistemaA, s.SistemaA_Cadastro, s.SistemaA_Sinistro, s.SistemaA_Cobranca,
        s.SistemaA_Emissao, s.SistemaA_Comissao, s.SistemaA_Contabil, s.SistemaA_Cosseguro, s.SistemaA_Cadenas, s.SistemaA_SSR,
        s.SistemaB, s.SistemaC, s.SistemaD_Auto, s.SistemaD_Auto_Front, s.SistemaD_Vida, s.SistemaD_Vida_Front,
        s.SistemaD_Residencial, s.SistemaD_Residencial_Front, s.SistemaE, s.SistemaF, s.Cognos_BI,
        s.SistemaG, s.SistemaH, s.Crm_salesforce, s.PL_SQL, s.Webmethods,
        s.Java, s.Java_API, s.Angular, s.DataStage, s.PowerCenter,
        s.Cognos, s.Forms, s.Gestao
      ]);
  
      res.status(201).json({ message: 'Skill criada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar skill' });
    }
  });
  

// PUT
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const s = req.body;
   
    try {
      await req.db.query(`
        UPDATE skills SET
          Matricula = ?, Nom_Analista = ?, SistemaA = ?, SistemaA_Cadastro = ?, SistemaA_Sinistro = ?,
          SistemaA_Cobranca = ?, SistemaA_Emissao = ?, SistemaA_Comissao = ?, SistemaA_Contabil = ?,
          SistemaA_Cosseguro = ?, SistemaA_Cadenas = ?, SistemaA_SSR = ?, SistemaB = ?, SistemaC = ?,
          SistemaD_Auto = ?, SistemaD_Auto_Front = ?, SistemaD_Vida = ?, SistemaD_Vida_Front = ?,
          SistemaD_Residencial = ?, SistemaD_Residencial_Front = ?, SistemaE = ?, SistemaF = ?, \`BI-Cognos\` = ?,
          \`SistemaG\` = ?, SistemaH = ?, Crm_salesforce = ?, \`PL-SQL\` = ?, Webmethods = ?,
          Java = ?, \`Java - API\` = ?, Angular = ?, DataStage = ?, PowerCenter = ?,
          Cognos = ?, Forms = ?, Gestao = ?
        WHERE Id = ?
      `, [
        s.Matricula, s.Nom_Analista, s.SistemaA, s.SistemaA_Cadastro, s.SistemaA_Sinistro,
        s.SistemaA_Cobranca, s.SistemaA_Emissao, s.SistemaA_Comissao, s.SistemaA_Contabil,
        s.SistemaA_Cosseguro, s.SistemaA_Cadenas, s.SistemaA_SSR, s.SistemaB, s.SistemaC,
        s.SistemaD_Auto, s.SistemaD_Auto_Front, s.SistemaD_Vida, s.SistemaD_Vida_Front,
        s.SistemaD_Residencial, s.SistemaD_Residencial_Front, s.SistemaE, s.SistemaF, s['BI-Cognos'],
        s.SistemaG, s.SistemaH, s.Crm_salesforce, s['PL-SQL'], s.Webmethods,
        s.Java, s['Java - API'], s.Angular, s.DataStage, s.PowerCenter,
        s.Cognos, s.Forms, s.Gestao,
        id
      ]);
  
      res.json({ message: 'Skill atualizada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar skill' });
    }
  });
  

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.query('DELETE FROM skills WHERE Id = ?', [id]);
    res.json({ message: 'Skill deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar skill' });
  }
});


router.get('/buscar', async (req, res) => {
  try {
    const orderBy = req.query.orderBy; // ⚡ sem TypeScript

    let sql = `SELECT s.*,
      ROUND(  
      (COALESCE(s.SistemaA,0) +
      COALESCE(s.SistemaA_Cadastro,0) +
      COALESCE(s.SistemaA_Cadenas,0) +
      COALESCE(s.SistemaA_Cobranca,0) +
      COALESCE(s.SistemaA_Comissao,0) +
      COALESCE(s.SistemaA_Contabil,0) +
      COALESCE(s.SistemaA_Cosseguro,0) +
      COALESCE(s.SistemaA_Emissao,0) +
      COALESCE(s.SistemaA_Sinistro,0) +
      COALESCE(s.SistemaA_SSR,0)
     +
      COALESCE(s.SistemaB,0) +
      COALESCE(s.SistemaC,0) +
      COALESCE(s.SistemaE,0) +
      COALESCE(s.SistemaF,0) +
      COALESCE(s.\`BI-Cognos\`,0)
     +
      COALESCE(s.SistemaD_Auto,0) +
      COALESCE(s.SistemaD_Auto_Front,0) +
      COALESCE(s.SistemaD_Residencial,0) +
      COALESCE(s.SistemaD_Residencial_Front,0) +
      COALESCE(s.SistemaD_Vida,0) +
      COALESCE(s.SistemaD_Vida_Front,0)
     +
      COALESCE(s.\`SistemaG\`,0) +
      COALESCE(s.SistemaH,0) +
      COALESCE(s.Crm_salesforce,0)
      +
      COALESCE(s.\`PL-SQL\`,0) +
      COALESCE(s.Webmethods,0) +
      COALESCE(s.Java,0) +
      COALESCE(s.\`Java - API\`,0) +
      COALESCE(s.Angular,0) +
      COALESCE(s.DataStage,0) +
      COALESCE(s.PowerCenter,0) +
      COALESCE(s.Cognos,0) +
      COALESCE(s.Forms,0)
    +
    COALESCE(s.Gestao,0) 
    ) /34 , 2 ) as media FROM skills s `;

    if (orderBy) {
      const colunasValidas = [
        'SistemaA','SistemaA_Cadastro','SistemaA_Sinistro','SistemaA_Cobranca','SistemaA_Emissao',
        'SistemaA_Comissao','SistemaA_Contabil','SistemaA_Cosseguro','SistemaA_Cadenas','SistemaA_SSR',
        'SistemaB','SistemaC','SistemaD_Auto','SistemaD_Auto_Front','SistemaD_Vida','SistemaD_Vida_Front',
        'SistemaD_Residencial','SistemaD_Residencial_Front','SistemaE','SistemaF','BI-Cognos','SistemaG','SistemaH',
        'Crm_salesforce','PL-SQL','Webmethods','Java','Java - API','Angular',
        'DataStage','PowerCenter','Cognos','Forms','Gestao'
      ];

      const colunas = orderBy
        .split(',')
        .map(c => c.trim())
        .filter(c => colunasValidas.includes(c));

        const sql2 = `, media DESC `;

      if (colunas.length > 0) {
        const orderClause = colunas.map(c => `\`${c}\` DESC`).join(', ');
        sql += ` ORDER BY ${orderClause}`;
        sql += sql2;
      }
    }
    //console.log('busca feita: ',sql);
    const [rows] = await req.db.query(sql);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar skills com ordenação' });
  }
});

router.get('/:id/media', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT
        ROUND((
          COALESCE(s.SistemaA,0) +
          COALESCE(s.SistemaA_Cadastro,0) +
          COALESCE(s.SistemaA_Cadenas,0) +
          COALESCE(s.SistemaA_Cobranca,0) +
          COALESCE(s.SistemaA_Comissao,0) +
          COALESCE(s.SistemaA_Contabil,0) +
          COALESCE(s.SistemaA_Cosseguro,0) +
          COALESCE(s.SistemaA_Emissao,0) +
          COALESCE(s.SistemaA_Sinistro,0) +
          COALESCE(s.SistemaA_SSR,0)
        ) / 10, 2) AS TRNW,

        ROUND((
          COALESCE(s.SistemaB,0) +
          COALESCE(s.SistemaC,0) +
          COALESCE(s.SistemaE,0) +
          COALESCE(s.SistemaF,0) +
          COALESCE(s.\`BI-Cognos\`,0)
        ) / 5, 2) AS OUTR,

        ROUND((
          COALESCE(s.SistemaD_Auto,0) +
          COALESCE(s.SistemaD_Auto_Front,0) +
          COALESCE(s.SistemaD_Residencial,0) +
          COALESCE(s.SistemaD_Residencial_Front,0) +
          COALESCE(s.SistemaD_Vida,0) +
          COALESCE(s.SistemaD_Vida_Front,0)
        ) / 6, 2) AS CRND,

        ROUND((
          COALESCE(s.\`SistemaG\`,0) +
          COALESCE(s.SistemaH,0) +
          COALESCE(s.Crm_salesforce,0)
        ) / 3, 2) AS ATS,

        ROUND((
          COALESCE(s.\`PL-SQL\`,0) +
          COALESCE(s.Webmethods,0) +
          COALESCE(s.Java,0) +
          COALESCE(s.\`Java - API\`,0) +
          COALESCE(s.Angular,0) +
          COALESCE(s.DataStage,0) +
          COALESCE(s.PowerCenter,0) +
          COALESCE(s.Cognos,0) +
          COALESCE(s.Forms,0)
        ) / 9, 2) AS TECN,

        COALESCE(s.Gestao,0) AS GEST

      FROM skills s
      WHERE s.id = ?;
    `;

    const [rows] = await req.db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analista não encontrado' });
    }

    res.json(rows[0]); // ⚠️ retorna UM objeto, não array

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar média de skills' });
  }
});


export default router;

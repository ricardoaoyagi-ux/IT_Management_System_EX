import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

// ✅ middleware aplicado globalmente neste router
router.use(databaseMiddleware);
// GET - Lista checklists pendentes e concluídos por solucionador (com aging)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        solucionador,

        /* Pendentes por faixa */
        COUNT(CASE 
          WHEN st = 0 AND DATEDIFF(CURDATE(), Dt_Resolucao) > 90 
          THEN 1 END) AS pendentes90,

        COUNT(CASE 
          WHEN st = 0 
          AND DATEDIFF(CURDATE(), Dt_Resolucao) > 60 
          AND DATEDIFF(CURDATE(), Dt_Resolucao) <= 90 
          THEN 1 END) AS pendentes60a90,

        COUNT(CASE 
          WHEN st = 0 
          AND DATEDIFF(CURDATE(), Dt_Resolucao) > 30 
          AND DATEDIFF(CURDATE(), Dt_Resolucao) <= 60 
          THEN 1 END) AS pendentes30a60,

        COUNT(CASE 
          WHEN st = 0 
          AND DATEDIFF(CURDATE(), Dt_Resolucao) <= 30 
          THEN 1 END) AS pendentes30,

        /* Totais */
        COUNT(CASE WHEN st = 0 THEN 1 END) AS pendentes,
        COUNT(CASE WHEN st = 1 AND DATEDIFF(CURDATE(), Dt_Resolucao) <= 30  THEN 1  END) AS concluidos

      FROM incidente
      GROUP BY solucionador
      ORDER BY pendentes DESC
    `;

    const [rows] = await req.db.query(query);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar checklists pendentes' });
  }
});

export default router;

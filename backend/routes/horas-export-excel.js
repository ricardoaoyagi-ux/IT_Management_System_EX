import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';
import XLSX from 'xlsx';

const router = express.Router();
router.use(databaseMiddleware);

router.get('/exportar-excel', async (req, res) => {
  const db = req.db;

  try {
    const [rows] = await db.query(`
SELECT
  YEAR(hsv.data_ref) AS ano,
  MONTH(hsv.data_ref) AS mes,
  hsv.usuario_email AS usuario,

  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_75' AND hsv.eh_noturno = 0 THEN hsv.segundos_convertidos ELSE 0 END)/3600 AS horas_75,
  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_100' AND hsv.eh_noturno = 0 THEN hsv.segundos_convertidos ELSE 0 END)/3600 AS horas_100,

  -- 🔥 NOVO
  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_75' AND hsv.eh_noturno = 1 THEN hsv.segundos_reais ELSE 0 END)/3600 AS horas_75_AN_real,
  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_75' AND hsv.eh_noturno = 1 THEN hsv.segundos_convertidos ELSE 0 END)/3600 AS horas_75_AN_convertido,

  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_100' AND hsv.eh_noturno = 1 THEN hsv.segundos_reais ELSE 0 END)/3600 AS horas_100_AN_real,
  SUM(CASE WHEN hsv.tipo_base = 'EXTRA_100' AND hsv.eh_noturno = 1 THEN hsv.segundos_convertidos ELSE 0 END)/3600 AS horas_100_AN_convertido,

  SUM(CASE WHEN hsv.tipo_base = 'STANDBY' THEN hsv.segundos_convertidos ELSE 0 END)/3600 AS horas_STANDBY -- ,
 -- SUM(IFNULL(hi.pausa_minutos,0) * 60)/3600 AS pausa_total_horas

FROM horas_segmentadas_v2 hsv
-- JOIN horas_import hi ON hi.id = hsv.id_import
GROUP BY YEAR(hsv.data_ref), MONTH(hsv.data_ref), hsv.usuario_email
ORDER BY ano, mes, hsv.usuario_email;
    `);

    
const formatarNumero = (valor) => {
  if (valor == null) return '0,00';
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};


function decimalParaHHMM(decimal) {
  if (!decimal && decimal !== 0) return '00:00';

  const totalMinutos = Math.round(decimal * 60);

  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${String(horas).padStart(2,'0')}:${String(minutos).padStart(2,'0')}`;
}


    // Mapear nomes amigáveis para Excel
const excelData = rows.map(r => ({

  'Ano': r.ano,
  'Mês': r.mes,
  'Usuário': r.usuario,

  'Horas 75%': decimalParaHHMM(r.horas_75 || 0),
  'Horas 100%': decimalParaHHMM(r.horas_100 || 0),

  'Horas 75% AN (Real)': decimalParaHHMM(r.horas_75_AN_real || 0),
  'Horas 75% AN (Convertido)': decimalParaHHMM(r.horas_75_AN_convertido || 0),

  'Horas 100% AN (Real)': decimalParaHHMM(r.horas_100_AN_real || 0),
  'Horas 100% AN (Convertido)': decimalParaHHMM(r.horas_100_AN_convertido || 0),

   'Horas STANDBY': decimalParaHHMM(r.horas_STANDBY || 0)

}));


    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo Horas');

    // Gerar buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers para download
    res.setHeader('Content-Disposition', 'attachment; filename="resumo_horas.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar Excel' });
  }
});

export default router;
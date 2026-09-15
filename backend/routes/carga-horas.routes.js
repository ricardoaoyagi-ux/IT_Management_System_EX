import express from 'express';
import crypto from 'crypto';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

router.use(databaseMiddleware);

// GET - listar usuários únicos 
router.get('/usuarios', async (req, res) => {
  const db = req.db;

  try {
    const [rows] = await db.query(`
      SELECT DISTINCT email_usuario AS email
      FROM horas_import
      WHERE email_usuario IS NOT NULL
      ORDER BY email_usuario
    `);

    // 🔥 já formatado pro front
    const usuarios = rows.map(r => ({
      nome: r.email,   // por enquanto usamos email como nome
      email: r.email
    }));

    res.json(usuarios);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// 🔐 gerar hash baseado no conteúdo do arquivo
function gerarHash(rows) {
  const json = JSON.stringify(rows);
  return crypto.createHash('sha256').update(json).digest('hex');
}

/**
 * Converte número serial do Excel para UTC
 */
function excelSerialToMySQLDateTime(serial) {
  if (serial == null) return null;

  const serialDays = Math.floor(serial);
  const fractionalDay = serial - serialDays;

  // 🔥 Excel epoch REAL (com bug já embutido)
  const base = Date.UTC(1899, 11, 30);

  const daysMs = serialDays * 86400000;
  const timeMs = Math.round(fractionalDay * 86400000);

  const date = new Date(base + daysMs + timeMs);

  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Converte decimal de horas (0.5 = 12:00:00) para HH:MM:SS
 */
function parseHorasDecimais(decimalHoras) {
  if (!decimalHoras && decimalHoras !== 0) return '00:00:00';
  const totalSeconds = Math.round(decimalHoras * 24 * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

/**
 * Converte hora em string "HH:MM" ou "HH:MM:SS" para HH:MM:SS
 */
function parseHoraExcel(value) {
  if (value == null) return null;

  // ⚡ Tratar zero como meia-noite
  if (value === 0 || value === '0') return '00:00:00';

  if (typeof value === 'number') {
    // já está em decimal de dia (0.5 = 12:00)
    const totalSeconds = Math.round(value * 24 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }

  if (typeof value === 'string') {
    const clean = value.trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(clean)) {
      const parts = clean.split(':');
      const hh = parts[0].padStart(2,'0');
      const mm = parts[1].padStart(2,'0');
      const ss = parts[2] ? parts[2].padStart(2,'0') : '00';
      return `${hh}:${mm}:${ss}`;
    }

    // ⚡ Se string for '0', também consideramos meia-noite
    if (clean === '0') return '00:00:00';
  }

  return null;
}

function serialExcelToDateStringSimple(serial) {  
  if (serial == null) return null;

  // Converte o serial Excel em número de dias desde 1899-12-30
  const days = Math.floor(serial);
  const excelEpoch = new Date(1899, 11, 30); // 30 de dezembro de 1899
  excelEpoch.setDate(excelEpoch.getDate() + days);

  // Apenas extrair o dia, mês e ano
  const year = excelEpoch.getFullYear();
  const month = String(excelEpoch.getMonth() + 1).padStart(2, '0');
  const day = String(excelEpoch.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}



/**
 * Normaliza uma linha do Excel para horas_import
 */
function normalizeExcelRow(raw, usuario, nomeArquivo, linha) {


  const data_trabalho = raw['Data'] != null ? serialExcelToDateStringSimple(raw['Data']) : null;
  const data_guardia = raw['  Data da guardia  '] != null ? serialExcelToDateStringSimple(raw['  Data da guardia  ']) : null;

  const hora_inicio = parseHoraExcel(raw['Hora de início  ']);
  const hora_fim = parseHoraExcel(raw['Hora de saída ']);
  const inicio_guardia = parseHoraExcel(raw['  Hora início da guardia  ']);

  const fim_guardia = parseHoraExcel(raw['  Hora término da guardia  ']);
 
  const inicio_intervencao = parseHoraExcel(raw['  Hora início intervenção  ']);
  const fim_intervencao = parseHoraExcel(raw['  Hora término intervenção  ']);

  const horas_trabalhadas = parseHorasDecimais(raw['Horas Trabajadas']);
  const horas_guardia = parseHorasDecimais(raw['Horas Trabajadas Guardia']);

  const houve_acionamento = (() => {
    const val = raw['  Houve acionamento?  ']?.toLowerCase?.().trim();
    if (!val) return null;
    if (['sim', 'yes', '1', 'true'].includes(val)) return 1;
    if (['não', 'nao', 'no', '0', 'false'].includes(val)) return 0;
    return null;
  })();

  let percentual = 0;
  if (raw['% de Recargo Sindpd-SP']) {
    percentual = parseFloat(String(raw['% de Recargo Sindpd-SP']).replace(',', '.')) || 0;
    if (percentual > 1) percentual = percentual / 100;
  }

  const data_validacao = raw['Fecha de validación'] != null ? excelSerialToMySQLDateTime(raw['Fecha de validación']) : null;
  const data_lancamento = raw['Marca temporal'] != null ? excelSerialToMySQLDateTime(raw['Marca temporal']) : null;
 
const pausa_inicio = parseHoraExcel(raw['Hora de início - Pausa']);
const pausa_minutos = raw['Pausa (em minutos)'] || 0;

const pausa_fim = somarMinutos(pausa_inicio, pausa_minutos);


  return {
    data_importacao: new Date(), // momento da importação
    email_usuario: raw['Dirección de correo electrónico'] || null,
    responsavel: raw['Indique o responsável '] || null,
    data_trabalho,
    hora_inicio,
    hora_fim,
    pausa_minutos: raw['Pausa (em minutos)'] || 0,
    pausa_inicio   ,
    pausa_fim      ,

    observacoes: raw['Observações '] || raw['Comentario'] || null,
    tipo_registro: raw['Tipo de registro'] || null,
    data_guardia,
    inicio_guardia,
    fim_guardia,
    houve_acionamento,
    inicio_intervencao,
    fim_intervencao,
    descricao_ocorrencia: raw['  Descrição da ocorrência   '] || null,
    origem_hora_extra: raw['  Origem da hora extra  '] || null,
    horas_trabalhadas,
    horas_guardia,
    tipo_dia: raw['Tipo de Día'] || null,
    percentual,
    status_validacao: raw['validado'] || null,
    data_validacao,
    ano_mes: raw['ANO-MES'] || null,
    raw_json: JSON.stringify(raw),
    nome_arquivo: nomeArquivo,
    hash_arquivo: crypto.createHash('sha256').update(JSON.stringify(raw)).digest('hex'),
    linha_arquivo: linha,
    data_lancamento
  };
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

    const usuario = 'sistema';
    const nomeArquivo = fileName || 'sem-nome.xlsx';
    await db.query(`DELETE FROM horas_import WHERE nome_arquivo = ?`, [nomeArquivo]);

    let linhaIndex = 2; // considerando header = 1
    for (const row of rows) {
      const normalized = normalizeExcelRow(row, usuario, nomeArquivo, linhaIndex);

      await db.query(
        `INSERT INTO horas_import
        (data_importacao, email_usuario, responsavel, data_trabalho, hora_inicio, hora_fim, pausa_minutos,
        pausa_inicio,
        pausa_fim,
         observacoes, tipo_registro, data_guardia, inicio_guardia, fim_guardia, houve_acionamento,
         inicio_intervencao, fim_intervencao, descricao_ocorrencia, origem_hora_extra,
         horas_trabalhadas, horas_guardia, tipo_dia, percentual, status_validacao,
         data_validacao, ano_mes, raw_json, nome_arquivo, hash_arquivo, linha_arquivo, data_lancamento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        Object.values(normalized)
      );

      linhaIndex++;
    }
    await db.query(`DELETE FROM horas_segmentadas_v2`);

    res.json({
      success: true,
      total: rows.length,
      message: `${rows.length} registros importados com sucesso.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao importar horas' });
  }
});

function toDateString(d) {
  if (!d) return null;
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function somarMinutos(hora, minutos) {
  if (!hora || minutos == null) return null;

  const [h, m, s] = hora.split(':').map(Number);

  const totalMin = h * 60 + m + Number(minutos);

  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;

  return `${String(newH).padStart(2,'0')}:${String(newM).padStart(2,'0')}:00`;
}


// GET - calendário de horas por usuário/mês
router.get('/calendario', async (req, res) => {
  const db = req.db;

  const { usuario, ano, mes } = req.query;

  if (!usuario || !ano || !mes) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    const mesNum = Number(mes);
    const anoNum = Number(ano);

    const inicioMes = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const fimMesDate = new Date(anoNum, mesNum, 0); // último dia do mês
    const fimMes = `${ano}-${String(mes).padStart(2, '0')}-${String(fimMesDate.getDate()).padStart(2, '0')}`;

    // 🔥 UMA única query (performance)
    const [rows] = await db.query(`
      SELECT *
      FROM horas_import
      WHERE email_usuario = ?
      AND (
        (data_trabalho BETWEEN ? AND ?)
        OR
        (data_guardia BETWEEN ? AND ?)
      )
    `, [usuario, inicioMes, fimMes, inicioMes, fimMes]);

    const resultado = {};

    // 🔧 helper
function addDia(dataStr) {
  const d = new Date(dataStr);
  d.setDate(d.getDate() + 1);
  return toDateString(d);
}
function toMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}
    function formatHora(hora) {
      if (!hora) return null;
      return hora.slice(0, 5); // HH:MM
    }

    function getTipo(row) {
      if (row.data_guardia) return 'StandBy';
      if (row.origem_hora_extra) return 'Hora Extra';
      return 'Expediente';
    }

    function adicionarEvento(data, evento) {
      if (!resultado[data]) resultado[data] = [];
      resultado[data].push(evento);
    }

    // 🔥 processar tudo em memória
for (const row of rows) {

  const tipo = getTipo(row);

  let dataBase = toDateString(row.data_guardia || row.data_trabalho);
  let inicio = row.inicio_guardia || row.hora_inicio;
  let fim = row.fim_guardia || row.hora_fim;

const pausaInicio = row.pausa_inicio;
const pausaFim = row.pausa_fim;
const temPausa = pausaInicio && pausaFim && row.pausa_minutos > 0;

  if (!dataBase || !inicio || !fim) continue;

  // 🔧 definir status_validacao
  // Exemplo: usar row.status_validacao se existir, senão padrão "pendente"
  const status_validacao = row.status_validacao || 'pendente';

  
  const inicioFmt = formatHora(inicio);
  let fimFmt = formatHora(fim);
 

const inicioMin = toMinutos(inicioFmt);
const fimMin = toMinutos(fimFmt);

// 🔥 inconsistência REAL (base original)
const inconsistenteOriginal =
  inicioMin === fimMin ||
  (fimMin === 0 && inicioMin !== 0);

//const eventoBase = {
 // tipo,
 // inicio: inicioFmt,
 // fim: fimFmt,
 // status_validacao,
 // inconsistente: inconsistenteOriginal
//};

let eventosQuebrados = [];

if (temPausa) {

  const pausaInicioFmt = formatHora(pausaInicio);
  const pausaFimFmt = formatHora(pausaFim);

  // 🔹 antes da pausa
  if (inicioFmt < pausaInicioFmt) {
    eventosQuebrados.push({
      tipo,
      inicio: inicioFmt,
      fim: pausaInicioFmt,
      status_validacao,
      inconsistente: false
    });
  }

  // 🔹 pausa (novo tipo)
  eventosQuebrados.push({
    tipo: 'Pausa',
    inicio: pausaInicioFmt,
    fim: pausaFimFmt,
    status_validacao,
    inconsistente: false
  });

  // 🔹 depois da pausa
  if (pausaFimFmt < fimFmt) {
    eventosQuebrados.push({
      tipo,
      inicio: pausaFimFmt,
      fim: fimFmt,
      status_validacao,
      inconsistente: false
    });
  }

} else {
  eventosQuebrados.push({
    tipo,
    inicio: inicioFmt,
    fim: fimFmt,
    status_validacao,
    inconsistente: inconsistenteOriginal
  });
}


// 🔥 cruzou meia-noite?
for (const ev of eventosQuebrados) {

  const inicioMinEv = toMinutos(ev.inicio);
  const fimMinEv = toMinutos(ev.fim);

  if (fimMinEv > inicioMinEv) {

    adicionarEvento(dataBase, ev);

  } else if (fimMinEv < inicioMinEv) {

    // DIA 1
    adicionarEvento(dataBase, {
      ...ev,
      fim: '23:59'
    });

    const proximoDia = addDia(dataBase);

    if (fimMinEv !== 0) {
      adicionarEvento(proximoDia, {
        ...ev,
        inicio: '00:00',
        fim: ev.fim
      });
    }

  } else {
    adicionarEvento(dataBase, ev);
  }
}

}


    // 🔥 ordenar eventos por hora
    for (const dia in resultado) {
      resultado[dia].sort((a, b) =>
        a.inicio.localeCompare(b.inicio)
      );
    }

    res.json(resultado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao montar calendário' });
  }
});

export default router;
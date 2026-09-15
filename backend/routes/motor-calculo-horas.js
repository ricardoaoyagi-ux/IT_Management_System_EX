import express from 'express';
import { databaseMiddleware } from '../database.middleware.js';

const router = express.Router();

router.use(databaseMiddleware);

// =========================
// 🔥 DEBUG
// =========================
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[HORAS]', ...args);
}

// =========================
// 🧠 ESTADO GLOBAL CORRETO (POR PESSOA)
// =========================
const estados = new Map();

function getState(row) {
  const key = row.email_usuario;

  if (!estados.has(key)) {
    estados.set(key, {
      acumulado75: 0,
      jornadaAtual: null
    });
  }

  return estados.get(key);
}

function quebrarPorPausa(inicio, fim, row) {
  const resultado = [];

  if (!row.pausa_inicio || !row.pausa_fim || row.pausa_minutos <= 0) {
    return [{ inicio, fim }];
  }

  const pausaInicio = combinarDataHoraLocal(row.data_trabalho, row.pausa_inicio);
  let pausaFim = combinarDataHoraLocal(row.data_trabalho, row.pausa_fim);

  if (!pausaInicio || !pausaFim) {
    return [{ inicio, fim }];
  }

  // 🔥 se pausa cruzar meia-noite
  if (pausaFim <= pausaInicio) {
    pausaFim.setDate(pausaFim.getDate() + 1);
  }

  // 🔥 validação: pausa fora da jornada → ignora
  if (pausaInicio >= fim || pausaFim <= inicio) {
    return [{ inicio, fim }];
  }

  // 🔥 clamp (segurança)
  const pausaIniReal = new Date(Math.max(pausaInicio, inicio));
  const pausaFimReal = new Date(Math.min(pausaFim, fim));

  // PARTE 1: antes da pausa
  if (inicio < pausaIniReal) {
    resultado.push({
      inicio,
      fim: pausaIniReal
    });
  }

  // PARTE 2: depois da pausa
  if (pausaFimReal < fim) {
    resultado.push({
      inicio: pausaFimReal,
      fim
    });
  }

  return resultado;
}

// =========================
// 🚀 PROCESSAMENTO
// =========================
async function processarHorasImport(db) {
  const startGlobal = Date.now();

  log('🚀 Iniciando processamento de horas');

  await db.query(`DELETE FROM horas_segmentadas_v2`);

  const [rows] = await db.query(`
    SELECT * FROM horas_import 
     WHERE status_validacao = 'validado'    
    ORDER BY
  EMAIL_USUARIO, 
  -- tempo real único (chave da verdade)
  COALESCE(
    TIMESTAMP(data_trabalho, hora_inicio),
    TIMESTAMP(data_guardia, inicio_guardia)
  )
  `);

  const [feriadosRows] = await db.query(`SELECT Data FROM feriado`);

  const feriadosSet = new Set(
    feriadosRows.map(f => formatDateLocal(new Date(f.Data)))
  );

  log(`📦 Registros: ${rows.length}`);

  let total = 0;

  for (const row of rows) {
    log(`\n👤 ${row.email_usuario} | ID ${row.id}`);

const temDataGuardia = !!row.data_guardia;
const temDataTrabalho = !!row.data_trabalho;

if ((temDataTrabalho && temDataGuardia) || (!temDataTrabalho && !temDataGuardia)) {
  log(`⚠️ ROW INVÁLIDA (ignorada)`);
  continue;
}

if (temDataGuardia) {
  const inicio = combinarDataHoraLocal(row.data_guardia, row.inicio_guardia);
  const fim = combinarDataHoraLocal(row.data_guardia, row.fim_guardia);

  if (!inicio || !fim || isNaN(inicio) || isNaN(fim)) {
    log(`🚨 STANDBY inválido`);
    continue;
  }

  if (fim <= inicio) fim.setDate(fim.getDate() + 1);

  const seg = {
    usuario_email: row.email_usuario,
    data_ref: formatDateLocal(inicio),
    inicio: formatDateTimeLocal(inicio),
    fim: formatDateTimeLocal(fim),

    segundos_reais: Math.floor((fim - inicio) / 1000),
    segundos_convertidos: Math.floor((fim - inicio) / 1000),

    tipo_base: 'STANDBY',
    adicional_noturno: 0,
    adicional_domingo_feriado: 0,

    eh_noturno: 0,
    eh_domingo_feriado: 0,

    origem: row.tipo_registro,
    id_import: row.id,
    jornada_id: '' 
  };

  log(`🟦 STANDBY`);
  log(`👤 ${row.email_usuario}`);
  log(`⏱️ ${seg.inicio} → ${seg.fim}`);

      await db.query(
        `INSERT INTO horas_segmentadas_v2
        (usuario_email, data_ref, inicio, fim,
         segundos_reais, segundos_convertidos,
         tipo_base, adicional_noturno, adicional_domingo_feriado,
         eh_noturno, eh_domingo_feriado,
         origem, id_import, jornada_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seg.usuario_email,
          seg.data_ref,
          seg.inicio,
          seg.fim,
          seg.segundos_reais,
          seg.segundos_convertidos,
          seg.tipo_base,
          seg.adicional_noturno,
          seg.adicional_domingo_feriado,
          seg.eh_noturno,
          seg.eh_domingo_feriado,
          seg.origem,
          seg.id_import,
          seg.jornada_id
        ]
      );

  continue;
}

    const segmentos = gerarSegmentosV2(row, feriadosSet);

    log(`📊 Segmentos: ${segmentos.length}`);

    total += segmentos.length;

    for (const seg of segmentos) {
      await db.query(
        `INSERT INTO horas_segmentadas_v2
        (usuario_email, data_ref, inicio, fim,
         segundos_reais, segundos_convertidos,
         tipo_base, adicional_noturno, adicional_domingo_feriado,
         eh_noturno, eh_domingo_feriado,
         origem, id_import,jornada_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seg.usuario_email,
          seg.data_ref,
          seg.inicio,
          seg.fim,
          seg.segundos_reais,
          seg.segundos_convertidos,
          seg.tipo_base,
          seg.adicional_noturno,
          seg.adicional_domingo_feriado,
          seg.eh_noturno,
          seg.eh_domingo_feriado,
          seg.origem,
          seg.id_import,
          seg.jornada_id
        ]
      );
    }
  }

  log(`🏁 FINALIZADO | Total: ${total}`);
  log(`⏱️ ${Date.now() - startGlobal}ms`);
}


function getInicioJornada(cursor, feriadosSet) {
  const d = new Date(cursor);
  const diaSemana = d.getDay(); // 0=dom, 1=seg ...

  const dataStr = formatDateLocal(d);
  const ehFeriado = feriadosSet.has(dataStr);

  // =========================
  // 🔥 SEG → QUI (normal)
  // =========================
  if (diaSemana >= 1 && diaSemana <= 4 && !ehFeriado) {
    const inicio = new Date(d);
    inicio.setHours(9, 0, 0, 0);

    if (d < inicio) inicio.setDate(inicio.getDate() - 1);

    return inicio;
  }

  // =========================
  // 🔥 SEXTA (vira fim de semana)
  // =========================
  if (diaSemana === 5 && !ehFeriado) {
    const inicio = new Date(d);
    inicio.setHours(9, 0, 0, 0);

    if (d < inicio) inicio.setDate(inicio.getDate() - 1);

    return inicio;
  }

  // =========================
  // 🔥 SÁBADO ou DOMINGO
  // jornada começou na sexta 09:00
  // =========================
  if (diaSemana === 6 || diaSemana === 0) {
    const inicio = new Date(d);

    const diff = diaSemana === 6 ? 1 : 2; // sab: volta 1 dia, dom: 2 dias
    inicio.setDate(inicio.getDate() - diff);

    inicio.setHours(9, 0, 0, 0);

    return inicio;
  }

  // =========================
  // 🔥 FERIADO (segunda a sexta)
  // =========================
  if (ehFeriado) {
    const inicio = new Date(d);
    inicio.setDate(inicio.getDate() - 1);
    inicio.setHours(9, 0, 0, 0);

    return inicio;
  }

  return null;
}




function calcularNoturno(inicio, fim) {
  const NOTURNO_INICIO = 22;
  const NOTURNO_FIM = 6;

  let hasNoturno = false;

  let cursor = new Date(inicio);

  while (cursor < fim) {
    const h = cursor.getHours();

    if (h >= 22 || h < 6) {
      hasNoturno = true;
      break;
    }

    cursor = new Date(cursor.getTime() + 60 * 1000); // 1 min (otimizado)
  }

  return hasNoturno;
}

function getChaveJornada(cursor) {
  const base = new Date(cursor);

  // jornada começa sempre às 09:00
  const anchor = new Date(base);
  anchor.setHours(9, 0, 0, 0);

  // se antes das 09h → pertence ao dia anterior
  if (base < anchor) {
    anchor.setDate(anchor.getDate() - 1);
  }

  // chave = início real da jornada (não o dia)
  return anchor.getTime(); // ou toISOString()
}

function proximoBoundary(cursor) {
  const d = new Date(cursor);

  const boundaries = [];

  // 22:00 hoje
  const b1 = new Date(d);
  b1.setHours(22, 0, 0, 0);
  if (b1 > cursor) boundaries.push(b1);

  // 06:00 próximo dia
  const b2 = new Date(d);
  b2.setHours(6, 0, 0, 0);
  if (b2 <= cursor) b2.setDate(b2.getDate() + 1);
  boundaries.push(b2);

  // meia-noite próxima
  const b3 = new Date(d);
  b3.setHours(24, 0, 0, 0);
  boundaries.push(b3);

  return boundaries.sort((a, b) => a - b)[0];
}




// =========================
// 🧠 GERADOR
// =========================
function gerarSegmentosV2(row, feriadosSet) {
  const inicio = combinarDataHoraLocal(row.data_trabalho, row.hora_inicio);
  const fim = combinarDataHoraLocal(row.data_trabalho, row.hora_fim);

  if (!inicio || !fim) return [];

  if (fim <= inicio) fim.setDate(fim.getDate() + 1);

  //return processarFaixaGlobal(inicio, fim, row, feriadosSet);

  const faixas = quebrarPorPausa(inicio, fim, row);

let segmentos = [];

for (const faixa of faixas) {
  const segs = processarFaixaGlobal(faixa.inicio, faixa.fim, row, feriadosSet);
  segmentos = segmentos.concat(segs);
}

return segmentos;
}

// =========================
// 🧠 MOTOR PRINCIPAL (CORRIGIDO)
// =========================
function processarFaixaGlobal(inicio, fim, row, feriadosSet) {
  const resultado = [];
  const estado = getState(row);

  let cursor = new Date(inicio);

  const LIMITE_75 = 120 * 60;
  const FATOR_NOTURNO = 3600 / 3150;

  log(`\n🧠 INÍCIO FAIXA CONTÍNUA`);
  log(`👤 ${row.email_usuario}`);
  log(`⏱️ ${formatDateTimeLocal(inicio)} → ${formatDateTimeLocal(fim)}`);

  while (cursor < fim) {
    const restante = Math.floor((fim - cursor) / 1000);
    if (restante <= 0) break;

    const dataCursor = formatDateLocal(cursor);
    const diaSemana = cursor.getDay();
    const ehFeriado = feriadosSet.has(dataCursor);
    const ehFimSemanaOuFeriado = diaSemana === 0 || diaSemana === 6 || ehFeriado;

    // =========================
    // 🔥 RESET CONTROLADO (CORRIGIDO)
    // =========================
    const chaveJornada = getChaveJornada(cursor, feriadosSet);

    if (estado.jornadaAtual !== chaveJornada) {
      log(`🔄 NOVA JORNADA`);
      log(`   anterior: ${estado.jornadaAtual}`);
      log(`   nova: ${chaveJornada}`);

      estado.acumulado75 = 0;
      estado.jornadaAtual = chaveJornada;
    }

    // =========================
    // 🔥 TIPO BASE
    // =========================
    let tipo_base = 'EXTRA_75';

    if (ehFimSemanaOuFeriado) {
      tipo_base = 'EXTRA_100';
    } else if (estado.acumulado75 >= LIMITE_75) {
      tipo_base = 'EXTRA_100';
    }

    // =========================
    // 🔥 BOUNDARY REAL (SEM SPLIT POR DIA)
    // =========================
    const boundary = proximoBoundary(cursor);
    const fimParte = new Date(Math.min(boundary, fim));

    let duracao = Math.floor((fimParte - cursor) / 1000);
    if (duracao <= 0) break;

    // =========================
    // 🔥 LIMITAÇÃO 75%
    // =========================
    if (tipo_base === 'EXTRA_75') {
      duracao = Math.min(duracao, LIMITE_75 - estado.acumulado75);
    }

    const fimReal = new Date(cursor.getTime() + duracao * 1000);

    const ehNoturno = calcularNoturno(cursor, fimReal);

    // =========================
    // 🔥 ACUMULAÇÃO
    // =========================
    if (tipo_base === 'EXTRA_75') {
      estado.acumulado75 += duracao;
    }

    resultado.push({
      usuario_email: row.email_usuario,
      data_ref: dataCursor,
      inicio: formatDateTimeLocal(cursor),
      fim: formatDateTimeLocal(fimReal),

      segundos_reais: duracao,
      segundos_convertidos: ehNoturno
        ? Math.round(duracao * FATOR_NOTURNO)
        : duracao,

      tipo_base,
      adicional_noturno: ehNoturno ? 1 : 0,
      adicional_domingo_feriado: ehFimSemanaOuFeriado,

      eh_noturno: ehNoturno ? 1 : 0,
      eh_domingo_feriado: ehFimSemanaOuFeriado,

      origem: row.tipo_registro,
      id_import: row.id,
      jornada_id: getChaveJornada(cursor),
    });

    log(`➡️ ${formatDateTimeLocal(cursor)} → ${formatDateTimeLocal(fimReal)}`);
    log(`   tipo: ${tipo_base}`);
    log(`   acumulado75: ${estado.acumulado75}`);
    log(`   duracao: ${duracao}s`);

    cursor = fimReal;
  }

  log(`🧾 FIM | acumulado75: ${estado.acumulado75}`);

  return resultado;
}

// =========================
// 🧩 UTILITÁRIOS
// =========================
function splitByDay(inicio, fim) {
  const result = [];
  let current = new Date(inicio);

  while (current < fim) {
    const end = new Date(current);
    end.setHours(23, 59, 59, 999);

    result.push({
      inicio: new Date(current),
      fim: end < fim ? end : fim
    });

    current = new Date(end.getTime() + 1);
  }

  return result;
}

function formatDateLocal(date) {
  const p = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function formatDateTimeLocal(date) {
  const p = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} ` +
         `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

// =========================
// 🌐 ROUTE
// =========================
router.post('/processar', async (req, res) => {
  try {
    await processarHorasImport(req.db);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro' });
  }
});

function combinarDataHoraLocal(data, hora) {
  if (!data || !hora) return null;

  let year, month, day;

  // =========================
  // 🔥 DATA PODE SER DATE
  // =========================
  if (data instanceof Date) {
    year = data.getFullYear();
    month = data.getMonth();
    day = data.getDate();
  }

  // =========================
  // 🔥 DATA STRING ISO (2026-03-02T...)
  // =========================
  else if (typeof data === 'string' && data.includes('T')) {
    const d = new Date(data);
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  // =========================
  // 🔥 DATA STRING NORMAL (YYYY-MM-DD)
  // =========================
  else if (typeof data === 'string') {
    const parts = data.split('-').map(Number);
    year = parts[0];
    month = parts[1] - 1;
    day = parts[2];
  }

  else {
    throw new Error(`Formato de data inválido: ${data}`);
  }

  // =========================
  // ⏱ HORA
  // =========================
  let h = 0, m = 0, s = 0;

  if (!isNaN(hora)) {
    h = Math.floor(hora * 24);
    m = Math.floor((hora * 24 * 60) % 60);
    s = Math.round((hora * 24 * 3600) % 60);
  } else {
    const parts = hora.split(':').map(Number);
    h = parts[0] || 0;
    m = parts[1] || 0;
    s = parts[2] || 0;
  }

  return new Date(year, month, day, h, m, s);
}

export default router;
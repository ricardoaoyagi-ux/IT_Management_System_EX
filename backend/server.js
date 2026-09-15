import express from 'express';
import cors from 'cors';

import agrupamentoRoutes from './routes/agrupamento.routes.js';
import alocacaoRoutes from './routes/alocacao.routes.js';
import analistasRoutes from './routes/analistas.routes.js';
import aplicacoesRoutes from './routes/aplicacoes.routes.js';
import feriasRoutes from './routes/ferias.routes.js';
import inc_problemRoutes from './routes/inc_problem.routes.js';
import incidenteRoutes from './routes/incidente.routes.js';
import moduloRoutes from './routes/modulo.routes.js';
import problemsRoutes from './routes/problems.routes.js';
import ratesRoutes from './routes/rates.routes.js';
import rcaRoutes from './routes/rca.routes.js';
import senioridadeRoutes from './routes/senioridade.routes.js';
import sistemaRoutes from './routes/sistema.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import status_problemRoutes from './routes/status_problem.routes.js';
import sub_agrupamentoRoutes from './routes/sub_agrupamento.routes.js';
import sub_subagrupamentoRoutes from './routes/sub_subagrupamento.routes.js';
import tip_problemRoutes from './routes/tip_problem.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import checklists from './routes/checklistsPendentes.routes.js';
import problemreports from './routes/problemreports.routes.js';
import plantao from './routes/plantao.routes.js';
import justificativaSlaRoutes from './routes/justificativa-sla.routes.js';
import justificativaReaberturaRoutes from './routes/justificativa-reabertura.routes.js';

import motivoJustificativaRoutes from './routes/motivo-justificativa.routes.js';
import justificativareportsRoutes from './routes/justificativareports.routes.js';
import ktRoutes from './routes/kt.routes.js';
import timeboxRoutes from './routes/timebox.routes.js';
import capacityPlanner from './routes/capacityplanner.routes.js';
import mfaRoutes from './routes/mfa.routes.js';


import horas from './routes/carga-horas.routes.js';
import candidatos from './routes/candidatos.routes.js';
import calcular from './routes/motor-calculo-horas.js';
import exportar from './routes/horas-export-excel.js';



const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rotas
app.use('/agrupamento', agrupamentoRoutes);
app.use('/alocacao', alocacaoRoutes);
app.use('/analistas', analistasRoutes);
app.use('/aplicacoes', aplicacoesRoutes);
app.use('/ferias', feriasRoutes);
app.use('/inc_problem', inc_problemRoutes);
app.use('/incidente', incidenteRoutes);
app.use('/modulo', moduloRoutes);
app.use('/problems', problemsRoutes);
app.use('/rates', ratesRoutes);
app.use('/rca', rcaRoutes);
app.use('/senioridade', senioridadeRoutes);
app.use('/sistema', sistemaRoutes);
app.use('/skills', skillsRoutes);
app.use('/status_problem', status_problemRoutes);
app.use('/sub_agrupamento', sub_agrupamentoRoutes);
app.use('/sub_subagrupamento', sub_subagrupamentoRoutes);
app.use('/tip_problem', tip_problemRoutes);
app.use('/users', userRoutes);
app.use('/checklists', checklists);
app.use('/problemreports', problemreports);
app.use('/plantao', plantao);


app.use('/api/sistema', sistemaRoutes);
app.use('/api/modulo', moduloRoutes);
app.use('/api/agrupamento', agrupamentoRoutes);
app.use('/api/sub_agrupamento', sub_agrupamentoRoutes);
app.use('/api/sub_subagrupamento', sub_subagrupamentoRoutes);

app.use('/api/alocacao', alocacaoRoutes);
app.use('/api/senioridade', senioridadeRoutes);
app.use('/justificativa-sla',  justificativaSlaRoutes);
app.use('/justificativa-reabertura',  justificativaReaberturaRoutes);

app.use('/motivo-justificativa', motivoJustificativaRoutes);
app.use('/justificativareports', justificativareportsRoutes);
app.use('/kt', ktRoutes);
app.use('/timebox', timeboxRoutes);
app.use('/capacityplanner', capacityPlanner);

app.use('/auth', authRoutes);
app.use('/mfa', mfaRoutes);

app.use('/horas', horas);
app.use('/candidatos', candidatos);
app.use('/calcular', calcular);
app.use('/exportar', exportar);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import {
  Users,
  DollarSign,
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
  ChevronRight
} from "lucide-react";

import "../styles/dashboard.css";
import "../styles/globals.css";

const API = "http://localhost:3002/api/pessoas";

export default function Dashboard() {
  // Estados para dados simulados/vindos da API sincronizados com a imagem
  const [stats, setStats] = useState({
    alunosAtivos: 248,
    alunosAtivosMudanca: "+12%",
    receitaMensal: "32.450",
    receitaMudanca: "+8%",
    inadimplentes: 12,
    inadimplentesMudanca: "-3",
    acessosHoje: 87,
  });

  const [atividades, setAtividades] = useState([
    { id: 1, nome: "Maria Silva", acao: "Entrada registrada", tempo: "Agora", iniciais: "MS", classe: "entrada" },
    { id: 2, nome: "Joao Santos", acao: "Pagamento confirmado", tempo: "5 min", iniciais: "JS", classe: "pagamento" },
    { id: 3, nome: "Ana Costa", acao: "Nova matrícula - Plano Anual", tempo: "15 min", iniciais: "AC", classe: "matricula" },
    { id: 4, nome: "Pedro Lima", acao: "Saída registrada", tempo: "20 min", iniciais: "PL", classe: "saida" },
    { id: 5, nome: "Carlos Souza", acao: "Entrada registrada", tempo: "25 min", iniciais: "CS", classe: "entrada" },
  ]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="sub-title">Aqui está o resumo da sua academia hoje</p>
          </div>
        </header>

        {/* Grade de cartões de indicadores (KPIs) de topo */}
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-info">
              <span>Alunos Ativos</span>
              <strong>{stats.alunosAtivos}</strong>
              <small className="positivo">{stats.alunosAtivosMudanca} vs. mês anterior</small>
            </div>
            <div className="stat-icon icon-blue">
              <Users size={20} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-info">
              <span>Receita Mensal</span>
              <strong>R$ {stats.receitaMensal}</strong>
              <small className="positivo">{stats.receitaMudanca} vs. mês anterior</small>
            </div>
            <div className="stat-icon icon-green">
              <DollarSign size={20} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-info">
              <span>Inadimplentes</span>
              <strong>{stats.inadimplentes}</strong>
              <small className="negativo">{stats.inadimplentesMudanca} vs. mês anterior</small>
            </div>
            <div className="stat-icon icon-amber">
              <AlertCircle size={20} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-info">
              <span>Acessos Hoje</span>
              <strong>{stats.acessosHoje}</strong>
              <small className="neutro">Normal média diária</small>
            </div>
            <div className="stat-icon icon-slate">
              <Activity size={20} />
            </div>
          </article>
        </section>

        {/* Seção do meio dividida em Gráfico e Resumo Rápido */}
        <section className="middle-grid">
          {/* Box de Frequência Semanal */}
          <article className="chart-card">
            <div className="chart-header">
              <div>
                <h2>Frequência Semanal</h2>
                <p>Acessos por dia da semana</p>
              </div>
              <span className="total-badge">
                <TrendingUp size={14} style={{ marginRight: 4 }} />
                <strong>593</strong> total
              </span>
            </div>
            
            {/* Espaço reservado para os dias e barras do gráfico */}
            <div className="chart-placeholder">
              <div className="week-days">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>
          </article>

          {/* Box de Resumo Rápido lateral */}
          <article className="summary-card">
            <h2>Resumo Rápido</h2>
            
            <div className="summary-items">
              <div className="summary-item row-blue">
                <div className="item-left">
                  <div className="circle-icon c-blue"><Clock size={16} /></div>
                  <div>
                    <strong>Horário de Pico</strong>
                    <span>Maior movimento</span>
                  </div>
                </div>
                <span className="item-value val-black">18:00</span>
              </div>

              <div className="summary-item row-green">
                <div className="item-left">
                  <div className="circle-icon c-green"><TrendingUp size={16} /></div>
                  <div>
                    <strong>Taxa Retenção</strong>
                    <span>Alunos renovando</span>
                  </div>
                </div>
                <span className="item-value val-green">89%</span>
              </div>

              <div className="summary-item row-amber">
                <div className="item-left">
                  <div className="circle-icon c-amber"><AlertCircle size={16} /></div>
                  <div>
                    <strong>Vencendo Hoje</strong>
                    <span>Matrículas</span>
                  </div>
                </div>
                <span className="item-value val-amber">5</span>
              </div>
            </div>
          </article>
        </section>

        {/* Seção Inferior: Atividades Recentes */}
        <section className="recent-activities">
          <div className="activities-header">
            <h2>Atividades Recentes</h2>
            <button className="btn-see-all">Ver todas</button>
          </div>

          <div className="activities-list">
            {atividades.map((atividade) => (
              <div key={atividade.id} className="activity-item">
                <div className="activity-left">
                  <div className={`activity-avatar avatar-${atividade.classe}`}>
                    {atividade.iniciais}
                  </div>
                  <div className="activity-details">
                    <strong>{atividade.nome}</strong>
                    <span>{atividade.acao}</span>
                  </div>
                </div>
                <span className="activity-time">{atividade.tempo}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
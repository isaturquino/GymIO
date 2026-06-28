import React, { useState } from "react";
import ModaisRelatorios from "../components/Modais_relatorios";
import Sidebar from "../layout/Sidebar";
import { baixarRelatorio } from "../utils/pdf/baixarRelatorio";
import { dadosRelatoriosMock } from "../utils/pdf/dadosRelatorioMock";
import { relatoriosConfig } from "../utils/constants/relatoriosConfig";
import {
  Users,
  AlertTriangle,
  DollarSign,
  CalendarDays,
  Dumbbell,
  BarChart3,
  Download,
  FileText,
} from "lucide-react";

import "../styles/relatorios.css";
import "../styles/globals.css";

export default function Relatorios() {
  const [modalEtapa, setModalEtapa] = useState(null);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

  const abrirModal = (tipo) => {
    setRelatorioSelecionado(tipo);
    setModalEtapa(1);
  };

  const fecharModal = () => {
    setModalEtapa(null);
    setRelatorioSelecionado(null);
  };

  const cards = relatoriosConfig;

  const historico = [
    {
      tipo: "receita",
      titulo: "Receita Mensal",
      data: "28/03/2026 14:32",
      periodo: "Mar/2026",
    },
    {
      tipo: "inadimplencia",
      titulo: "Inadimplência",
      data: "25/03/2026 10:15",
      periodo: "Jan-Mar/2026",
    },
    {
      tipo: "alunos",
      titulo: "Alunos Ativos",
      data: "20/03/2026 16:45",
      periodo: "Mar/2026",
    },
  ];

  return (
    <div className="relatorios-layout">
      <Sidebar />

      <main className="relatorios-page">
        <header className="relatorios-header">
          <h1>Relatórios</h1>
          <p>Geração e exportação de relatórios do sistema</p>
        </header>

        <section className="filtro-box">
          <div className="campo-filtro">
            <label>Período Inicial</label>
            <input type="date" />
          </div>

          <div className="campo-filtro">
            <label>Período Final</label>
            <input type="date" />
          </div>

          <button className="btn btn--primary btn--lg">Aplicar Filtro</button>
        </section>

        <section className="cards-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            const dadosCard = dadosRelatoriosMock[card.tipo];

            return (
              <article className="relatorio-card" key={card.tipo}>
                <div className="card-topo">
                  <div className={`card-icon ${card.cor}`}>
                    <Icon />
                  </div>

                  <div>
                    <h3>{card.titulo}</h3>
                    <p>{card.subtitulo}</p>
                  </div>
                </div>

                <div className="card-dados">
                  {dadosCard?.resumo?.map((item) => (
                    <div className="linha-dado" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.valor}</strong>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn--outline btn--full btn-exportar"
                  onClick={() => abrirModal(card.tipo)}
                >
                  <Download size={16} />
                  Exportar PDF
                </button>
              </article>
            );
          })}
        </section>

        <section className="historico-box">
          <div className="historico-header">
            <div className="card-icon blue">
              <FileText />
            </div>

            <div>
              <h3>Histórico de Relatórios</h3>
              <p>Últimos relatórios gerados</p>
            </div>
          </div>

          <div className="historico-lista">
            {historico.map((item) => (
              <div className="historico-item" key={item.tipo}>
                <div className="historico-info">
                  <div className="historico-icon">
                    <FileText size={18} />
                  </div>

                  <div>
                    <strong>{item.titulo}</strong>
                    <span>{item.data}</span>
                  </div>
                </div>

                <div className="historico-download">
                  <span>{item.periodo}</span>

                  <button
                    type="button"
                    onClick={() => baixarRelatorio(item.tipo)}
                  >
                    <Download size={15} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ModaisRelatorios
        modalEtapa={modalEtapa}
        setModalEtapa={setModalEtapa}
        fecharModal={fecharModal}
        relatorioSelecionado={relatorioSelecionado}
      />
    </div>
  );
}

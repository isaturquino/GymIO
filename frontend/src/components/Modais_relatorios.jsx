import React, { useEffect, useState } from "react";
import { gerarRelatorioPDF } from "../utils/pdf/gerarRelatorioPDF";
import { dadosRelatoriosMock } from "../utils/pdf/dadosRelatorioMock";
import { Download, FileText, X, CheckCircle, Building2 } from "lucide-react";

import "../styles/modais_relatorios.css";

export default function ModaisRelatorios({
  modalEtapa,
  setModalEtapa,
  fecharModal,
  relatorioSelecionado,
}) {
  if (!modalEtapa) return null;

  const dadosRelatorio = dadosRelatoriosMock[relatorioSelecionado];
  const [progresso, setProgresso] = useState(0);
  const [mensagemProgresso, setMensagemProgresso] = useState("");

  useEffect(() => {
    if (modalEtapa !== 4) {
      setProgresso(0);
      setMensagemProgresso("");
      return;
    }

    setProgresso(0);
    setMensagemProgresso("Preparando relatório...");

    const etapas = [
      {
        porcentagem: 40,
        mensagem: "Buscando dados do relatório...",
        tempo: 700,
      },
      {
        porcentagem: 70,
        mensagem: "Montando estrutura do PDF...",
        tempo: 1400,
      },
      { porcentagem: 100, mensagem: "Relatório pronto!", tempo: 2100 },
    ];

    const timers = etapas.map((etapa) =>
      setTimeout(() => {
        setProgresso(etapa.porcentagem);
        setMensagemProgresso(etapa.mensagem);
      }, etapa.tempo),
    );

    const finalizar = setTimeout(() => {
      setModalEtapa(5);
    }, 2700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalizar);
    };
  }, [modalEtapa, setModalEtapa]);

  return (
    <div className="modal-overlay">
      {modalEtapa === 1 && (
        <div className="modal-card">
          <ModalHeader
            numero="1"
            titulo="Exportar Relatório em PDF"
            subtitulo="Selecione as opções para gerar seu relatório"
            onClose={fecharModal}
          />

          <label className="modal-label">Relatório</label>
          <select className="modal-input" value={relatorioSelecionado} disabled>
            <option value={relatorioSelecionado}>
              {dadosRelatorio?.titulo || "Relatório"}
            </option>
          </select>

          <label className="modal-label">Período do Relatório</label>
          <div className="modal-duplo">
            <input type="date" defaultValue="2026-05-01" />
            <input type="date" defaultValue="2026-05-31" />
          </div>

          <div className="modal-actions">
            <button className="btn btn--ghost btn--lg" onClick={fecharModal}>
              Cancelar
            </button>

            <button
              className="btn btn--primary btn--lg"
              onClick={() => setModalEtapa(2)}
            >
              Gerar PDF
            </button>
          </div>
        </div>
      )}

      {modalEtapa === 2 && (
        <div className="modal-card">
          <ModalHeader
            numero="2"
            titulo="Selecionar Dados"
            subtitulo="Escolha as informações que deseja incluir no relatório"
            onClose={fecharModal}
          />

          {[
            "Resumo Geral",
            "Gráficos",
            "Detalhamento",
            "Observações",
            "Quebras de Página entre Seções",
          ].map((texto, index) => (
            <label className="check-row" key={texto}>
              <input type="checkbox" defaultChecked={index !== 3} />
              <div>
                <strong>{texto}</strong>
                <span>Incluir esta seção no relatório</span>
              </div>
            </label>
          ))}

          <div className="modal-actions">
            <button
              className="btn btn--ghost btn--lg"
              onClick={() => setModalEtapa(1)}
            >
              Voltar
            </button>

            <button
              className="btn btn--primary btn--lg"
              onClick={() => setModalEtapa(3)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {modalEtapa === 3 && (
        <div className="modal-card preview-modal">
          <ModalHeader
            numero="3"
            titulo="Prévia do Relatório"
            subtitulo="Confira como seu relatório ficará antes de exportar"
            onClose={fecharModal}
          />

          <div className="preview-box">
            <div className="preview-topo">
              <div className="logo-preview">
                <Building2 size={20} />
              </div>

              <div>
                <strong>GymIO</strong>
                <span>Sistema de Gestão</span>
              </div>
            </div>

            <h3>{dadosRelatorio?.titulo}</h3>
            <p>Período: {dadosRelatorio?.periodo}</p>

            <h4>Resumo Geral</h4>

            <div className="preview-cards">
              {dadosRelatorio?.resumo.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.valor}</strong>
                </div>
              ))}
            </div>

            <h4>Prévia dos Dados</h4>

            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    {dadosRelatorio?.colunas.map((coluna) => (
                      <th key={coluna}>{coluna}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {dadosRelatorio?.tabela.slice(0, 3).map((linha, index) => (
                    <tr key={index}>
                      {linha.map((celula, i) => (
                        <td key={i}>{celula}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn--ghost btn--lg"
              onClick={() => setModalEtapa(2)}
            >
              Voltar
            </button>

            <button
              className="btn btn--primary btn--lg"
              onClick={() => setModalEtapa(4)}
            >
              Gerar PDF
            </button>
          </div>
        </div>
      )}

      {modalEtapa === 4 && (
        <div className="modal-card loading-modal">
          <ModalHeader
            numero="4"
            titulo="Gerando PDF"
            subtitulo="Aguarde enquanto seu relatório é gerado"
            onClose={fecharModal}
          />

          <FileText className="loading-icon" size={54} />

          <h3>Gerando seu relatório...</h3>
          <p>{mensagemProgresso}</p>

          <div className="progress-bar">
            <div style={{ width: `${progresso}%` }}></div>
          </div>

          <strong className="porcentagem">{progresso}%</strong>

          <div className="info-box">
            Por favor, não feche esta janela durante o processo.
          </div>
        </div>
      )}

      {modalEtapa === 5 && (
        <div className="modal-card download-modal">
          <ModalHeader
            numero="5"
            titulo="Download do Relatório"
            subtitulo="Seu relatório foi gerado com sucesso"
            onClose={fecharModal}
          />

          <CheckCircle className="success-icon" size={64} />

          <h3>Relatório gerado com sucesso!</h3>
          <p>Seu arquivo está pronto para download.</p>

          <div className="arquivo-box">
            <FileText size={28} />

            <div>
              <strong>{dadosRelatorio?.titulo.replaceAll(" ", "_")}.pdf</strong>
              <span>1.2 MB</span>
            </div>
          </div>

          <button
            className="btn btn--primary btn--full btn--lg"
            onClick={() => gerarRelatorioPDF(dadosRelatorio)}
          >
            <Download size={16} />
            Download do PDF
          </button>

          <button
            className="btn btn--ghost btn--full btn--lg"
            onClick={fecharModal}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

function ModalHeader({ numero, titulo, subtitulo, onClose }) {
  return (
    <div className="modal-header">
      <div className="modal-title">
        <span>{numero}</span>

        <div>
          <h2>{titulo}</h2>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </div>

      <button onClick={onClose} className="modal-close" type="button">
        <X size={20} />
      </button>
    </div>
  );
}

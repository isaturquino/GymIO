import React, { useState } from "react";
import "../styles/modal_equipamentos.css";
import "../styles/equipamentos.css";

import Sidebar from "../layout/Sidebar";

import ModalNovoEquipamento from "../components/ModalNovoEquipamento";
import ModalEditarEquipamento from "../components/ModalEditarEquipamento";
import ModalDetalhesEquipamento from "../components/ModalDetalhesEquipamento";
import ModalExcluirEquipamento from "../components/ModalExcluirEquipamento";
import ModalNovaManutencao from "../components/ModalNovaManutencao";
import ModalEditarManutencao from "../components/ModalEditarManutencao";
import ModalDetalhesManutencao from "../components/ModalDetalhesManutencao";
import ModalExcluirManutencao from "../components/ModalExcluirManutencao";

import {
  Search, Plus, Wrench, CheckCircle, Dumbbell,
  Pencil, Trash2, Info, Calendar,
} from "lucide-react";

const equipamentosIniciais = [
  {
    id: 1, nome: "Esteira Profissional", codigo: "EST-001", categoria: "Cardio",
    fabricante: "Movement", modelo: "RT250", dataCompra: "2024-03-15",
    garantia: "2026-03-15", status: "Funcionando", localizacao: "Sala de Musculação",
    observacoes: "Equipamento revisado recentemente.",
    ultimaManutencao: "15/03/2026", proximaManutencao: "15/06/2026",
  },
  {
    id: 2, nome: "Bicicleta Ergométrica", codigo: "BIC-001", categoria: "Cardio",
    fabricante: "Caloi", modelo: "E500", dataCompra: "2024-02-20",
    garantia: "2026-02-20", status: "Funcionando", localizacao: "Sala de Cardio",
    observacoes: "", ultimaManutencao: "20/02/2026", proximaManutencao: "20/05/2026",
  },
  {
    id: 3, nome: "Supino Reto", codigo: "SUP-001", categoria: "Musculação",
    fabricante: "Righetto", modelo: "SR100", dataCompra: "2023-01-10",
    garantia: "2025-01-10", status: "Manutenção", localizacao: "Sala de Musculação",
    observacoes: "Aguardando peça de reposição.",
    ultimaManutencao: "10/01/2026", proximaManutencao: "Em andamento",
  },
  {
    id: 4, nome: "Leg Press 45", codigo: "LEG-001", categoria: "Musculação",
    fabricante: "Life Fitness", modelo: "LP45", dataCompra: "2023-01-05",
    garantia: "2025-01-05", status: "Funcionando", localizacao: "Sala de Musculação",
    observacoes: "", ultimaManutencao: "05/01/2026", proximaManutencao: "05/04/2026",
  },
];

const manutencoesIniciais = [
  {
    id: 1, equipamento: "Esteira Profissional", tipo: "Preventiva",
    data: "2026-03-15", tecnico: "Carlos Silva", valorPrevisto: "350",
    observacoes: "Revisão completa dos componentes.",
  },
  {
    id: 2, equipamento: "Supino Reto", tipo: "Corretiva",
    data: "2026-04-10", tecnico: "João Melo", valorPrevisto: "890",
    observacoes: "Troca de rolamentos.",
  },
  {
    id: 3, equipamento: "Hack Squat", tipo: "Corretiva",
    data: "2026-04-12", tecnico: "Paulo Braga", valorPrevisto: "1200",
    observacoes: "Substituição de cabos.",
  },
];

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState(equipamentosIniciais);
  const [manutencoes, setManutencoes] = useState(manutencoesIniciais);

  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalNovaManutencao, setModalNovaManutencao] = useState(false);
  const [modalEditarManutencao, setModalEditarManutencao] = useState(false);
  const [modalDetalhesManutencao, setModalDetalhesManutencao] = useState(false);
  const [modalExcluirManutencao, setModalExcluirManutencao] = useState(false);

  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null);

  const abrirEditar = (eq) => { setEquipamentoSelecionado(eq); setModalEditar(true); };
  const abrirDetalhes = (eq) => { setEquipamentoSelecionado(eq); setModalDetalhes(true); };
  const abrirExcluir = (eq) => { setEquipamentoSelecionado(eq); setModalExcluir(true); };

  const salvarEquipamento = (dados) => {
    setEquipamentos((prev) =>
      prev.map((eq) => eq.id === equipamentoSelecionado.id ? { ...eq, ...dados } : eq)
    );
  };
  const excluirEquipamento = (eq) => {
    setEquipamentos((prev) => prev.filter((e) => e.id !== eq.id));
  };
  const criarEquipamento = (dados) => {
    setEquipamentos((prev) => [...prev, { ...dados, id: Date.now() }]);
  };

  const abrirNovaManutencao = () => setModalNovaManutencao(true);
  const abrirEditarManutencao = (m) => { setManutencaoSelecionada(m); setModalEditarManutencao(true); };
  const abrirDetalhesManutencao = (m) => { setManutencaoSelecionada(m); setModalDetalhesManutencao(true); };
  const abrirExcluirManutencao = (m) => { setManutencaoSelecionada(m); setModalExcluirManutencao(true); };

  const salvarManutencao = (dados) => {
    setManutencoes((prev) =>
      prev.map((m) => m.id === manutencaoSelecionada.id ? { ...m, ...dados } : m)
    );
  };
  const excluirManutencao = (m) => {
    setManutencoes((prev) => prev.filter((item) => item.id !== m.id));
  };
  const criarManutencao = (dados) => {
    setManutencoes((prev) => [...prev, { ...dados, id: Date.now() }]);
  };

  const totalFuncionando = equipamentos.filter((e) => e.status === "Funcionando").length;
  const totalManutencao = equipamentos.filter((e) => e.status === "Manutenção").length;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="equipamentos-page">

        <div className="equipamentos-header">
          <div>
            <h1>Equipamentos</h1>
            <p>Gestão de máquinas e manutenção</p>
          </div>
          <button className="btn-novo" onClick={() => setModalNovo(true)}>
            <Plus size={18} /> Novo Equipamento
          </button>
        </div>

        <div className="equipamentos-cards">
          <div className="card-info">
            <div><span>Total de Equipamentos</span><h2>{equipamentos.length}</h2></div>
            <div className="icon azul"><Dumbbell size={24} /></div>
          </div>
          <div className="card-info">
            <div><span>Funcionando</span><h2>{totalFuncionando}</h2></div>
            <div className="icon verde"><CheckCircle size={24} /></div>
          </div>
          <div className="card-info">
            <div><span>Em Manutenção</span><h2>{totalManutencao}</h2></div>
            <div className="icon amarelo"><Wrench size={24} /></div>
          </div>
        </div>

        <div className="equipamentos-box">
          <div className="box-header">
            <h2>Lista de Equipamentos</h2>
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Buscar equipamento..." />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Equipamento</th><th>Código</th><th>Status</th>
                <th>Última Manutenção</th><th>Próxima</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((eq) => (
                <tr key={eq.id}>
                  <td>{eq.nome}</td>
                  <td>{eq.codigo}</td>
                  <td>
                    <span className={`status ${eq.status === "Funcionando" ? "funcionando" : "manutencao"}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td>{eq.ultimaManutencao}</td>
                  <td>{eq.proximaManutencao}</td>
                  <td className="acoes">
                    <Pencil size={18} style={{ cursor: "pointer" }} onClick={() => abrirEditar(eq)} />
                    <Trash2 size={18} style={{ cursor: "pointer" }} onClick={() => abrirExcluir(eq)} />
                    <Info size={18} style={{ cursor: "pointer" }} onClick={() => abrirDetalhes(eq)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="equipamentos-box">
          <div className="box-header">
            <div>
              <h2>Histórico de Manutenção</h2>
              <p>Últimas manutenções realizadas</p>
            </div>
            <button className="btn-historico" onClick={abrirNovaManutencao}>
              <Calendar size={18} /> Agendar Manutenção
            </button>
          </div>
          {manutencoes.map((m) => (
            <div className="historico-item" key={m.id}>
              <div>
                <strong>{m.equipamento}</strong>
                <p>{m.data}</p>
              </div>
              <span className={`tipo ${m.tipo === "Preventiva" ? "preventiva" : "corretiva"}`}>
                {m.tipo}
              </span>
              <strong>R$ {parseFloat(m.valorPrevisto).toFixed(2).replace(".", ",")}</strong>
              <div className="acoes">
                <Pencil size={18} style={{ cursor: "pointer" }} onClick={() => abrirEditarManutencao(m)} />
                <Trash2 size={18} style={{ cursor: "pointer" }} onClick={() => abrirExcluirManutencao(m)} />
                <Info size={18} style={{ cursor: "pointer" }} onClick={() => abrirDetalhesManutencao(m)} />
              </div>
            </div>
          ))}
        </div>

        <ModalNovoEquipamento
          aberto={modalNovo}
          fechar={() => setModalNovo(false)}
          salvar={criarEquipamento}
        />
        <ModalEditarEquipamento
          aberto={modalEditar}
          fechar={() => setModalEditar(false)}
          equipamento={equipamentoSelecionado}
          salvar={salvarEquipamento}
        />
        <ModalDetalhesEquipamento
          aberto={modalDetalhes}
          fechar={() => setModalDetalhes(false)}
          equipamento={equipamentoSelecionado}
        />
        <ModalExcluirEquipamento
          aberto={modalExcluir}
          fechar={() => setModalExcluir(false)}
          equipamento={equipamentoSelecionado}
          excluir={excluirEquipamento}
        />
        <ModalNovaManutencao
          aberto={modalNovaManutencao}
          fechar={() => setModalNovaManutencao(false)}
          salvar={criarManutencao}
        />
        <ModalEditarManutencao
          aberto={modalEditarManutencao}
          fechar={() => setModalEditarManutencao(false)}
          manutencao={manutencaoSelecionada}
          salvar={salvarManutencao}
        />
        <ModalDetalhesManutencao
          aberto={modalDetalhesManutencao}
          fechar={() => setModalDetalhesManutencao(false)}
          manutencao={manutencaoSelecionada}
        />
        <ModalExcluirManutencao
          aberto={modalExcluirManutencao}
          fechar={() => setModalExcluirManutencao(false)}
          manutencao={manutencaoSelecionada}
          excluir={excluirManutencao}
        />
      </main>
    </div>
  );
}
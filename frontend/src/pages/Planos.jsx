import React, { useMemo, useState } from "react";
import Sidebar from "../layout/Sidebar";
import "../styles/globals.css";
import "../styles/alunos.css";
import "../styles/planos.css";

import {
  Plus,
  Search,
  CreditCard,
  Users,
  Calendar,
  TrendingUp,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Star,
} from "lucide-react";

const planosMock = [
  {
    id: 1,
    nome: "Plano Mensal",
    descricao: "Acesso livre por 30 dias",
    duracao: 30,
    valor: 99.9,
    alunosAtivos: 85,
    popular: false,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Plano Trimestral",
    descricao: "Acesso livre por 90 dias",
    duracao: 90,
    valor: 269.9,
    alunosAtivos: 92,
    popular: true,
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Plano Semestral",
    descricao: "Acesso livre por 180 dias",
    duracao: 180,
    valor: 499.9,
    alunosAtivos: 45,
    popular: false,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Plano Anual",
    descricao: "Acesso livre por 365 dias",
    duracao: 365,
    valor: 899.9,
    alunosAtivos: 26,
    popular: false,
    status: "Ativo",
  },
];

const matriculasMock = [
  {
    id: 1,
    aluno: "João Silva",
    plano: "Plano Mensal",
    dataInicio: "2026-04-01",
    dataFim: "2026-05-01",
    valor: 99.9,
    status: "Ativa",
  },
  {
    id: 2,
    aluno: "Maria Santos",
    plano: "Plano Trimestral",
    dataInicio: "2026-02-15",
    dataFim: "2026-05-15",
    valor: 269.9,
    status: "Ativa",
  },
  {
    id: 3,
    aluno: "Pedro Oliveira",
    plano: "Plano Anual",
    dataInicio: "2025-06-01",
    dataFim: "2026-06-01",
    valor: 899.9,
    status: "Vencendo",
  },
];

const planoInicial = {
  nome: "",
  descricao: "",
  duracao: "",
  valor: "",
  status: "Ativo",
  popular: false,
};

const matriculaInicial = {
  aluno: "",
  plano: "",
  dataInicio: "",
  dataFim: "",
  valor: "",
  status: "Ativa",
};

export default function Planos() {
  const [planos, setPlanos] = useState(planosMock);
  const [matriculas, setMatriculas] = useState(matriculasMock);
  const [busca, setBusca] = useState("");

  const [modalPlanoAberto, setModalPlanoAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState(null);
  const [dadosPlano, setDadosPlano] = useState(planoInicial);

  const [modalMatriculaAberto, setModalMatriculaAberto] = useState(false);
  const [matriculaEditando, setMatriculaEditando] = useState(null);
  const [dadosMatricula, setDadosMatricula] = useState(matriculaInicial);

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemExcluir, setItemExcluir] = useState(null);

  const matriculasFiltradas = useMemo(() => {
    return matriculas.filter((item) => {
      const termo = busca.toLowerCase();

      return (
        item.aluno.toLowerCase().includes(termo) ||
        item.plano.toLowerCase().includes(termo) ||
        item.status.toLowerCase().includes(termo)
      );
    });
  }, [busca, matriculas]);

  const totalPlanos = planos.length;
  const matriculasAtivas = matriculas.filter((m) => m.status === "Ativa").length;
  const vencendo = matriculas.filter((m) => m.status === "Vencendo").length;

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function iniciais(nome = "") {
    return nome
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function abrirNovoPlano() {
    setPlanoEditando(null);
    setDadosPlano(planoInicial);
    setModalPlanoAberto(true);
  }

  function abrirEditarPlano(plano) {
    setPlanoEditando(plano);
    setDadosPlano(plano);
    setModalPlanoAberto(true);
  }

  function salvarPlano() {
    if (planoEditando) {
      setPlanos((lista) =>
        lista.map((p) =>
          p.id === planoEditando.id
            ? {
                ...dadosPlano,
                id: planoEditando.id,
                valor: Number(dadosPlano.valor),
                duracao: Number(dadosPlano.duracao),
                alunosAtivos: planoEditando.alunosAtivos,
              }
            : p
        )
      );
    } else {
      setPlanos((lista) => [
        ...lista,
        {
          ...dadosPlano,
          id: Date.now(),
          valor: Number(dadosPlano.valor),
          duracao: Number(dadosPlano.duracao),
          alunosAtivos: 0,
        },
      ]);
    }

    setModalPlanoAberto(false);
  }

  function abrirNovaMatricula() {
    setMatriculaEditando(null);
    setDadosMatricula(matriculaInicial);
    setModalMatriculaAberto(true);
  }

  function abrirEditarMatricula(matricula) {
    setMatriculaEditando(matricula);
    setDadosMatricula(matricula);
    setModalMatriculaAberto(true);
  }

  function salvarMatricula() {
    if (matriculaEditando) {
      setMatriculas((lista) =>
        lista.map((m) =>
          m.id === matriculaEditando.id
            ? {
                ...dadosMatricula,
                id: matriculaEditando.id,
                valor: Number(dadosMatricula.valor),
              }
            : m
        )
      );
    } else {
      setMatriculas((lista) => [
        ...lista,
        {
          ...dadosMatricula,
          id: Date.now(),
          valor: Number(dadosMatricula.valor),
        },
      ]);
    }

    setModalMatriculaAberto(false);
  }

  function confirmarExclusao(tipo, item) {
    setItemExcluir({ tipo, item });
    setModalExcluirAberto(true);
  }

  function executarExclusao() {
    if (!itemExcluir) return;

    if (itemExcluir.tipo === "plano") {
      setPlanos((lista) => lista.filter((p) => p.id !== itemExcluir.item.id));
    }

    if (itemExcluir.tipo === "matricula") {
      setMatriculas((lista) =>
        lista.filter((m) => m.id !== itemExcluir.item.id)
      );
    }

    setModalExcluirAberto(false);
    setItemExcluir(null);
  }

  return (
    <div className="alunos-layout">
      <Sidebar />

      <main className="alunos-page">
        <header className="alunos-header">
          <div>
            <h1>Planos e Matrículas</h1>
            <p>Gerencie planos, valores e matrículas dos alunos</p>
          </div>

          <button className="btn btn--primary" onClick={abrirNovoPlano}>
            <Plus size={17} />
            Novo Plano
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card planos-stat-card">
            <div>
              <span>Total de Planos</span>
              <strong>{totalPlanos}</strong>
              <small className="positivo">Planos cadastrados</small>
            </div>
            <div className="stat-icon stat-blue">
              <CreditCard size={22} />
            </div>
          </article>

          <article className="stat-card planos-stat-card">
            <div>
              <span>Matrículas Ativas</span>
              <strong>{matriculasAtivas}</strong>
              <small className="positivo">Alunos matriculados</small>
            </div>
            <div className="stat-icon stat-green">
              <Users size={22} />
            </div>
          </article>

          <article className="stat-card planos-stat-card">
            <div>
              <span>Vencendo em breve</span>
              <strong>{vencendo}</strong>
              <small className="negativo">Requer atenção</small>
            </div>
            <div className="stat-icon stat-amber">
              <Calendar size={22} />
            </div>
          </article>

          <article className="stat-card planos-stat-card">
            <div>
              <span>Crescimento</span>
              <strong>+15%</strong>
              <small className="positivo">vs. mês anterior</small>
            </div>
            <div className="stat-icon stat-green">
              <TrendingUp size={22} />
            </div>
          </article>
        </section>

        <section className="planos-section">
          <div className="section-title-row">
            <div>
              <h2>Planos Disponíveis</h2>
              <p>Visualize e edite os planos da academia</p>
            </div>
          </div>

          <div className="planos-grid">
            {planos.map((plano) => (
              <article
                key={plano.id}
                className={`plano-card ${plano.popular ? "popular" : ""}`}
              >
                {plano.popular && (
                  <div className="popular-badge">
                    <Star size={12} />
                    Popular
                  </div>
                )}

                <div className="plano-card-top">
                  <div className="plano-icon">
                    <CreditCard size={20} />
                  </div>

                  <div className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => abrirEditarPlano(plano)}
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => confirmarExclusao("plano", plano)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3>{plano.nome}</h3>
                <p>{plano.descricao}</p>

                <div className="plano-preco">
                  {formatarMoeda(plano.valor)}
                  <span>/{plano.duracao} dias</span>
                </div>

                <div className="plano-info">
                  <span>{plano.alunosAtivos} alunos ativos</span>
                  <span className="badge status-ativo">{plano.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="alunos-content matriculas-content">
          <div className="matriculas-header">
            <div>
              <h2>Matrículas Recentes</h2>
              <p>Controle das matrículas vinculadas aos planos</p>
            </div>

            <div className="matriculas-actions">
              <div className="search-box matriculas-search">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Buscar matrícula..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <button className="btn btn--primary" onClick={abrirNovaMatricula}>
                <Plus size={17} />
                Nova Matrícula
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="alunos-table planos-table">
              <thead>
                <tr>
                  <th>Ações</th>
                  <th>Aluno</th>
                  <th>Plano</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {matriculasFiltradas.map((matricula) => (
                  <tr key={matricula.id}>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => abrirEditarMatricula(matricula)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() =>
                            confirmarExclusao("matricula", matricula)
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="student-cell">
                        <div className="avatar">{iniciais(matricula.aluno)}</div>
                        <span>{matricula.aluno}</span>
                      </div>
                    </td>

                    <td>
                      <span className="badge plano-mensal">
                        {matricula.plano}
                      </span>
                    </td>

                    <td>{formatarData(matricula.dataInicio)}</td>
                    <td>{formatarData(matricula.dataFim)}</td>
                    <td>
                      <strong className="valor-cell">
                        {formatarMoeda(matricula.valor)}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          matricula.status === "Ativa"
                            ? "status-ativo"
                            : "status-inadimplente"
                        }`}
                      >
                        {matricula.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {modalPlanoAberto && (
        <div className="modal-overlay">
          <div className="modal modal-form">
            <div className="modal-header">
              <h2>
                <CreditCard size={18} />
                {planoEditando ? "Editar Plano" : "Novo Plano"}
              </h2>

              <button
                className="modal-close"
                onClick={() => setModalPlanoAberto(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-grid">
              <div className="input-group input-full">
                <label>Nome do plano *</label>
                <input
                  value={dadosPlano.nome}
                  onChange={(e) =>
                    setDadosPlano({ ...dadosPlano, nome: e.target.value })
                  }
                  placeholder="Ex: Plano Mensal"
                />
              </div>

              <div className="input-group input-full">
                <label>Descrição</label>
                <input
                  value={dadosPlano.descricao}
                  onChange={(e) =>
                    setDadosPlano({
                      ...dadosPlano,
                      descricao: e.target.value,
                    })
                  }
                  placeholder="Ex: Acesso livre por 30 dias"
                />
              </div>

              <div className="input-group">
                <label>Duração em dias *</label>
                <input
                  type="number"
                  value={dadosPlano.duracao}
                  onChange={(e) =>
                    setDadosPlano({ ...dadosPlano, duracao: e.target.value })
                  }
                  placeholder="30"
                />
              </div>

              <div className="input-group">
                <label>Valor *</label>
                <input
                  type="number"
                  value={dadosPlano.valor}
                  onChange={(e) =>
                    setDadosPlano({ ...dadosPlano, valor: e.target.value })
                  }
                  placeholder="99.90"
                />
              </div>

              <div className="input-group">
                <label>Status</label>
                <select
                  value={dadosPlano.status}
                  onChange={(e) =>
                    setDadosPlano({ ...dadosPlano, status: e.target.value })
                  }
                >
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={dadosPlano.popular}
                  onChange={(e) =>
                    setDadosPlano({
                      ...dadosPlano,
                      popular: e.target.checked,
                    })
                  }
                />
                Marcar como popular
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setModalPlanoAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn--primary" onClick={salvarPlano}>
                {planoEditando ? "Salvar alterações" : "Cadastrar plano"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMatriculaAberto && (
        <div className="modal-overlay">
          <div className="modal modal-form">
            <div className="modal-header">
              <h2>
                <Users size={18} />
                {matriculaEditando ? "Editar Matrícula" : "Nova Matrícula"}
              </h2>

              <button
                className="modal-close"
                onClick={() => setModalMatriculaAberto(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-grid">
              <div className="input-group input-full">
                <label>Aluno *</label>
                <input
                  value={dadosMatricula.aluno}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      aluno: e.target.value,
                    })
                  }
                  placeholder="Nome do aluno"
                />
              </div>

              <div className="input-group">
                <label>Plano *</label>
                <select
                  value={dadosMatricula.plano}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      plano: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione</option>
                  {planos.map((plano) => (
                    <option key={plano.id} value={plano.nome}>
                      {plano.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Valor *</label>
                <input
                  type="number"
                  value={dadosMatricula.valor}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      valor: e.target.value,
                    })
                  }
                  placeholder="99.90"
                />
              </div>

              <div className="input-group">
                <label>Data início *</label>
                <input
                  type="date"
                  value={dadosMatricula.dataInicio}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      dataInicio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Data fim *</label>
                <input
                  type="date"
                  value={dadosMatricula.dataFim}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      dataFim: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group input-full">
                <label>Status</label>
                <select
                  value={dadosMatricula.status}
                  onChange={(e) =>
                    setDadosMatricula({
                      ...dadosMatricula,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Ativa</option>
                  <option>Vencendo</option>
                  <option>Cancelada</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setModalMatriculaAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn--primary" onClick={salvarMatricula}>
                {matriculaEditando ? "Salvar alterações" : "Cadastrar matrícula"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalExcluirAberto && itemExcluir && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>
                <Trash2 size={18} />
                Excluir Registro
              </h2>

              <button
                className="modal-close"
                onClick={() => setModalExcluirAberto(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="alert-box">
              <AlertTriangle size={20} />
              <div>
                <strong>Atenção!</strong>
                <p>Esta ação não poderá ser desfeita.</p>
              </div>
            </div>

            <p className="delete-question">
              Deseja excluir{" "}
              <strong>{itemExcluir.item.nome || itemExcluir.item.aluno}</strong>?
            </p>

            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setModalExcluirAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn--danger" onClick={executarExclusao}>
                Excluir permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
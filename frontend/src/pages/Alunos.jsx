import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import ModalCadastroPessoa from "../components/ModalCadastroPessoa";
import ModalPerfil from "../components/ModalPerfil";
import "../styles/alunos.css";
import "../styles/globals.css";

import {
  Plus,
  Search,
  Users,
  TrendingUp,
  CircleX,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
} from "lucide-react";

const API = "http://localhost:3002/api/pessoas";

const alunoInicial = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dataNascimento: "",
  endereco: "",
  plano_id: "",
  status: "Ativo",
  matricula: "",
  senha: "",
};

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [busca, setBusca] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    novosMes: 0,
    cancelamentos: 0,
    crescimento: 0,
  });

  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [novoAluno, setNovoAluno] = useState(alunoInicial);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [senhaVisivelId, setSenhaVisivelId] = useState(null);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [alunoExcluindo, setAlunoExcluindo] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [alunosRes, totalRes, planosRes] = await Promise.all([
        fetch(`${API}?tipo=aluno`),
        fetch(`${API}/total-alunos`),
        fetch(`${API}/planos`),
      ]);

      const alunosData = await alunosRes.json();
      const totalData = await totalRes.json();
      const planosData = await planosRes.json();

      setAlunos(Array.isArray(alunosData) ? alunosData : []);
      setPlanos(Array.isArray(planosData) ? planosData : []);

      setStats((prev) => ({
        ...prev,
        total: totalData.totalAlunos || 0,
      }));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setAlunos([]);
      setPlanos([]);
    }
  }

  async function recarregarAlunos() {
    try {
      const res = await fetch(`${API}?tipo=aluno`);
      const data = await res.json();
      setAlunos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao recarregar alunos:", err);
      setAlunos([]);
    }
  }

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        (aluno.nome || "").toLowerCase().includes(termo) ||
        (aluno.cpf || "").includes(busca) ||
        (aluno.email || "").toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "Todos" || aluno.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    });
  }, [alunos, busca, filtroStatus]);

  async function salvarNovoAluno() {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAluno),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Erro ao salvar aluno");
        return;
      }

      alert("Aluno cadastrado com sucesso!");
      await recarregarAlunos();

      setNovoAluno(alunoInicial);
      setModalAdicionarAberto(false);
    } catch (error) {
      console.error(error.response?.data || error);

      if (error.response?.data?.erro?.includes("pessoa_cpf_key")) {
        alert("Já existe uma pessoa cadastrada com este CPF.");
        return;
      }

      alert("Já existe uma pessoa cadastrada com este CPF.");
    }
  }

  function abrirEdicao(aluno) {
    setAlunoEditando({ ...aluno });
    setModalEditarAberto(true);
  }

  async function salvarEdicao() {
    if (!alunoEditando) return;

    try {
      const res = await fetch(`${API}/${alunoEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: alunoEditando.nome,
          cpf: alunoEditando.cpf,
          telefone: alunoEditando.telefone,
          email: alunoEditando.email,
          dataNascimento:
            alunoEditando.dataNascimento || alunoEditando.data_nascimento,
          endereco: alunoEditando.endereco,
          status:
            alunoEditando.status_assinatura ||
            alunoEditando.status,
          plano_id: alunoEditando.plano_id,
          senha: alunoEditando.senha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Erro ao editar aluno");
        return;
      }

      await recarregarAlunos();
      setModalEditarAberto(false);
      setAlunoEditando(null);
    } catch (err) {
      console.error("Erro ao editar aluno:", err);
      alert("Erro de conexão com o servidor");
    }
  }

  function abrirExclusao(aluno) {
    setAlunoExcluindo(aluno);
    setModalExcluirAberto(true);
  }

  async function confirmarExclusao() {
    if (!alunoExcluindo) return;

    try {
      const res = await fetch(`${API}/${alunoExcluindo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const erro = await res.json();
        console.error("Erro ao excluir aluno:", erro);
        alert(erro.erro || "Erro ao excluir aluno");
        return;
      }

      setAlunos((lista) => lista.filter((a) => a.id !== alunoExcluindo.id));
      setModalExcluirAberto(false);
      setAlunoExcluindo(null);
    } catch (err) {
      console.error("Erro ao excluir aluno:", err);
      alert("Erro de conexão com o servidor");
    }
  }

  function formatarData(data) {
    if (!data) return "-";
    if (data.includes("/")) return data;

    const [ano, mes, dia] = data.split("-");
    if (!ano || !mes || !dia) return data;

    return `${dia}/${mes}/${ano}`;
  }

  function iniciais(nome = "") {
    return nome
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="alunos-layout">
      <Sidebar />

      <main className="alunos-page">
        <header className="alunos-header">
          <div>
            <h1>Gestão de Alunos</h1>
            <p>Cadastro e controle dos alunos da academia</p>
          </div>

          <button
            className="btn btn--primary"
            onClick={() => setModalAdicionarAberto(true)}
          >
            <Plus size={17} />
            Novo Aluno
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon stat-blue">
              <Users size={22} />
            </div>
            <div>
              <span>Total de Alunos</span>
              <strong>{stats.total}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-green">
              <TrendingUp size={22} />
            </div>
            <div>
              <span>Novos este mês</span>
              <strong>{stats.novosMes}</strong>
              <small className="positivo">↑ 12% vs. mês anterior</small>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-red">
              <CircleX size={22} />
            </div>
            <div>
              <span>Cancelamentos</span>
              <strong>{stats.cancelamentos}</strong>
              <small className="negativo">↑ 50% vs. mês anterior</small>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon stat-green">
              <TrendingUp size={22} />
            </div>
            <div>
              <span>Taxa de Crescimento</span>
              <strong>+{stats.crescimento}%</strong>
              <small className="positivo">↑ 8% vs. mês anterior</small>
            </div>
          </article>
        </section>

        <section className="alunos-content">
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar aluno por nome, CPF ou e-mail..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="filters">
              {["Todos", "Ativo", "Inadimplente", "Cancelado"].map(
                (status) => (
                  <button
                    key={status}
                    className={filtroStatus === status ? "active" : ""}
                    onClick={() => setFiltroStatus(status)}
                  >
                    {status === "Ativo" ? "Ativos" : status}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="alunos-table">
              <thead>
                <tr>
                  <th>Ações</th>
                  <th>Aluno</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Data Nascimento</th>
                  <th>Endereço</th>
                  <th>Plano</th>
                  <th>Status</th>
                  <th>Matrícula</th>
                  <th>Senha</th>
                </tr>
              </thead>

              <tbody>
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>
                      <div className="table-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => abrirEdicao(aluno)}
                          title="Editar aluno"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => abrirExclusao(aluno)}
                          title="Excluir aluno"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="student-cell">
                        <div className="avatar">{iniciais(aluno.nome)}</div>
                        <span>{aluno.nome}</span>
                      </div>
                    </td>

                    <td>{aluno.cpf}</td>
                    <td>{aluno.telefone}</td>
                    <td>{aluno.email}</td>
                    <td>
                      {formatarData(
                        aluno.dataNascimento || aluno.data_nascimento
                      )}
                    </td>
                    <td className="address-cell">{aluno.endereco}</td>

                    <td>
                      <span
                        className={`badge plano-${(
                          aluno.plano || ""
                        ).toLowerCase()}`}
                      >
                        {aluno.plano || "-"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge status-${(
                          aluno.status || ""
                        ).toLowerCase()}`}
                      >
                        {aluno.status || "-"}
                      </span>
                    </td>

                    <td>{formatarData(aluno.matricula)}</td>

                    <td>
                      <div className="password-cell">
                        <span>
                          {senhaVisivelId === aluno.id
                            ? aluno.senha || ""
                            : "••••••••"}
                        </span>

                        <button
                          className="btn-eye"
                          onClick={() =>
                            setSenhaVisivelId(
                              senhaVisivelId === aluno.id ? null : aluno.id
                            )
                          }
                        >
                          {senhaVisivelId === aluno.id ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Mostrando 1 a {alunosFiltrados.length} de {alunos.length} alunos
            </span>

            <div className="pagination">
              <button>‹</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>...</button>
              <button>50</button>
              <button>›</button>
            </div>
          </footer>
        </section>
      </main>

      {modalAdicionarAberto && (
        <ModalCadastroPessoa
          titulo="Novo Aluno"
          dados={novoAluno}
          setDados={setNovoAluno}
          onClose={() => setModalAdicionarAberto(false)}
          onSave={salvarNovoAluno}
          textoBotao="Salvar"
          mostrarPlano={true}
          mostrarCargo={false}
          planos={planos}
        />
      )}

      {modalEditarAberto && alunoEditando && (
        <div className="modal-overlay">
          <div className="modal modal-form">
            <div className="modal-header">
              <h2>
                <Pencil size={18} />
                Editar Aluno
              </h2>

              <button
                className="modal-close"
                onClick={() => setModalEditarAberto(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-grid">
              <div className="input-group">
                <label>Nome completo *</label>
                <input
                  value={alunoEditando.nome || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      nome: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>CPF *</label>
                <input
                  value={alunoEditando.cpf || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      cpf: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  value={alunoEditando.email || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Telefone *</label>
                <input
                  value={alunoEditando.telefone || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      telefone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Data de nascimento *</label>
                <input
                  type="date"
                  value={
                    alunoEditando.dataNascimento ||
                    alunoEditando.data_nascimento ||
                    ""
                  }
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      dataNascimento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Endereço *</label>
                <input
                  value={alunoEditando.endereco || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      endereco: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Plano *</label>
                <select
                  value={alunoEditando.plano_id || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      plano_id: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione um plano</option>
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome_plano}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Status *</label>
                <select
                  value={alunoEditando.status_assinatura || alunoEditando.status || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      status_assinatura: e.target.value,
                    })
                  }
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inadimplente">Inadimplente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="input-group input-full">
                <label>Senha</label>
                <input
                  type="password"
                  value={alunoEditando.senha || ""}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      senha: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setModalEditarAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn--primary" onClick={salvarEdicao}>
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalExcluirAberto && alunoExcluindo && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>
                <Trash2 size={18} />
                Excluir Aluno
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

            <p className="delete-question">Deseja excluir este aluno?</p>

            <div className="delete-info">
              <strong>{alunoExcluindo.nome}</strong>
              <div>
                <span>CPF: {alunoExcluindo.cpf}</span>
                <span>Plano: {alunoExcluindo.plano || "-"}</span>
                <span>Status: {alunoExcluindo.status_assinatura || "-"}</span>
                <span>Matrícula: {alunoExcluindo.matricula}</span>
                <span>
                  Nascimento:{" "}
                  {formatarData(
                    alunoExcluindo.dataNascimento ||
                    alunoExcluindo.data_nascimento
                  )}
                </span>
                <span>E-mail: {alunoExcluindo.email}</span>
                <span>Telefone: {alunoExcluindo.telefone}</span>
                <span>Endereço: {alunoExcluindo.endereco}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn--outline"
                onClick={() => setModalExcluirAberto(false)}
              >
                Cancelar
              </button>

              <button className="btn btn--danger" onClick={confirmarExclusao}>
                Excluir aluno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import ModalCadastroPessoa from "../components/ModalCadastroPessoa";
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

const alunoInicial = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dataNascimento: "",
  endereco: "",
  plano: "",
  status: "Ativo",
  matricula: "",
  senha: "",
};

export default function Alunos() {
  const [stats] = useState({
    total: 248,
    novosMes: 18,
    cancelamentos: 3,
    crescimento: 12,
  });

  const [alunos, setAlunos] = useState([
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-1111",
      email: "maria@email.com",
      dataNascimento: "1990-04-15",
      endereco: "Rua das Flores, 123 São Paulo - SP",
      plano: "Mensal",
      status: "Ativo",
      matricula: "15/02/2024",
      senha: "123456",
    },
    {
      id: 2,
      nome: "João Santos",
      cpf: "234.567.890-11",
      telefone: "(11) 99999-2222",
      email: "joao@email.com",
      dataNascimento: "1988-07-22",
      endereco: "Av. Brasil, 456 São Paulo - SP",
      plano: "Trimestral",
      status: "Ativo",
      matricula: "10/01/2024",
      senha: "123456",
    },
    {
      id: 3,
      nome: "Ana Costa",
      cpf: "345.678.901-22",
      telefone: "(11) 99999-3333",
      email: "ana@email.com",
      dataNascimento: "1992-03-30",
      endereco: "Rua Augusta, 789 São Paulo - SP",
      plano: "Anual",
      status: "Inadimplente",
      matricula: "20/12/2023",
      senha: "123456",
    },
    {
      id: 4,
      nome: "Pedro Lima",
      cpf: "456.789.012-33",
      telefone: "(11) 99999-4444",
      email: "pedro@email.com",
      dataNascimento: "1987-11-10",
      endereco: "Rua São João, 321 São Paulo - SP",
      plano: "Mensal",
      status: "Cancelado",
      matricula: "05/11/2023",
      senha: "123456",
    },
    {
      id: 5,
      nome: "Carlos Souza",
      cpf: "567.890.123-44",
      telefone: "(11) 99999-5555",
      email: "carlos@email.com",
      dataNascimento: "1991-06-05",
      endereco: "Av. Paulista, 1000 São Paulo - SP",
      plano: "Trimestral",
      status: "Ativo",
      matricula: "25/10/2023",
      senha: "123456",
    },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [novoAluno, setNovoAluno] = useState(alunoInicial);

  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [senhaVisivelId, setSenhaVisivelId] = useState(null);

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [alunoExcluindo, setAlunoExcluindo] = useState(null);

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.cpf.includes(busca) ||
        aluno.email.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "Todos" || aluno.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    });
  }, [alunos, busca, filtroStatus]);

  function salvarNovoAluno() {
    if (
      !novoAluno.nome ||
      !novoAluno.cpf ||
      !novoAluno.telefone ||
      !novoAluno.email ||
      !novoAluno.dataNascimento ||
      !novoAluno.endereco ||
      !novoAluno.plano ||
      !novoAluno.senha
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const aluno = {
      ...novoAluno,
      id: Date.now(),
      matricula: new Date().toLocaleDateString("pt-BR"),
    };

    setAlunos((listaAtual) => [...listaAtual, aluno]);
    setNovoAluno(alunoInicial);
    setModalAdicionarAberto(false);
  }

  function abrirEdicao(aluno) {
    setAlunoEditando({ ...aluno });
    setModalEditarAberto(true);
  }

  function salvarEdicao() {
    if (!alunoEditando) return;

    setAlunos((listaAtual) =>
      listaAtual.map((aluno) =>
        aluno.id === alunoEditando.id ? alunoEditando : aluno,
      ),
    );

    setAlunoEditando(null);
    setModalEditarAberto(false);
  }

  function abrirExclusao(aluno) {
    setAlunoExcluindo(aluno);
    setModalExcluirAberto(true);
  }

  function confirmarExclusao() {
    if (!alunoExcluindo) return;

    setAlunos((listaAtual) =>
      listaAtual.filter((aluno) => aluno.id !== alunoExcluindo.id),
    );

    setAlunoExcluindo(null);
    setModalExcluirAberto(false);
  }

  function formatarData(data) {
    if (!data) return "-";

    if (data.includes("/")) return data;

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function iniciais(nome) {
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
              {["Todos", "Ativo", "Inadimplente", "Cancelado"].map((status) => (
                <button
                  key={status}
                  className={filtroStatus === status ? "active" : ""}
                  onClick={() => setFiltroStatus(status)}
                >
                  {status === "Ativo" ? "Ativos" : status}
                </button>
              ))}
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
                    <td>{formatarData(aluno.dataNascimento)}</td>
                    <td className="address-cell">{aluno.endereco}</td>

                    <td>
                      <span
                        className={`badge plano-${aluno.plano.toLowerCase()}`}
                      >
                        {aluno.plano}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge status-${aluno.status.toLowerCase()}`}
                      >
                        {aluno.status}
                      </span>
                    </td>

                    <td>{aluno.matricula}</td>

                    <td>
                      <div className="password-cell">
                        <span>
                          {senhaVisivelId === aluno.id
                            ? aluno.senha
                            : "••••••••"}
                        </span>

                        <button
                          className="btn-eye"
                          onClick={() =>
                            setSenhaVisivelId(
                              senhaVisivelId === aluno.id ? null : aluno.id,
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
                  value={alunoEditando.nome}
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
                  value={alunoEditando.cpf}
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
                  value={alunoEditando.email}
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
                  value={alunoEditando.telefone}
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
                  value={alunoEditando.dataNascimento}
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
                  value={alunoEditando.endereco}
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
                  value={alunoEditando.plano}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      plano: e.target.value,
                    })
                  }
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div className="input-group">
                <label>Status *</label>
                <select
                  value={alunoEditando.status}
                  onChange={(e) =>
                    setAlunoEditando({
                      ...alunoEditando,
                      status: e.target.value,
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
                  value={alunoEditando.senha}
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
                <span>Plano: {alunoExcluindo.plano}</span>
                <span>Status: {alunoExcluindo.status}</span>
                <span>Matrícula: {alunoExcluindo.matricula}</span>
                <span>
                  Nascimento: {formatarData(alunoExcluindo.dataNascimento)}
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

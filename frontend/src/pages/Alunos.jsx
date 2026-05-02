import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import "../styles/alunos.css";
import { Users, UserCheck, AlertCircle, UserX } from "lucide-react";

export default function Alunos() {
  const [alunos, setAlunos] = useState([
    {
      nome: "João",
      cpf: "000.000.000-00",
      telefone: "(43) 99999-0000",
      plano: "Mensal",
      status: "ativo",
    },
    {
      nome: "Maria",
      cpf: "111.111.111-11",
      telefone: "(43) 98888-1111",
      plano: "Trimestral",
      status: "inadimplente",
    },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // MODAL CADASTRO
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    plano: "",
  });

  // 🔥 MODAL EDIÇÃO (NOVO)
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [indexEditando, setIndexEditando] = useState(null);

  const abrirModal = () => setMostrarModal(true);

  const fecharModal = () => {
    setMostrarModal(false);
    setNovoAluno({ nome: "", cpf: "", telefone: "", plano: "" });
  };

  // 🔥 ABRIR MODAL DE EDIÇÃO
  const abrirModalEdicao = (index) => {
    setAlunoEditando({ ...alunos[index] });
    setIndexEditando(index);
    setMostrarModalEdicao(true);
  };

  const fecharModalEdicao = () => {
    setMostrarModalEdicao(false);
    setAlunoEditando(null);
    setIndexEditando(null);
  };

  // FORMATADORES
  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatarTelefone = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2")
      .slice(0, 15);
  };

  const salvarAluno = () => {
    const { nome, cpf, telefone, plano } = novoAluno;

    if (!nome || !cpf || !telefone || !plano) return;

    const novo = {
      nome,
      cpf,
      telefone,
      plano,
      status: "ativo",
    };

    setAlunos([...alunos, novo]);
    fecharModal();
  };

  // 🔥 SALVAR EDIÇÃO
  const salvarEdicao = () => {
    const lista = [...alunos];
    lista[indexEditando] = alunoEditando;
    setAlunos(lista);
    fecharModalEdicao();
  };

  // ALTERAR STATUS COM CLIQUE
  const alterarStatus = (index) => {
    const lista = [...alunos];

    const ordem = ["ativo", "inadimplente", "cancelado"];
    const atual = lista[index].status;

    const proximoIndex = (ordem.indexOf(atual) + 1) % ordem.length;
    lista[index].status = ordem[proximoIndex];

    setAlunos(lista);
  };

  // FILTRO COMPLETO
  const alunosFiltrados = alunos.filter((a) => {
    const matchBusca =
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.cpf.includes(busca);

    const matchStatus =
      filtroStatus === "todos" || a.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  // MÉTRICAS
  const total = alunos.length;
  const ativos = alunos.filter((a) => a.status === "ativo").length;
  const inadimplentes = alunos.filter(
    (a) => a.status === "inadimplente"
  ).length;
  const cancelados = alunos.filter(
    (a) => a.status === "cancelado"
  ).length;

  return (
    <div className="app-container">
      <Sidebar />

      <div className="container">
        <div className="gst-aln">
          <div>
            <h1 className="titulo">Gestão de Alunos</h1>
            <p className="subtitulo">Cadastro e controle de alunos</p>
          </div>

          <button className="botao-cadastrar" onClick={abrirModal}>
            + Cadastrar Aluno
          </button>
        </div>

        <div className="cards-container">
          <div className="card">
            <div className="card-top">
              <h3>Total de Alunos</h3>
              <div className="icon blue">
                <Users size={18} />
              </div>
            </div>
            <p>{total}</p>
          </div>

          <div className="card">
            <div className="card-top">
              <h3>Ativos</h3>
              <div className="icon green">
                <UserCheck size={18} />
              </div>
            </div>
            <p>{ativos}</p>
          </div>

          <div className="card">
            <div className="card-top">
              <h3>Inadimplentes</h3>
              <div className="icon yellow">
                <AlertCircle size={18} />
              </div>
            </div>
            <p>{inadimplentes}</p>
          </div>

          <div className="card">
            <div className="card-top">
              <h3>Cancelados</h3>
              <div className="icon red">
                <UserX size={18} />
              </div>
            </div>
            <p>{cancelados}</p>
          </div>
        </div>

        <hr className="linha" />

        <div className="acoes">
          <input
            className="input-busca"
            placeholder="Buscar aluno por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="filtros">
            <button className={filtroStatus === "todos" ? "ativo" : ""} onClick={() => setFiltroStatus("todos")}>Todos</button>
            <button className={filtroStatus === "ativo" ? "ativo" : ""} onClick={() => setFiltroStatus("ativo")}>Ativos</button>
            <button className={filtroStatus === "inadimplente" ? "ativo" : ""} onClick={() => setFiltroStatus("inadimplente")}>Inadimplentes</button>
            <button className={filtroStatus === "cancelado" ? "ativo" : ""} onClick={() => setFiltroStatus("cancelado")}>Cancelados</button>
          </div>
        </div>

        <hr className="linha" />

        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Ações</th> {/* NOVO */}
            </tr>
          </thead>

          <tbody>
            {alunosFiltrados.map((aluno, index) => (
              <tr key={index}>
                <td>{aluno.nome}</td>
                <td>{aluno.cpf}</td>
                <td>{aluno.telefone}</td>

                <td>
                  <span className={`plano ${aluno.plano.toLowerCase()}`}>
                    {aluno.plano}
                  </span>
                </td>

                <td>
                  <span
                    className={`status ${aluno.status}`}
                    onClick={() => alterarStatus(index)}
                  >
                    {aluno.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn-acoes"
                    onClick={() => abrirModalEdicao(index)}
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CADASTRO */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Cadastrar Aluno</h2>
              <button className="fechar" onClick={fecharModal}>✕</button>
            </div>

            <div className="modal-body">
              <input placeholder="Nome" value={novoAluno.nome} onChange={(e)=>setNovoAluno({...novoAluno,nome:e.target.value})}/>
              <input placeholder="CPF" value={novoAluno.cpf} onChange={(e)=>setNovoAluno({...novoAluno,cpf:formatarCPF(e.target.value)})}/>
              <input placeholder="Telefone" value={novoAluno.telefone} onChange={(e)=>setNovoAluno({...novoAluno,telefone:formatarTelefone(e.target.value)})}/>
              <select value={novoAluno.plano} onChange={(e)=>setNovoAluno({...novoAluno,plano:e.target.value})}>
                <option value="">Selecione</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn salvar" onClick={salvarAluno}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL EDIÇÃO */}
      {mostrarModalEdicao && alunoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Editar Aluno</h2>
              <button className="fechar" onClick={fecharModalEdicao}>✕</button>
            </div>

            <div className="modal-body">
              <input value={alunoEditando.nome} onChange={(e)=>setAlunoEditando({...alunoEditando,nome:e.target.value})}/>
              <input value={alunoEditando.cpf} onChange={(e)=>setAlunoEditando({...alunoEditando,cpf:formatarCPF(e.target.value)})}/>
              <input value={alunoEditando.telefone} onChange={(e)=>setAlunoEditando({...alunoEditando,telefone:formatarTelefone(e.target.value)})}/>
              <select value={alunoEditando.plano} onChange={(e)=>setAlunoEditando({...alunoEditando,plano:e.target.value})}>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn salvar" onClick={salvarEdicao}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
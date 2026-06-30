import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import {
  listarAcessos,
  registrarEntrada,
  registrarSaida,
} from "../services/acessoService";
import "../styles/controleAcesso.css";

import {
  Users,
  LogIn,
  LogOut,
  ShieldX,
  Search,
} from "lucide-react";

function isDataHoje(valor) {
  if (!valor) {
    return false;
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return false;
  }

  const hoje = new Date();

  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

function formatarDataHora(valor) {
  if (!valor) {
    return "-";
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "-";
  }

  const preencher = (numero) => String(numero).padStart(2, "0");
  const horario = [
    preencher(data.getHours()),
    preencher(data.getMinutes()),
    preencher(data.getSeconds()),
  ].join(":");
  const dataFormatada = [
    preencher(data.getDate()),
    preencher(data.getMonth() + 1),
    data.getFullYear(),
  ].join("/");

  return `${horario} ${dataFormatada}`;
}

export default function ControleAcesso() {
  const [busca, setBusca] = useState("");
  const [filtroCard, setFiltroCard] = useState("todos");
  const [acessos, setAcessos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  const totalNaAcademia = acessos.filter(
    (acesso) => acesso.status === "Na academia"
  ).length;
  const totalEntradasHoje = acessos.filter(
    (acesso) =>
      acesso.tipo_acesso === "entrada" &&
      isDataHoje(acesso.data_hora_acesso)
  ).length;
  const totalSaidasHoje = acessos.filter(
    (acesso) => acesso.hora_saida && isDataHoje(acesso.hora_saida)
  ).length;
  const totalBloqueadosHoje = acessos.filter(
    (acesso) =>
      acesso.tipo_acesso === "bloqueado" &&
      isDataHoje(acesso.data_hora_acesso)
  ).length;

  async function carregarAcessos() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await listarAcessos();
      setAcessos(dados);
    } catch (error) {
      setErro(
        error.response?.data?.erro ||
        error.message ||
        "Erro ao carregar acessos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAcessos();
  }, []);

  async function handleEntrada() {
    if (!busca.trim()) {
      setMensagem("");
      setErroAcao("Informe um CPF.");
      return;
    }

    try {
      setProcessando(true);
      setMensagem("");
      setErroAcao("");

      const resultado = await registrarEntrada(busca);
      setMensagem(resultado.mensagem || "Entrada registrada com sucesso.");
    } catch (error) {
      setErroAcao(
        error.response?.data?.erro ||
        error.message ||
        "Erro ao registrar entrada."
      );
    } finally {
      await carregarAcessos();
      setProcessando(false);
    }
  }

  async function handleSaida() {
    if (!busca.trim()) {
      setMensagem("");
      setErroAcao("Informe um CPF.");
      return;
    }

    try {
      setProcessando(true);
      setMensagem("");
      setErroAcao("");

      const resultado = await registrarSaida(busca);
      setMensagem(resultado.mensagem || "Saída registrada com sucesso.");
    } catch (error) {
      setErroAcao(
        error.response?.data?.erro ||
        error.message ||
        "Erro ao registrar saída."
      );
    } finally {
      await carregarAcessos();
      setProcessando(false);
    }
  }

  function iniciais(nome) {
    return nome
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function classeStatus(status) {
    if (status === "Liberado") {
      return "status-liberado";
    }

    if (status === "Bloqueado") {
      return "status-bloqueado";
    }

    return "status-academia";
  }

  return (
    <div className="acesso-layout">
      <Sidebar />

      <main className="acesso-page">

        <header className="acesso-header">
          <div>
            <h1>Controle de Acesso</h1>
            <p>Registro de entrada e saída (Catraca)</p>
          </div>
        </header>

        {/* CARDS */}

        <section className="stats-grid">

          <article
            className={`stat-card card-blue ${
              filtroCard === "academia" ? "ativo" : ""
            }`}
            onClick={() => setFiltroCard("academia")}
          >
            <div>
              <span>Na Academia</span>
              <strong>{totalNaAcademia}</strong>
              <small>Alunos presentes</small>
            </div>

            <div className="stat-icon blue">
              <Users size={22} />
            </div>
          </article>

          <article
            className={`stat-card card-green ${
              filtroCard === "entrada" ? "ativo" : ""
            }`}
            onClick={() => setFiltroCard("entrada")}
          >
            <div>
              <span>Entradas Hoje</span>
              <strong>{totalEntradasHoje}</strong>
              <small>Total registrado</small>
            </div>

            <div className="stat-icon green">
              <LogIn size={22} />
            </div>
          </article>

          <article
            className={`stat-card card-gray ${
              filtroCard === "saida" ? "ativo" : ""
            }`}
            onClick={() => setFiltroCard("saida")}
          >
            <div>
              <span>Saídas Hoje</span>
              <strong>{totalSaidasHoje}</strong>
              <small>Total registrado</small>
            </div>

            <div className="stat-icon gray">
              <LogOut size={22} />
            </div>
          </article>

          <article
            className={`stat-card card-red ${
              filtroCard === "bloqueado" ? "ativo" : ""
            }`}
            onClick={() => setFiltroCard("bloqueado")}
          >
            <div>
              <span>Bloqueados</span>
              <strong>{totalBloqueadosHoje}</strong>
              <small>Tentativas negadas</small>
            </div>

            <div className="stat-icon red">
              <ShieldX size={22} />
            </div>
          </article>

        </section>

        {/* SIMULADOR */}

        <section className="catraca-card">

          <div className="catraca-header">
            <h3>Simulador de Catraca</h3>
            <p>Digite o CPF ou passe o cartão</p>
          </div>

          <div className="catraca-form">

            <input
              type="text"
              placeholder="Digite o CPF ou código do cartão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <button
              className="btn-entrada"
              onClick={handleEntrada}
              disabled={processando}
            >
              Entrada
            </button>

            <button
              className="btn-saida"
              onClick={handleSaida}
              disabled={processando}
            >
              Saída
            </button>

          </div>

          {mensagem && <p>{mensagem}</p>}
          {erroAcao && <p>{erroAcao}</p>}

        </section>

        {/* TABELA */}

        <section className="tabela-card">

          <div className="tabela-header">

            <h3>Registro de Acessos</h3>

            <div className="search-box">

              <Search size={16} />

              <input
                type="text"
                placeholder="Buscar aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />

            </div>

          </div>

          <div className="tabela-acoes">

            <button
              className="btn-reset"
              onClick={() => setFiltroCard("todos")}
            >
              Mostrar Todos
            </button>

          </div>

          <table className="acessos-table">

            <thead>
              <tr>
                <th>Aluno</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {carregando ? (
                <tr>
                  <td colSpan="4">Carregando...</td>
                </tr>
              ) : erro ? (
                <tr>
                  <td colSpan="4">{erro}</td>
                </tr>
              ) : acessos.length === 0 ? (
                <tr>
                  <td colSpan="4">Nenhum acesso encontrado.</td>
                </tr>
              ) : (
                acessos.map((acesso) => (
                  <tr key={acesso.id}>

                    <td>
                      <div className="aluno-cell">

                        <div className="avatar">
                          {iniciais(acesso.aluno)}
                        </div>

                        <span>{acesso.aluno}</span>

                      </div>
                    </td>

                    <td>{formatarDataHora(acesso.hora_entrada)}</td>

                    <td>{formatarDataHora(acesso.hora_saida)}</td>

                    <td>

                      <span
                        className={`status-badge ${classeStatus(
                          acesso.status
                        )}`}
                      >
                        {acesso.status}
                      </span>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </section>

      </main>
    </div>
  );
}

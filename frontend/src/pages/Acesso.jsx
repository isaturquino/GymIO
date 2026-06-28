import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import "../styles/controleAcesso.css";

import {
  Users,
  LogIn,
  LogOut,
  ShieldX,
  Search,
} from "lucide-react";

export default function ControleAcesso() {
  const [busca, setBusca] = useState("");
  const [filtroCard, setFiltroCard] = useState("todos");

  const acessos = [
    {
      id: 1,
      nome: "Maria Silva",
      entrada: "08:15",
      saida: "09:45",
      status: "Liberado",
    },
    {
      id: 2,
      nome: "João Santos",
      entrada: "09:30",
      saida: "11:00",
      status: "Liberado",
    },
    {
      id: 3,
      nome: "Ana Costa",
      entrada: "10:00",
      saida: "---",
      status: "Na academia",
    },
    {
      id: 4,
      nome: "Pedro Lima",
      entrada: "10:15",
      saida: "---",
      status: "Bloqueado",
    },
    {
      id: 5,
      nome: "Carlos Souza",
      entrada: "07:00",
      saida: "08:30",
      status: "Liberado",
    },
    {
      id: 6,
      nome: "Lucia Ferreira",
      entrada: "11:30",
      saida: "---",
      status: "Na academia",
    },
  ];

  const dadosFiltrados = acessos.filter((item) => {
    const correspondeBusca = item.nome
      .toLowerCase()
      .includes(busca.toLowerCase());

    switch (filtroCard) {
      case "academia":
        return correspondeBusca && item.status === "Na academia";

      case "entrada":
        return correspondeBusca && item.entrada !== "---";

      case "saida":
        return correspondeBusca && item.saida !== "---";

      case "bloqueado":
        return correspondeBusca && item.status === "Bloqueado";

      default:
        return correspondeBusca;
    }
  });

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
              <strong>24</strong>
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
              <strong>87</strong>
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
              <strong>63</strong>
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
              <strong>3</strong>
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
            />

            <button className="btn-entrada">
              Entrada
            </button>

            <button className="btn-saida">
              Saída
            </button>

          </div>

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

              {dadosFiltrados.map((aluno) => (
                <tr key={aluno.id}>

                  <td>
                    <div className="aluno-cell">

                      <div className="avatar">
                        {iniciais(aluno.nome)}
                      </div>

                      <span>{aluno.nome}</span>

                    </div>
                  </td>

                  <td>{aluno.entrada}</td>

                  <td>{aluno.saida}</td>

                  <td>

                    <span
                      className={`status-badge ${classeStatus(
                        aluno.status
                      )}`}
                    >
                      {aluno.status}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </section>

      </main>
    </div>
  );
}
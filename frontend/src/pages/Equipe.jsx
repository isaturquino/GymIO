import "../styles/equipe.css";
import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";

import ModalNovoFuncionario from "../components/ModalNovoFuncionario";
import ModalEditarFuncionario from "../components/ModalEditarFuncionario";
import ModalExcluirFuncionario from "../components/ModalExcluirFuncionario";
import ModalDetalhesFuncionario from "../components/ModalDetalhesFuncionario";

import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Info,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";

const funcionarios = [
  {
    nome: "Carlos Silva",
    email: "carlos@gymio.com",
    cargo: "Instrutor",
    telefone: "(11) 99999-1111",
    status: "Ativo",
  },
  {
    nome: "Maria Santos",
    email: "maria@gymio.com",
    cargo: "Recepcionista",
    telefone: "(11) 99999-2222",
    status: "Ativo",
  },
  {
    nome: "João Oliveira",
    email: "joao@gymio.com",
    cargo: "Personal Trainer",
    telefone: "(11) 99999-3333",
    status: "Ativo",
  },
  {
    nome: "Ana Costa",
    email: "ana@gymio.com",
    cargo: "Gerente",
    telefone: "(11) 99999-4444",
    status: "Ativo",
  },
  {
    nome: "Pedro Lima",
    email: "pedro@gymio.com",
    cargo: "Limpeza",
    telefone: "(11) 99999-5555",
    status: "Inativo",
  },
];

export default function Equipe() {
  const [modalNovo, setModalNovo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState(null);

  return (
    <div className="equipe-layout">
      <Sidebar />

      <main className="equipe-page">
        <header className="equipe-header">
          <div>
            <h1>Equipe</h1>
            <p>Gestão de colaboradores da academia</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setModalNovo(true)}
          >
            <UserPlus size={16} />
            Novo Funcionário
          </button>
        </header>

        <section className="cards">
  <div className="card">
    <div className="card-info">
      <span>Total de Funcionários</span>
      <strong>{funcionarios.length}</strong>
    </div>

    <div className="icon blue">
      <Users size={18} />
    </div>
  </div>

  <div className="card">
    <div className="card-info">
      <span>Ativos</span>
      <strong>
        {
          funcionarios.filter(
            (f) => f.status === "Ativo"
          ).length
        }
      </strong>
    </div>

    <div className="icon green">
      <Users size={18} />
    </div>
  </div>

  <div className="card">
    <div className="card-info">
      <span>Folha Mensal</span>
      <strong>R$ 28.500</strong>
    </div>

    <div className="icon blue">
      <DollarSign size={18} />
    </div>
  </div>

  <div className="card">
    <div className="card-info">
      <span>Horas Hoje</span>
      <strong>48h</strong>
    </div>

    <div className="icon blue">
      <Clock size={18} />
    </div>
  </div>
</section>

        <section className="content">
          <div className="table-box">
            <div className="table-header">
              <h2>Lista de Funcionários</h2>

              <div className="search">
                <Search size={16} />
                <input placeholder="Buscar..." />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Cargo</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {funcionarios.map((f, i) => (
                  <tr key={i}>
                    <td>
                      <div className="funcionario">
                        <strong>{f.nome}</strong>
                        <span>{f.email}</span>
                      </div>
                    </td>

                    <td>{f.cargo}</td>
                    <td>{f.telefone}</td>

                    <td>
                      <span
                        className={
                          f.status === "Ativo"
                            ? "status ativo"
                            : "status inativo"
                        }
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="acoes">
                      <Pencil
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFuncionarioSelecionado(f);
                          setModalEditar(true);
                        }}
                      />

                      <Trash2
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFuncionarioSelecionado(f);
                          setModalExcluir(true);
                        }}
                      />

                      <Info
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFuncionarioSelecionado(f);
                          setModalDetalhes(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="side-info">
            <h3>Acessos Rápidos</h3>

            <p>
              Clique em "Novo Funcionário" para cadastrar
              um novo colaborador com acesso ao sistema.
            </p>

            <div className="box-info">
              <strong>Campos de Login</strong>

              <p>
                E-mail e senha são utilizados para acesso.
              </p>

              <p>
                Funcionários com acesso financeiro podem
                visualizar o módulo financeiro.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ModalNovoFuncionario
        aberto={modalNovo}
        fechar={() => setModalNovo(false)}
      />

      <ModalEditarFuncionario
        aberto={modalEditar}
        fechar={() => setModalEditar(false)}
        funcionario={funcionarioSelecionado}
      />

      <ModalExcluirFuncionario
        aberto={modalExcluir}
        fechar={() => setModalExcluir(false)}
        funcionario={funcionarioSelecionado}
      />

      <ModalDetalhesFuncionario
        aberto={modalDetalhes}
        fechar={() => setModalDetalhes(false)}
        funcionario={funcionarioSelecionado}
      />
    </div>
  );
}
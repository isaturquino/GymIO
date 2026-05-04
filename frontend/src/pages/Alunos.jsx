import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import "../styles/alunos.css";
import { Users, UserCheck, AlertCircle, UserX } from "lucide-react";
import axios from "axios";

export default function Alunos() {
  const API = "http://localhost:3003/alunos";

  const [alunos, setAlunos] = useState([]);
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

  // MODAL EDIÇÃO
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [indexEditando, setIndexEditando] = useState(null);

  // =========================
  // 🔥 BUSCAR DO BACKEND
  // =========================
  const fetchAlunos = async () => {
    try {
      const res = await axios.get(API);
      setAlunos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  // =========================
  // MODAIS
  // =========================
  const abrirModal = () => setMostrarModal(true);

  const fecharModal = () => {
    setMostrarModal(false);
    setNovoAluno({ nome: "", cpf: "", telefone: "", plano: "" });
  };

  const abrirModalEdicao = (aluno, index) => {
    setAlunoEditando({ ...aluno });
    setIndexEditando(index);
    setMostrarModalEdicao(true);
  };

  const fecharModalEdicao = () => {
    setMostrarModalEdicao(false);
    setAlunoEditando(null);
    setIndexEditando(null);
  };

  // =========================
  // FORMATADORES
  // =========================
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

  // =========================
  // CREATE
  // =========================
  const salvarAluno = async () => {
    const { nome, cpf, telefone, plano } = novoAluno;

    if (!nome || !cpf || !telefone || !plano) return;

    try {
      await axios.post(API, {
        nome,
        cpf,
        telefone,
        plano,
        status: "ativo",
      });

      fetchAlunos();
      fecharModal();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const salvarEdicao = async () => {
    try {
      await axios.put(`${API}/${alunoEditando.id}`, alunoEditando);

      fetchAlunos();
      fecharModalEdicao();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deletarAluno = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchAlunos();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // ALTERAR STATUS
  // =========================
  const alterarStatus = async (aluno) => {
    const ordem = ["ativo", "inadimplente", "cancelado"];
    const atual = aluno.status;

    const proximo =
      ordem[(ordem.indexOf(atual) + 1) % ordem.length];

    try {
      await axios.put(`${API}/${aluno.id}`, {
        ...aluno,
        status: proximo,
      });

      fetchAlunos();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // FILTRO
  // =========================
  const alunosFiltrados = alunos.filter((a) => {
    const matchBusca =
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (a.cpf && a.cpf.includes(busca));

    const matchStatus =
      filtroStatus === "todos" || a.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  // =========================
  // MÉTRICAS
  // =========================
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
      {/* resto igual */}
    </div>
  );
}
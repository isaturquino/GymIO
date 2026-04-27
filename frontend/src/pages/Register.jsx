import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Briefcase, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/auth.css";
import authService from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "Instrutor",
    senha: "",
    confirmar: ""
  });

  const [showSenha, setShowSenha] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await authService.register(form);
    navigate("/");
  };

  return (
    <div className="auth-container">

      {/* ESQUERDA */}
      <div className="auth-left">
        <div className="auth-logo">GymIO</div>

        <h1>Gerencie sua academia com inteligência</h1>
        <p>
          Sistema completo para controle de alunos, financeiro, acesso e equipamentos.
        </p>

        <div className="auth-stats">
          <div className="auth-card-stat">
            <strong>+500</strong><br />Academias
          </div>
          <div className="auth-card-stat">
            <strong>+50k</strong><br />Alunos
          </div>
        </div>
      </div>

      {/* DIREITA */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>Criar sua conta</h2>
          <p>Preencha os dados abaixo para se cadastrar</p>

          {/* TOGGLE */}
          <div className="auth-toggle">
            <button onClick={() => navigate("/")}>
              Entrar
            </button>
            <button className="active">
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleRegister}>

            {/* NOME */}
            <div className="auth-input-group">
              <User />
              <input
                name="nome"
                placeholder="Nome completo"
                onChange={handleChange}
              />
            </div>

            {/* GRID EMAIL + TELEFONE */}
            <div className="auth-grid">
              <div className="auth-input-group">
                <Mail />
                <input
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>

              <div className="auth-input-group">
                <Phone />
                <input
                  name="telefone"
                  placeholder="Telefone"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CARGO */}
            <div className="auth-input-group">
              <Briefcase />
              <select name="cargo" onChange={handleChange}>
                <option>Instrutor</option>
                <option>Administrador</option>
              </select>
            </div>

            {/* SENHA */}
            <div className="auth-grid">
              <div className="auth-input-group">
                <Lock />
                <input
                  type={showSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Senha"
                  onChange={handleChange}
                />
              </div>

              <div className="auth-input-group">
                <Lock />
                <input
                  type={showSenha ? "text" : "password"}
                  name="confirmar"
                  placeholder="Confirmar senha"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* MOSTRAR SENHA */}
            <div className="auth-checkbox">
              <input
                type="checkbox"
                onChange={() => setShowSenha(!showSenha)}
              />
              Mostrar senha
            </div>

            {/* PERMISSÃO */}
            <div className="auth-checkbox">
              <input type="checkbox" />
              Liberar acesso ao Financeiro
            </div>

            {/* BOTÃO */}
            <button className="auth-button">
              Criar Conta
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
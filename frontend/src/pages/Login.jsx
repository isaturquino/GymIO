import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/auth.css";
import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await authService.login({ email, senha });
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
          <h2>Bem-vindo de volta</h2>
          <p>Entre com suas credenciais para acessar o sistema</p>

          {/* TOGGLE */}
          <div className="auth-toggle">
            <button className="active">Entrar</button>
            <button onClick={() => navigate("/register")}>
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="auth-input-group">
              <Mail />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* SENHA */}
            <div className="auth-input-group">
              <Lock />
              <input
                type={showSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span onClick={() => setShowSenha(!showSenha)} style={{cursor:"pointer"}}>
                {showSenha ? <EyeOff size={18}/> : <Eye size={18}/>}
              </span>
            </div>

            {/* LINK */}
            <div className="auth-link">
              Esqueceu a senha?
            </div>

            {/* BOTÃO */}
            <button className="auth-button">
              Entrar no Sistema
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
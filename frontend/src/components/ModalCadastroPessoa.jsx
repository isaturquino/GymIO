import React from "react";
import { X, UserPlus } from "lucide-react";
import "../styles/modal_cadastro_pessoa.css";

export default function ModalCadastroPessoa({
  titulo = "Novo Cadastro",
  icone = <UserPlus size={18} />,
  dados,
  setDados,
  onClose,
  onSave,
  textoBotao = "Salvar",
  mostrarPlano = false,
  mostrarCargo = false,
  planos = [],
}) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-form">
        <div className="modal-header">
          <h2>
            {icone}
            {titulo}
          </h2>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-grid">
          <div className="input-group">
            <label>Nome completo *</label>
            <input
              value={dados.nome}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div className="input-group">
            <label>CPF *</label>
            <input
              value={dados.cpf}
              onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
              placeholder="Ex: 123.456.789-00"
            />
          </div>

          <div className="input-group">
            <label>E-mail *</label>
            <input
              type="email"
              value={dados.email}
              onChange={(e) => setDados({ ...dados, email: e.target.value })}
              placeholder="Ex: maria@email.com"
            />
          </div>

          <div className="input-group">
            <label>Telefone *</label>
            <input
              value={dados.telefone}
              onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
              placeholder="Ex: (11) 99999-9999"
            />
          </div>

          <div className="input-group">
            <label>Data de nascimento *</label>
            <input
              type="date"
              value={dados.dataNascimento}
              onChange={(e) =>
                setDados({ ...dados, dataNascimento: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Endereço *</label>
            <input
              value={dados.endereco}
              onChange={(e) => setDados({ ...dados, endereco: e.target.value })}
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>

          {mostrarPlano && (
            <div className="input-group">
              <label>Plano *</label>
              <select
                value={dados.plano_id || ""}
                onChange={(e) =>
                  setDados({ ...dados, plano_id: e.target.value })
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
          )}

          {mostrarCargo && (
            <div className="input-group">
              <label>Cargo *</label>
              <select
                value={dados.cargo}
                onChange={(e) => setDados({ ...dados, cargo: e.target.value })}
              >
                <option value="">Selecione um cargo</option>
                <option value="Professor">Professor</option>
                <option value="Recepcionista">Recepcionista</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>
          )}

          <div className="input-group">
            <label>Status *</label>
            <select
              value={dados.status}
              onChange={(e) => setDados({ ...dados, status: e.target.value })}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="input-group input-full">
            <label>Senha *</label>
            <input
              type="password"
              value={dados.senha}
              onChange={(e) => setDados({ ...dados, senha: e.target.value })}
              placeholder="Digite uma senha"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn--outline" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn--primary" onClick={onSave}>
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}
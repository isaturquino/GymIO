import { X, UserPlus } from "lucide-react";

export default function ModalNovoFuncionario({
  aberto,
  fechar,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-funcionario">
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon">
              <UserPlus size={18} />
            </div>

            <div>
              <h2>Novo Funcionário</h2>
              <p>Cadastre um novo colaborador.</p>
            </div>
          </div>

          <button className="close-btn" onClick={fechar}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-form">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: Maria Santos"
            />
          </div>

          <div className="form-group">
            <label>E-mail *</label>
            <input
              type="email"
              placeholder="Ex: maria@email.com"
            />
          </div>

          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="text"
              placeholder="Ex: (11) 99999-2222"
            />
          </div>

          <div className="form-group">
            <label>CPF *</label>
            <input
              type="text"
              placeholder="Ex: 123.456.789-00"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Data de Nascimento *</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Cargo *</label>

              <select>
                <option>Selecione o cargo</option>
                <option>Recepcionista</option>
                <option>Instrutor</option>
                <option>Personal Trainer</option>
                <option>Gerente</option>
                <option>Limpeza</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Data de Admissão *</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Status *</label>

              <select>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Permissão Financeira</label>

            <select>
              <option>Selecione a permissão</option>
              <option>Sim</option>
              <option>Não</option>
            </select>
          </div>

          <div className="form-group">
            <label>Observações (opcional)</label>

            <textarea
              rows="4"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={fechar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-salvar"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
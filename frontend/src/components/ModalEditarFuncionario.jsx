import { X, Pencil } from "lucide-react";

export default function ModalEditarFuncionario({
  aberto,
  fechar,
  funcionario,
}) {
  if (!aberto || !funcionario) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-funcionario">
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon">
              <Pencil size={18} />
            </div>

            <div>
              <h2>Editar Funcionário</h2>
              <p>Edite as informações do colaborador.</p>
            </div>
          </div>

          <button className="close-btn" onClick={fechar}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-form">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input defaultValue={funcionario.nome} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>E-mail *</label>
              <input defaultValue={funcionario.email} />
            </div>

            <div className="form-group">
              <label>Telefone *</label>
              <input defaultValue={funcionario.telefone} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>CPF *</label>
              <input defaultValue="123.456.789-00" />
            </div>

            <div className="form-group">
              <label>Cargo *</label>
              <select defaultValue={funcionario.cargo}>
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
              <label>Status *</label>

              <select defaultValue={funcionario.status}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Permissão Financeira</label>

              <select defaultValue="Sim">
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Observações</label>

            <textarea rows="3">
Responsável pelo atendimento na recepção da academia.
            </textarea>
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
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
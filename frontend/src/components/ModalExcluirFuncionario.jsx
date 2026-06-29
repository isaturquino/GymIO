import { X, Trash2, AlertTriangle } from "lucide-react";

export default function ModalExcluirFuncionario({
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
            <div className="modal-icon danger">
              <Trash2 size={18} />
            </div>

            <div>
              <h2>Excluir Funcionário</h2>
            </div>
          </div>

          <button className="close-btn" onClick={fechar}>
            <X size={18} />
          </button>
        </div>

        <div className="alert-danger">
          <AlertTriangle size={22} />

          <div>
            <strong>Atenção!</strong>

            <p>
              Esta ação excluirá o funcionário do sistema
              e não poderá ser desfeita.
            </p>
          </div>
        </div>

        <p className="confirm-text">
          Tem certeza que deseja excluir este funcionário?
        </p>

        <div className="func-card">
          <div className="avatar">
            {funcionario.nome
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <strong>{funcionario.nome}</strong>
            <p>{funcionario.cargo}</p>
            <span>{funcionario.email}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Observações (opcional)</label>

          <textarea
            rows="3"
            placeholder="Informe um motivo..."
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn-cancelar"
            onClick={fechar}
          >
            Cancelar
          </button>

          <button className="btn-excluir">
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
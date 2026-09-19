import React, { useMemo, useState } from "react";
import Sidebar from "../layout/Sidebar";
import "../styles/financeiro.css";

const initialTransactions = [
  {
    id: 1,
    aluno: "Maria Silva",
    initials: "MS",
    tipo: "receber",
    descricao: "Plano Trimestral",
    valor: 99.9,
    vencimento: "2026-04-25",
    status: "Pago",
    categoria: "Mensalidade",
    criadoEm: "10/04/2026 14:30",
  },
  {
    id: 2,
    aluno: "João Santos",
    initials: "JS",
    tipo: "receber",
    descricao: "Plano Mensal",
    valor: 269.9,
    vencimento: "2026-04-28",
    status: "Pendente",
    categoria: "Mensalidade",
    criadoEm: "01/04/2026 09:15",
  },
  {
    id: 3,
    aluno: "Ana Costa",
    initials: "AC",
    tipo: "receber",
    descricao: "Plano Trimestral",
    valor: 99.9,
    vencimento: "2026-04-15",
    status: "Atrasado",
    categoria: "Mensalidade",
    criadoEm: "01/04/2026 09:15",
  },
  {
    id: 4,
    aluno: "Pedro Lima",
    initials: "PL",
    tipo: "pagar",
    descricao: "Salário",
    valor: 17550,
    vencimento: "2026-05-05",
    status: "Pendente",
    categoria: "Salários",
    criadoEm: "01/05/2026 10:00",
  },
  {
    id: 5,
    aluno: "Carlos Souza",
    initials: "CS",
    tipo: "pagar",
    descricao: "Internet",
    valor: 150,
    vencimento: "2026-05-15",
    status: "Pendente",
    categoria: "Despesas fixas",
    criadoEm: "01/05/2026 10:00",
  },
];

const money = (value) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const date = (value) => {
  if (!value) return "-";
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
};

const emptyForm = {
  tipo: "receber",
  aluno: "",
  valor: "",
  vencimento: "",
  categoria: "",
  status: "Pendente",
  descricao: "",
};

function Financeiro() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activeTab, setActiveTab] = useState("receber");
  const [modal, setModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const totals = useMemo(() => {
    const receber = transactions
      .filter((item) => item.tipo === "receber")
      .reduce((sum, item) => sum + Number(item.valor), 0);

    const pagar = transactions
      .filter((item) => item.tipo === "pagar")
      .reduce((sum, item) => sum + Number(item.valor), 0);

    return {
      receber,
      pagar,
      saldo: 45230,
      despesasFixas: 18450,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesTab = item.tipo === activeTab;
      const text = `${item.aluno} ${item.descricao} ${item.categoria}`.toLowerCase();
      return matchesTab && text.includes(search.toLowerCase());
    });
  }, [transactions, activeTab, search]);

  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  function openNewModal() {
    setSelectedTransaction(null);
    setForm({ ...emptyForm, tipo: activeTab });
    setModal("new");
  }

  function openEditModal(transaction) {
    setSelectedTransaction(transaction);
    setForm({
      tipo: transaction.tipo,
      aluno: transaction.aluno,
      valor: transaction.valor,
      vencimento: transaction.vencimento,
      categoria: transaction.categoria,
      status: transaction.status,
      descricao: transaction.descricao,
    });
    setModal("edit");
  }

  function openDetailsModal(transaction) {
    setSelectedTransaction(transaction);
    setModal("details");
  }

  function openDeleteModal(transaction) {
    setSelectedTransaction(transaction);
    setModal("delete");
  }

  function closeModal() {
    setModal(null);
    setSelectedTransaction(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const aluno = form.aluno.trim() || "Não informado";
    const initials = aluno
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const newTransaction = {
      ...form,
      id: selectedTransaction?.id || Date.now(),
      aluno,
      initials,
      valor: Number(form.valor),
      criadoEm: selectedTransaction?.criadoEm || new Date().toLocaleString("pt-BR"),
    };

    if (modal === "edit") {
      setTransactions((previous) =>
        previous.map((item) =>
          item.id === selectedTransaction.id ? newTransaction : item
        )
      );
    } else {
      setTransactions((previous) => [newTransaction, ...previous]);
    }

    // BACK-END: substituir a atualização local pelas chamadas da API financeira.
    closeModal();
  }

  function handleDelete() {
    setTransactions((previous) =>
      previous.filter((item) => item.id !== selectedTransaction.id)
    );

    // BACK-END: conectar à rota responsável pela exclusão da transação.
    closeModal();
  }

  function changeTab(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch("");
  }

  return (
    <div className="app-container financeiro-layout">
      <Sidebar />

      <main className="financeiro-page">
        <header className="financeiro-header">
          <div>
            <h1>Financeiro</h1>
            <p>Gestão de contas a pagar e receber</p>
          </div>

          <button className="btn btn--primary" onClick={openNewModal}>
            <span>＋</span> Nova Transação <span>⌄</span>
          </button>
        </header>

        <section className="financeiro-stats">
          <StatCard
            title="A Receber"
            value={money(totals.receber)}
            variation="+15%"
            icon="↗"
            variant="green"
          />
          <StatCard
            title="A Pagar"
            value={money(totals.pagar)}
            variation="-5%"
            icon="↘"
            variant="red"
          />
          <StatCard
            title="Saldo em Caixa"
            value={money(totals.saldo)}
            variation="+8% crescimento"
            icon="▣"
            variant="blue"
          />
          <StatCard
            title="Despesas Fixas (mês)"
            value={money(totals.despesasFixas)}
            variation="42% do total de despesas"
            icon="◷"
            variant="purple"
          />
        </section>

        <section className="financeiro-chart-card">
          <div className="section-heading">
            <div>
              <h2>Fluxo de Caixa</h2>
              <p>Receitas vs. Despesas</p>
            </div>

            <div className="chart-legend">
              <span><i className="legend-dot legend-dot--green" /> Receitas</span>
              <span><i className="legend-dot legend-dot--red" /> Despesas</span>
            </div>
          </div>

          <div className="cash-flow-chart" aria-label="Gráfico ilustrativo de fluxo de caixa">
            <div className="chart-y-labels">
              <span>R$ 20k</span>
              <span>R$ 15k</span>
              <span>R$ 10k</span>
              <span>R$ 5k</span>
              <span>R$ 0</span>
            </div>

            <div className="chart-area">
              <div className="chart-grid-lines">
                <span /><span /><span /><span /><span />
              </div>
              <svg viewBox="0 0 720 230" preserveAspectRatio="none" role="img">
                <polygon
                  points="30,145 250,75 470,125 690,45 690,205 30,205"
                  className="chart-fill chart-fill--green"
                />
                <polygon
                  points="30,180 250,135 470,185 690,160 690,205 30,205"
                  className="chart-fill chart-fill--red"
                />
                <polyline
                  points="30,145 250,75 470,125 690,45"
                  className="chart-line chart-line--green"
                />
                <polyline
                  points="30,180 250,135 470,185 690,160"
                  className="chart-line chart-line--red"
                />
                {[["30","145"],["250","75"],["470","125"],["690","45"]].map(([x,y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="4" className="chart-point chart-point--green" />
                ))}
                {[["30","180"],["250","135"],["470","185"],["690","160"]].map(([x,y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="4" className="chart-point chart-point--red" />
                ))}
              </svg>
              <div className="chart-x-labels">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
              </div>
            </div>
          </div>
        </section>

        <section className="financeiro-main-grid">
          <div className="transactions-card">
            <div className="transactions-tabs">
              <button
                className={activeTab === "receber" ? "tab active" : "tab"}
                onClick={() => changeTab("receber")}
              >
                ▣ Contas a Receber
              </button>
              <button
                className={activeTab === "pagar" ? "tab active" : "tab"}
                onClick={() => changeTab("pagar")}
              >
                ▣ Contas a Pagar
              </button>
            </div>

            <div className="transactions-toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Pesquisar transação..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>

              <button className="btn btn--outline" onClick={openNewModal}>
                ＋ Adicionar
              </button>
            </div>

            <div className="table-wrapper">
              <table className="financeiro-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="student-cell">
                          <span className="avatar">{transaction.initials}</span>
                          <strong>{transaction.aluno}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge type-badge--${transaction.tipo}`}>
                          {transaction.tipo === "receber" ? "A Receber" : "A Pagar"}
                        </span>
                      </td>
                      <td>{transaction.descricao}</td>
                      <td className="value-cell">{money(transaction.valor)}</td>
                      <td>{date(transaction.vencimento)}</td>
                      <td>
                        <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn edit"
                            title="Editar"
                            onClick={() => openEditModal(transaction)}
                          >
                            ✎
                          </button>
                          <button
                            className="action-btn delete"
                            title="Excluir"
                            onClick={() => openDeleteModal(transaction)}
                          >
                            ♧
                          </button>
                          <button
                            className="action-btn details"
                            title="Detalhes"
                            onClick={() => openDetailsModal(transaction)}
                          >
                            ⓘ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!visibleTransactions.length && (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Mostrando {visibleTransactions.length} de {filteredTransactions.length} registros
              </span>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <aside className="quick-access-card">
            <h2>Acessos Rápidos</h2>

            <button className="quick-access-item" onClick={openNewModal}>
              <span className="quick-icon quick-icon--green">＋</span>
              <span>
                <strong>Nova Transação</strong>
                <small>Adicionar receita ou despesa</small>
              </span>
              <b>›</b>
            </button>

            <button
              className="quick-access-item"
              onClick={() => alert("Tela de relatórios será conectada posteriormente.")}
            >
              <span className="quick-icon quick-icon--amber">▣</span>
              <span>
                <strong>Relatório Financeiro</strong>
                <small>Ver relatórios detalhados</small>
              </span>
              <b>›</b>
            </button>
          </aside>
        </section>
      </main>

      {modal && (
        <div className="modal-overlay" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            {modal === "new" && (
              <TransactionFormModal
                title="Nova Transação"
                subtitle="Crie uma nova transação financeira."
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onClose={closeModal}
                submitLabel="Salvar"
              />
            )}

            {modal === "edit" && (
              <TransactionFormModal
                title="Editar Transação"
                subtitle="Edite as informações da transação."
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onClose={closeModal}
                submitLabel="Salvar Alterações"
              />
            )}

            {modal === "delete" && (
              <DeleteModal
                transaction={selectedTransaction}
                onClose={closeModal}
                onConfirm={handleDelete}
              />
            )}

            {modal === "details" && (
              <DetailsModal
                transaction={selectedTransaction}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, variation, icon, variant }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon--${variant}`}>{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small className={variant === "red" ? "negative" : "positive"}>
          {variation}
        </small>
      </div>
    </article>
  );
}

function TransactionFormModal({
  title,
  subtitle,
  form,
  onChange,
  onSubmit,
  onClose,
  submitLabel,
}) {
  return (
    <form className="modal-form" onSubmit={onSubmit}>
      <div className="modal-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
      </div>

      <div className="transaction-type-selector">
        <label>Tipo de Transação *</label>
        <div className="type-options">
          <label className={form.tipo === "receber" ? "selected receive" : "receive"}>
            <input
              type="radio"
              name="tipo"
              value="receber"
              checked={form.tipo === "receber"}
              onChange={onChange}
            />
            A Receber ↗
          </label>
          <label className={form.tipo === "pagar" ? "selected pay" : "pay"}>
            <input
              type="radio"
              name="tipo"
              value="pagar"
              checked={form.tipo === "pagar"}
              onChange={onChange}
            />
            A Pagar ↘
          </label>
        </div>
      </div>

      <div className="modal-grid">
        <div className="input-group input-full">
          <label htmlFor="aluno">Aluno (opcional)</label>
          <input
            id="aluno"
            name="aluno"
            value={form.aluno}
            onChange={onChange}
            placeholder="Selecione ou informe um aluno..."
          />
          {/* BACK-END: substituir por uma lista de alunos carregada da API. */}
        </div>

        <div className="input-group">
          <label htmlFor="valor">Valor *</label>
          <input
            id="valor"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            value={form.valor}
            onChange={onChange}
            placeholder="0,00"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="vencimento">Vencimento *</label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            value={form.vencimento}
            onChange={onChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="categoria">Categoria *</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={onChange}
            required
          >
            <option value="">Selecione uma categoria...</option>
            <option value="Mensalidade">Mensalidade</option>
            <option value="Salários">Salários</option>
            <option value="Despesas fixas">Despesas fixas</option>
            <option value="Equipamentos">Equipamentos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            required
          >
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Atrasado">Atrasado</option>
          </select>
        </div>

        <div className="input-group input-full">
          <label htmlFor="descricao">Descrição (opcional)</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={onChange}
            placeholder="Informe uma descrição..."
            rows="3"
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn--outline" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function DeleteModal({ transaction, onClose, onConfirm }) {
  return (
    <div className="delete-modal">
      <div className="modal-header">
        <h2>Excluir Transação</h2>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <div className="alert-box">
        <strong>⚠ Atenção!</strong>
        <p>A transação selecionada será excluída do sistema.</p>
      </div>

      <p className="delete-question">
        Tem certeza de que deseja excluir esta transação?
      </p>

      <div className="transaction-summary">
        <strong>{transaction?.aluno}</strong>
        <span>{transaction?.descricao}</span>
        <span>{money(transaction?.valor || 0)}</span>
        <span>{date(transaction?.vencimento)}</span>
      </div>

      <div className="modal-footer">
        <button className="btn btn--outline" onClick={onClose}>Voltar</button>
        <button className="btn btn--danger" onClick={onConfirm}>
          Confirmar Exclusão
        </button>
      </div>
    </div>
  );
}

function DetailsModal({ transaction, onClose }) {
  return (
    <div className="details-modal">
      <div className="modal-header">
        <div>
          <h2>Detalhes da Transação</h2>
          <p>Informações completas do registro.</p>
        </div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <div className="details-person">
        <span className="avatar">{transaction?.initials}</span>
        <div>
          <strong>{transaction?.aluno}</strong>
          <span className={`type-badge type-badge--${transaction?.tipo}`}>
            {transaction?.tipo === "receber" ? "A Receber" : "A Pagar"}
          </span>
        </div>
      </div>

      <div className="details-list">
        <div><span>Valor</span><strong>{money(transaction?.valor || 0)}</strong></div>
        <div><span>Vencimento</span><strong>{date(transaction?.vencimento)}</strong></div>
        <div><span>Status</span><strong>{transaction?.status}</strong></div>
        <div><span>Categoria</span><strong>{transaction?.categoria || "-"}</strong></div>
        <div><span>Descrição</span><strong>{transaction?.descricao || "-"}</strong></div>
        <div><span>Data de criação</span><strong>{transaction?.criadoEm || "-"}</strong></div>
      </div>

      <div className="modal-footer">
        <button className="btn btn--outline" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default Financeiro;

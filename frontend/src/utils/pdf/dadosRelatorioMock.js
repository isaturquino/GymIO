export const dadosRelatoriosMock = {
  alunos: {
    titulo: "Relatório de Alunos Ativos/Inativos",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Alunos Ativos", valor: "248" },
      { label: "Alunos Inativos", valor: "52" },
      { label: "Taxa de Retenção", valor: "82,7%" },
    ],
    colunas: ["Aluno", "Plano", "Status", "Pagamento"],
    tabela: [
      ["Ana Souza", "Mensal", "Ativo", "Pago"],
      ["Carlos Lima", "Trimestral", "Ativo", "Pago"],
      ["Marina Alves", "Mensal", "Inativo", "Pendente"],
    ],
  },

  inadimplencia: {
    titulo: "Relatório de Inadimplência",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Total Inadimplentes", valor: "23" },
      { label: "Valor em Atraso", valor: "R$ 4.850" },
      { label: "Taxa", valor: "9,3%" },
    ],
    colunas: ["Aluno", "Plano", "Valor em Atraso", "Vencimento"],
    tabela: [
      ["João Pereira", "Mensal", "R$ 150", "10/05/2026"],
      ["Larissa Mendes", "Trimestral", "R$ 420", "12/05/2026"],
    ],
  },

  receita: {
    titulo: "Relatório de Receita Mensal",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Receita do Mês", valor: "R$ 45.320" },
      { label: "Despesas", valor: "R$ 28.150" },
      { label: "Lucro Líquido", valor: "R$ 17.170" },
    ],
    colunas: ["Descrição", "Categoria", "Valor", "Data"],
    tabela: [
      ["Mensalidades", "Receita", "R$ 45.320", "31/05/2026"],
      ["Manutenção", "Despesa", "R$ 2.340", "18/05/2026"],
    ],
  },

  frequencia: {
    titulo: "Relatório de Frequência de Alunos",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Média Acessos/Dia", valor: "127" },
      { label: "Dia Mais Movimentado", valor: "Segunda" },
      { label: "Horário de Pico", valor: "18h - 20h" },
    ],
    colunas: ["Aluno", "Data", "Horário", "Tipo de Acesso"],
    tabela: [
      ["Ana Souza", "20/05/2026", "18:30", "Entrada"],
      ["Carlos Lima", "20/05/2026", "19:10", "Entrada"],
    ],
  },

  equipamentos: {
    titulo: "Relatório de Equipamentos",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Em Manutenção", valor: "3" },
      { label: "Manutenções no Mês", valor: "8" },
      { label: "Custo Total", valor: "R$ 2.340" },
    ],
    colunas: ["Equipamento", "Status", "Última Manutenção", "Custo"],
    tabela: [
      ["Esteira 01", "Em manutenção", "14/05/2026", "R$ 450"],
      ["Bike 03", "Disponível", "10/05/2026", "R$ 180"],
    ],
  },

  geral: {
    titulo: "Relatório Geral",
    periodo: "01/05/2026 a 31/05/2026",
    resumo: [
      { label: "Total Alunos", valor: "300" },
      { label: "Total Funcionários", valor: "12" },
      { label: "Equipamentos", valor: "42" },
    ],
    colunas: ["Indicador", "Categoria", "Valor", "Observação"],
    tabela: [
      ["Alunos", "Cadastro", "300", "Total geral"],
      ["Funcionários", "Equipe", "12", "Ativos"],
      ["Equipamentos", "Patrimônio", "42", "Cadastrados"],
    ],
  },
};
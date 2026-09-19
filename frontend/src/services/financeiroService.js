/**
 * Serviço financeiro do GymIO.
 *
 * BACK-END:
 * Substituir as funções abaixo pelas chamadas HTTP da API
 * quando as rotas financeiras forem disponibilizadas pelo grupo.
 */

export async function listarTransacoes() {
  // BACK-END: GET /transacoes
  return [];
}

export async function criarTransacao(dados) {
  // BACK-END: POST /transacoes
  return dados;
}

export async function atualizarTransacao(id, dados) {
  // BACK-END: PUT ou PATCH /transacoes/:id
  return { id, ...dados };
}

export async function excluirTransacao(id) {
  // BACK-END: DELETE /transacoes/:id
  return id;
}

export async function buscarResumoFinanceiro() {
  // BACK-END: GET /financeiro/resumo
  return {
    receber: 0,
    pagar: 0,
    saldo: 0,
    despesasFixas: 0,
  };
}
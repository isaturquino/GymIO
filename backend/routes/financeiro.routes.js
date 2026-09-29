const express = require("express");

const {
  listarTransacoes,
  buscarResumoFinanceiro,
  buscarGraficoFinanceiro,
  criarTransacao,
  atualizarTransacao,
  excluirTransacao,
} = require("../controllers/financeiro.controller");

const router = express.Router();

router.get("/transacoes", listarTransacoes);

router.get("/resumo", buscarResumoFinanceiro);

router.get("/grafico", buscarGraficoFinanceiro);

router.post("/transacoes", criarTransacao);

router.put("/transacoes/:id", atualizarTransacao);

router.delete("/transacoes/:id", excluirTransacao);

module.exports = router;
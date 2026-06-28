// src/utils/pdf/baixarRelatorio.js

import { gerarRelatorioPDF } from "./gerarRelatorioPDF";
import { dadosRelatoriosMock } from "./dadosRelatorioMock";

export function baixarRelatorio(tipo) {
  const dados = dadosRelatoriosMock[tipo];

  if (!dados) {
    console.error(`Relatório "${tipo}" não encontrado.`);
    return;
  }

  gerarRelatorioPDF(dados);
}
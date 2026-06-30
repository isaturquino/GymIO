const { supabaseAdmin } = require("../config/supabase");

function normalizarCpf(identificador) {
  return String(identificador || "").replace(/\D/g, "");
}

function formatarCpf(cpf) {
  if (cpf.length !== 11) {
    return null;
  }

  return cpf.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    "$1.$2.$3-$4"
  );
}

function normalizarStatus(status) {
  return String(status || "").trim().toLowerCase();
}

async function buscarPessoaEAluno(identificador) {
  const cpf = normalizarCpf(identificador);
  const cpfFormatado = formatarCpf(cpf);
  const candidatos = [...new Set([
    cpf,
    cpfFormatado,
    String(identificador).trim(),
  ].filter(Boolean))];

  const { data: pessoa, error: erroPessoa } = await supabaseAdmin
    .from("pessoa")
    .select("id, nome, cpf")
    .in("cpf", candidatos)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();

  if (erroPessoa) {
    throw erroPessoa;
  }

  if (!pessoa) {
    return { pessoa: null, aluno: null };
  }

  const { data: aluno, error: erroAluno } = await supabaseAdmin
    .from("aluno")
    .select("id, pessoa_id, status")
    .eq("pessoa_id", pessoa.id)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();

  if (erroAluno) {
    throw erroAluno;
  }

  return { pessoa, aluno };
}

async function registrarBloqueio(alunoId = null) {
  const agora = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("acesso")
    .insert([{
      aluno_id: alunoId,
      tipo_acesso: "bloqueado",
      data_hora_acesso: agora,
      hora_entrada: null,
      hora_saida: null,
    }]);

  if (error) {
    throw error;
  }
}

async function possuiAssinaturaAtiva(alunoId) {
  const { data: assinaturas, error } = await supabaseAdmin
    .from("assinatura")
    .select("id, status_assinatura, data_inicio, data_fim")
    .eq("aluno_id", alunoId)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }

  const hoje = new Date().toISOString().slice(0, 10);

  return (assinaturas || []).some((assinatura) => {
    const status = normalizarStatus(assinatura.status_assinatura);
    const statusAtivo = status === "ativo" || status === "ativa";
    const inicioValido =
      !assinatura.data_inicio || assinatura.data_inicio <= hoje;
    const fimValido =
      !assinatura.data_fim || assinatura.data_fim >= hoje;

    return statusAtivo && inicioValido && fimValido;
  });
}

async function buscarEntradaAberta(alunoId) {
  const { data, error } = await supabaseAdmin
    .from("acesso")
    .select("id, aluno_id, data_hora_acesso, hora_entrada, hora_saida")
    .eq("aluno_id", alunoId)
    .eq("tipo_acesso", "entrada")
    .is("deleted_at", null)
    .not("hora_entrada", "is", null)
    .is("hora_saida", null)
    .order("hora_entrada", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

exports.listar = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("acesso")
      .select(`
        id,
        aluno_id,
        data_hora_acesso,
        tipo_acesso,
        hora_entrada,
        hora_saida,
        aluno (
          id,
          status,
          pessoa (
            id,
            nome,
            cpf
          )
        )
      `)
      .is("deleted_at", null)
      .order("data_hora_acesso", { ascending: false });

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("ERRO LISTAR ACESSOS:", error);
    return res.status(500).json({ erro: "Erro ao listar acessos." });
  }
};

exports.registrarEntrada = async (req, res) => {
  try {
    const { identificador } = req.body;

    if (!identificador) {
      return res.status(400).json({ erro: "Identificador é obrigatório." });
    }

    const cpf = normalizarCpf(identificador);

    if (!cpf) {
      return res.status(400).json({ erro: "CPF inválido." });
    }

    const { pessoa, aluno } = await buscarPessoaEAluno(identificador);

    if (!pessoa || !aluno) {
      await registrarBloqueio();
      return res.status(404).json({ erro: "Aluno não encontrado." });
    }

    if (normalizarStatus(aluno.status) !== "ativo") {
      await registrarBloqueio(aluno.id);
      return res.status(403).json({ erro: "Acesso bloqueado: aluno inativo." });
    }

    const assinaturaAtiva = await possuiAssinaturaAtiva(aluno.id);

    if (!assinaturaAtiva) {
      await registrarBloqueio(aluno.id);
      return res.status(403).json({
        erro: "Acesso bloqueado: aluno sem assinatura ativa.",
      });
    }

    const entradaAberta = await buscarEntradaAberta(aluno.id);

    if (entradaAberta) {
      return res.status(409).json({
        erro: "Aluno já possui uma entrada aberta.",
      });
    }

    const agora = new Date().toISOString();
    const { data: acesso, error } = await supabaseAdmin
      .from("acesso")
      .insert([{
        aluno_id: aluno.id,
        tipo_acesso: "entrada",
        data_hora_acesso: agora,
        hora_entrada: agora,
        hora_saida: null,
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.status(201).json({
      mensagem: "Entrada registrada com sucesso.",
      acesso,
      aluno: {
        id: aluno.id,
        nome: pessoa.nome,
        cpf: pessoa.cpf,
      },
    });
  } catch (error) {
    console.error("ERRO REGISTRAR ENTRADA:", error);
    return res.status(500).json({ erro: "Erro ao registrar entrada." });
  }
};

exports.registrarSaida = async (req, res) => {
  try {
    const { identificador } = req.body;

    if (!identificador) {
      return res.status(400).json({ erro: "Identificador é obrigatório." });
    }

    const cpf = normalizarCpf(identificador);

    if (!cpf) {
      return res.status(400).json({ erro: "CPF inválido." });
    }

    const { pessoa, aluno } = await buscarPessoaEAluno(identificador);

    if (!pessoa || !aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado." });
    }

    const entradaAberta = await buscarEntradaAberta(aluno.id);

    if (!entradaAberta) {
      return res.status(409).json({
        erro: "Aluno não possui uma entrada aberta.",
      });
    }

    const agora = new Date().toISOString();
    const { data: acesso, error } = await supabaseAdmin
      .from("acesso")
      .update({ hora_saida: agora })
      .eq("id", entradaAberta.id)
      .is("deleted_at", null)
      .is("hora_saida", null)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.status(200).json({
      mensagem: "Saída registrada com sucesso.",
      acesso,
      aluno: {
        id: aluno.id,
        nome: pessoa.nome,
        cpf: pessoa.cpf,
      },
    });
  } catch (error) {
    console.error("ERRO REGISTRAR SAÍDA:", error);
    return res.status(500).json({ erro: "Erro ao registrar saída." });
  }
};

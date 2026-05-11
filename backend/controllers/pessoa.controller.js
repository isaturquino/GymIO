const supabase = require("../config/supabase");

// =========================
// GET - LISTAR PESSOAS / ALUNOS
// =========================
exports.getPessoas = async (req, res) => {
  try {
    const { tipo } = req.query;

    if (tipo === "aluno") {
  const { data, error } = await supabase
    .from("pessoa")
    .select(`
      id,
      nome,
      cpf,
      telefone,
      email,
      data_nascimento,
      endereco,
      password,
      aluno (
        id,
        status,
        data_matricula,
        assinatura (
          id,
          status_assinatura,
          plano_id,
          plano (
            id,
            nome_plano
          )
        )
      )
    `)
    .is("deleted_at", null);

  if (error) {
    console.error("ERRO GET ALUNOS:", error);
    return res.status(500).json({ erro: error.message });
  }

  const alunos = data.map((p) => {
    const aluno = p.aluno?.[0] || {};
    const assinatura = aluno.assinatura?.[0] || {};
    const plano = assinatura.plano || {};

    return {
      id: p.id,
      nome: p.nome,
      cpf: p.cpf,
      telefone: p.telefone,
      email: p.email,
      dataNascimento: p.data_nascimento,
      data_nascimento: p.data_nascimento,
      endereco: p.endereco,

      plano: plano.nome_plano || "",
      plano_id: assinatura.plano_id || "",
      status: assinatura.status_assinatura || aluno.status || "",

      matricula: aluno.data_matricula || "",
      senha: p.password || "",
    };
  });

  return res.json(alunos);
}
    const { data, error } = await supabase.from("pessoa").select("*");

    if (error) {
      console.error("ERRO GET PESSOAS:", error);
      return res.status(500).json({ erro: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("ERRO GERAL GET:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// POST - CRIAR ALUNO COMPLETO
// =========================
exports.createPessoa = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      telefone,
      email,
      dataNascimento,
      endereco,
      plano_id,
      status,
      data_matricula,
      senha,
    } = req.body;

    const { data: pessoa, error: erroPessoa } = await supabase
      .from("pessoa")
      .insert([{
    nome,
    cpf,
    telefone,
    email,
    data_nascimento : dataNascimento,
    endereco,
    password: senha
  }])
  .select()
  .single();

    if (erroPessoa) {
      console.error("ERRO CREATE PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    const { data: aluno, error: erroAluno } = await supabase
      .from("aluno")
      .insert([
        {
          pessoa_id: pessoa.id,
          status,
          data_matricula: new Date().toISOString().split("T")[0]
        },
      ])
      .select()
      .single();

    if (erroAluno) {
      console.error("ERRO CREATE ALUNO:", erroAluno);
      return res.status(500).json({ erro: erroAluno.message });
    }

    const { error: erroAssinatura } = await supabase
      .from("assinatura")
      .insert([
        {
          aluno_id: aluno.id,
          plano_id: plano_id || null,
          status: status || "Ativo",
        },
      ]);

    if (erroAssinatura) {
      console.error("ERRO CREATE ASSINATURA:", erroAssinatura);
      return res.status(500).json({ erro: erroAssinatura.message });
    }

    return res.status(201).json({
      sucesso: true,
      pessoa,
      aluno,
    });
  } catch (err) {
    console.error("ERRO GERAL POST:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// PUT - ATUALIZAR ALUNO
// =========================
exports.updatePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      cpf,
      telefone,
      email,
      dataNascimento,
      endereco,
      plano_id,
      status,
      data_matricula,
      senha,
    } = req.body;

    const { error: erroPessoa } = await supabase
      .from("pessoa")
      .update({
        nome,
        cpf,
        telefone,
        email,
        data_nascimento: dataNascimento,
        endereco,
      })
      .eq("id", id);

    if (erroPessoa) {
      console.error("ERRO UPDATE PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    const { data: aluno, error: erroBuscaAluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (erroBuscaAluno || !aluno) {
      console.error("ERRO BUSCA ALUNO:", erroBuscaAluno);
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const { error: erroAluno } = await supabase
      .from("aluno")
      .update({
        data_matricula,
        senha,
      })
      .eq("id", aluno.id);

    if (erroAluno) {
      console.error("ERRO UPDATE ALUNO:", erroAluno);
      return res.status(500).json({ erro: erroAluno.message });
    }

    const { error: erroAssinatura } = await supabase
      .from("assinatura")
      .update({
        plano_id: plano_id || null,
        status_assinatura: status || "Ativo",
      })
      .eq("aluno_id", aluno.id);

    if (erroAssinatura) {
      console.error("ERRO UPDATE ASSINATURA:", erroAssinatura);
      return res.status(500).json({ erro: erroAssinatura.message });
    }

    return res.json({ sucesso: true });
  } catch (err) {
    console.error("ERRO GERAL PUT:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// DELETE - EXCLUIR ALUNO
// =========================
exports.deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: aluno, error: erroBuscaAluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (erroBuscaAluno) {
      console.error("ERRO BUSCA ALUNO DELETE:", erroBuscaAluno);
    }

    if (aluno) {
      const { error: erroAssinatura } = await supabase
        .from("assinatura")
        .delete()
        .eq("aluno_id", aluno.id);

      if (erroAssinatura) {
        console.error("ERRO DELETE ASSINATURA:", erroAssinatura);
        return res.status(500).json({ erro: erroAssinatura.message });
      }

      const { error: erroAluno } = await supabase
        .from("aluno")
        .delete()
        .eq("id", aluno.id);

      if (erroAluno) {
        console.error("ERRO DELETE ALUNO:", erroAluno);
        return res.status(500).json({ erro: erroAluno.message });
      }
    }

    const { error: erroPessoa } = await supabase
      .from("pessoa")
      .delete()
      .eq("id", id);

    if (erroPessoa) {
      console.error("ERRO DELETE PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    return res.json({ sucesso: true });
  } catch (err) {
    console.error("ERRO GERAL DELETE:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// GET - TOTAL DE ALUNOS
// =========================
exports.getTotalAlunos = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("aluno")
      .select("*", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.json({ total: count });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// GET - PLANOS
// =========================
exports.getPlanos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plano")
      .select("*")
      .is("deleted_at", null);

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
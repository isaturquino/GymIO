const supabase = require("../config/supabase");

// =========================
// GET - LISTAR PESSOAS / ALUNOS
// =========================
exports.getPessoas = async (req, res) => {
  try {
    const { tipo } = req.query;

    if (tipo === "aluno") {
      const { data, error } = await supabase.from("pessoa").select(`
        id,
        nome,
        cpf,
        telefone,
        email,
        data_nascimento,
        endereco,
        aluno (
          id,
          matricula,
          senha,
          assinatura (
            id,
            status,
            plano_id,
            plano (
              id,
              nome
            )
          )
        )
      `);

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
          plano: plano.nome || "",
          plano_id: assinatura.plano_id || "",
          status: assinatura.status || "",
          matricula: aluno.matricula || "",
          senha: aluno.senha || "",
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
      matricula,
      senha,
    } = req.body;

    const { data: pessoa, error: erroPessoa } = await supabase
      .from("pessoa")
      .insert([
        {
          nome,
          cpf,
          telefone,
          email,
          data_nascimento: dataNascimento,
          endereco,
        },
      ])
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
          matricula,
          senha,
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
      matricula,
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
        matricula,
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
        status,
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
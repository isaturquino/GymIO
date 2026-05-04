const supabase = require("../config/supabase");

// =========================
// GET - LISTAR ALUNOS
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
        console.error("ERRO GET:", error);
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
          endereco: p.endereco,

          plano: plano.nome || "",
          status: assinatura.status || "",
          matricula: aluno.matricula || "",
          senha: aluno.senha || "",
        };
      });

      return res.json(alunos);
    }

    const { data, error } = await supabase.from("pessoa").select("*");

    if (error) return res.status(500).json({ erro: error.message });

    res.json(data);
  } catch (err) {
    console.error("ERRO GERAL:", err);
    res.status(500).json({ erro: err.message });
  }
};

// =========================
// POST - CRIAR ALUNO
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
      plano,
      status,
      matricula,
      senha,
    } = req.body;

    // 1. pessoa
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
      console.error("ERRO PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    // 2. aluno
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
      console.error("ERRO ALUNO:", erroAluno);
      return res.status(500).json({ erro: erroAluno.message });
    }

    // 3. buscar plano
    const { data: planoData, error: erroPlano } = await supabase
      .from("plano")
      .select("id")
      .eq("nome", plano)
      .single();

    if (erroPlano) {
      console.error("ERRO PLANO:", erroPlano);
      return res.status(500).json({ erro: erroPlano.message });
    }

    // 4. assinatura
    const { error: erroAssinatura } = await supabase
      .from("assinatura")
      .insert([
        {
          aluno_id: aluno.id,
          plano_id: planoData.id,
          status,
        },
      ]);

    if (erroAssinatura) {
      console.error("ERRO ASSINATURA:", erroAssinatura);
      return res.status(500).json({ erro: erroAssinatura.message });
    }

    res.json([pessoa]);
  } catch (err) {
    console.error("ERRO GERAL POST:", err);
    res.status(500).json({ erro: err.message });
  }
};

// =========================
// PUT - ATUALIZAR
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
      plano,
      status,
      matricula,
      senha,
    } = req.body;

    // pessoa
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

    // aluno
    const { data: alunoData } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (!alunoData) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const { error: erroAluno } = await supabase
      .from("aluno")
      .update({
        matricula,
        senha,
      })
      .eq("id", alunoData.id);

    if (erroAluno) {
      console.error("ERRO UPDATE ALUNO:", erroAluno);
      return res.status(500).json({ erro: erroAluno.message });
    }

    // plano
    const { data: planoData } = await supabase
      .from("plano")
      .select("id")
      .eq("nome", plano)
      .single();

    // assinatura
    const { error: erroAssinatura } = await supabase
      .from("assinatura")
      .update({
        plano_id: planoData?.id,
        status,
      })
      .eq("aluno_id", alunoData.id);

    if (erroAssinatura) {
      console.error("ERRO UPDATE ASSINATURA:", erroAssinatura);
      return res.status(500).json({ erro: erroAssinatura.message });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("ERRO GERAL PUT:", err);
    res.status(500).json({ erro: err.message });
  }
};

// =========================
// DELETE
// =========================
exports.deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: alunoData } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (alunoData) {
      await supabase.from("assinatura").delete().eq("aluno_id", alunoData.id);
      await supabase.from("aluno").delete().eq("id", alunoData.id);
    }

    await supabase.from("pessoa").delete().eq("id", id);

    res.json({ sucesso: true });
  } catch (err) {
    console.error("ERRO DELETE:", err);
    res.status(500).json({ erro: err.message });
  }
};
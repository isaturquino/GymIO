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
          plano_id: assinatura.plano_id || null,

          matricula: aluno.matricula || "",
          senha: aluno.senha || "",
        };
      });

      return res.json(alunos);
    }

    const { data, error } = await supabase
      .from("pessoa")
      .select("*");

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    res.json(data);

  } catch (err) {
    console.error("ERRO GERAL GET:", err);
    res.status(500).json({ erro: err.message });
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
      plano,
      status,
      matricula,
      senha,
    } = req.body;

    // 1. pessoa
    const { data: pessoa, error: erroPessoa } = await supabase
      .from("pessoa")
      .insert([{
        nome,
        cpf,
        telefone,
        email,
        data_nascimento: dataNascimento,
        endereco,
      }])
      .select()
      .single();

    if (erroPessoa) {
      return res.status(500).json({ erro: erroPessoa.message });
    }

    // 2. aluno
    const { data: aluno, error: erroAluno } = await supabase
      .from("aluno")
      .insert([{
        pessoa_id: pessoa.id,
        matricula,
        senha,
      }])
      .select()
      .single();

    if (erroAluno) {
      return res.status(500).json({ erro: erroAluno.message });
    }

    // 3. plano
    const { data: planoData } = await supabase
      .from("plano")
      .select("id")
      .eq("nome", plano)
      .single();

    // 4. assinatura
    const { error: erroAss } = await supabase
      .from("assinatura")
      .insert([{
        aluno_id: aluno.id,
        plano_id: planoData?.id || null,
        status,
      }]);

    if (erroAss) {
      return res.status(500).json({ erro: erroAss.message });
    }

    res.json({ sucesso: true });

  } catch (err) {
    console.error("ERRO POST:", err);
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

    await supabase
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

    const { data: aluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    await supabase
      .from("aluno")
      .update({
        matricula,
        senha,
      })
      .eq("id", aluno.id);

    const { data: planoData } = await supabase
      .from("plano")
      .select("id")
      .eq("nome", plano)
      .single();

    await supabase
      .from("assinatura")
      .update({
        plano_id: planoData?.id || null,
        status,
      })
      .eq("aluno_id", aluno.id);

    res.json({ sucesso: true });

  } catch (err) {
    console.error("ERRO PUT:", err);
    res.status(500).json({ erro: err.message });
  }
};


// =========================
// DELETE (SOFT DELETE SIMPLIFICADO)
// =========================
exports.deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: aluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (aluno) {
      await supabase.from("assinatura").delete().eq("aluno_id", aluno.id);
      await supabase.from("aluno").delete().eq("id", aluno.id);
    }

    await supabase.from("pessoa").delete().eq("id", id);

    res.json({ sucesso: true });

  } catch (err) {
    console.error("ERRO DELETE:", err);
    res.status(500).json({ erro: err.message });
  }
};
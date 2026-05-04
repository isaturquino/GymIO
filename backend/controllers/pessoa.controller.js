const supabase = require("../config/supabase");

// ==========================
// GET - LISTAR PESSOAS / ALUNOS
// ==========================
exports.getPessoas = async (req, res) => {
  const { tipo } = req.query;

  try {
    if (tipo !== "aluno") {
      const { data, error } = await supabase
        .from("pessoa")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;
      return res.json(data);
    }

    const { data: pessoas, error: errPessoa } = await supabase
      .from("pessoa")
      .select("*")
      .is("deleted_at", null);

    if (errPessoa) throw errPessoa;

    const { data: alunos, error: errAluno } = await supabase
      .from("aluno")
      .select("*")
      .is("deleted_at", null);

    if (errAluno) throw errAluno;

    const { data: assinaturas, error: errAss } = await supabase
      .from("assinatura")
      .select("*")
      .is("deleted_at", null);

    if (errAss) throw errAss;

    const { data: planos, error: errPlano } = await supabase
      .from("plano")
      .select("*")
      .is("deleted_at", null);

    if (errPlano) throw errPlano;

    const resultado = alunos.map((aluno) => {
      const pessoa = pessoas.find((p) => p.id === aluno.pessoa_id);
      const assinatura = assinaturas.find((a) => a.aluno_id === aluno.id);
      const plano = planos.find((p) => p.id === assinatura?.plano_id);

      return {
        id: pessoa?.id,
        aluno_id: aluno.id,
        nome: pessoa?.nome || "",
        cpf: pessoa?.cpf || "",
        telefone: pessoa?.telefone || "",
        email: pessoa?.email || "",
        dataNascimento: pessoa?.data_nascimento || "",
        endereco: pessoa?.endereco || "",
        senha: pessoa?.password || "",
        status: aluno?.status || "Sem status",
        data_matricula: aluno?.data_matricula || "",
        plano: plano?.nome_plano || "Sem plano",
        plano_id: plano?.id || null,
      };
    });

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================
// GET - LISTAR PLANOS
// ==========================
exports.getPlanos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plano")
      .select("*")
      .is("deleted_at", null);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================
// POST - CRIAR PESSOA + ALUNO + ASSINATURA
// ==========================
exports.createPessoa = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      telefone,
      email,
      dataNascimento,
      endereco,
      senha,
      plano_id,
    } = req.body;

    const { data: pessoa, error: errPessoa } = await supabase
      .from("pessoa")
      .insert([
        {
          nome,
          cpf,
          telefone,
          email,
          endereco,
          data_nascimento: dataNascimento,
          password: senha,
        },
      ])
      .select()
      .single();

    if (errPessoa) throw errPessoa;

    const { data: aluno, error: errAluno } = await supabase
      .from("aluno")
      .insert([
        {
          pessoa_id: pessoa.id,
          status: "Ativo",
          data_matricula: new Date(),
        },
      ])
      .select()
      .single();

    if (errAluno) throw errAluno;

    let assinatura = null;

    if (plano_id) {
      const { data: assData, error: errAss } = await supabase
        .from("assinatura")
        .insert([
          {
            aluno_id: aluno.id,
            plano_id,
            data_inicio: new Date(),
            status_assinatura: "Ativa",
          },
        ])
        .select()
        .single();

      if (errAss) throw errAss;
      assinatura = assData;
    }

    res.json({ pessoa, aluno, assinatura });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================
// PUT - EDITAR
// ==========================
exports.updatePessoa = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      nome,
      cpf,
      telefone,
      email,
      dataNascimento,
      endereco,
      status,
      plano_id,
      senha,
    } = req.body;

    // Atualiza pessoa (com senha se vier preenchida)
    const { error: errPessoa } = await supabase
      .from("pessoa")
      .update({
        nome,
        cpf,
        telefone,
        email,
        endereco,
        data_nascimento: dataNascimento,
        ...(senha ? { password: senha } : {}),
      })
      .eq("id", id);

    if (errPessoa) throw errPessoa;

    // Busca aluno vinculado
    const { data: aluno } = await supabase
      .from("aluno")
      .select("*")
      .eq("pessoa_id", id)
      .single();

    if (aluno) {
      // Atualiza status
      await supabase
        .from("aluno")
        .update({ status })
        .eq("id", aluno.id);

      // Atualiza plano
      if (plano_id) {
        const { data: assExistente } = await supabase
          .from("assinatura")
          .select("*")
          .eq("aluno_id", aluno.id)
          .single();

        if (assExistente) {
          await supabase
            .from("assinatura")
            .update({ plano_id })
            .eq("aluno_id", aluno.id);
        } else {
          await supabase.from("assinatura").insert([
            {
              aluno_id: aluno.id,
              plano_id,
              data_inicio: new Date(),
              status_assinatura: "Ativa",
            },
          ]);
        }
      }
    }

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================
// DELETE (SOFT DELETE)
// ==========================
exports.deletePessoa = async (req, res) => {
  const { id } = req.params;

  try {
    const now = new Date();

    await supabase.from("pessoa").update({ deleted_at: now }).eq("id", id);

    const { data: aluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .single();

    if (aluno) {
      await supabase
        .from("aluno")
        .update({ deleted_at: now })
        .eq("id", aluno.id);

      await supabase
        .from("assinatura")
        .update({ deleted_at: now })
        .eq("aluno_id", aluno.id);
    }

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================
// GET - TOTAL DE ALUNOS
// ==========================
exports.getTotalAlunos = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("aluno")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null);

    if (error) throw error;
    res.json({ totalAlunos: count });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
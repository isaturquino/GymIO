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
          *,
          aluno!inner (
            id,
            status,
            data_matricula,
            assinatura (
              id,
              plano_id,
              status_assinatura,
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

      const alunos = data.map((pessoa) => {
        const aluno = pessoa.aluno?.[0] || {};
        const assinatura = aluno.assinatura?.[0] || {};
        const plano = assinatura.plano || {};

        return {
          id: pessoa.id,
          nome: pessoa.nome,
          cpf: pessoa.cpf,
          telefone: pessoa.telefone,
          email: pessoa.email,
          dataNascimento: pessoa.data_nascimento,
          data_nascimento: pessoa.data_nascimento,
          endereco: pessoa.endereco,
          plano: plano.nome_plano || "",
          plano_id: assinatura.plano_id || "",
          status: assinatura.status_assinatura || aluno.status || "",
          status_assinatura:
            assinatura.status_assinatura || aluno.status || "",
          matricula: aluno.data_matricula || "",
          senha: pessoa.password || "",
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
// POST - CRIAR PESSOA
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
      senha,
      isAluno,
      plano_id,
      status,
      data_matricula,
      dataMatricula,
      isFuncionario,
      cargo_id,
      data_admissao,
      dataAdmissao,
    } = req.body;

    if (!isAluno && !isFuncionario) {
      return res.status(400).json({
        erro: "Selecione se a pessoa é aluno, funcionário ou ambos.",
      });
    }

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
          password: senha,
        },
      ])
      .select()
      .single();

    if (erroPessoa) {
      console.error("ERRO CREATE PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    let alunoCriado = null;
    let funcionarioCriado = null;
    const dataAtual = new Date().toISOString().split("T")[0];
    const dataDaMatricula = data_matricula || dataMatricula || dataAtual;

    if (isAluno) {
      const { data: aluno, error: erroAluno } = await supabase
        .from("aluno")
        .insert([
          {
            pessoa_id: pessoa.id,
            status: status || "Ativo",
            data_matricula: dataDaMatricula,
          },
        ])
        .select()
        .single();

      if (erroAluno) {
        console.error("ERRO CREATE ALUNO:", erroAluno);
        return res.status(500).json({ erro: erroAluno.message });
      }

      alunoCriado = aluno;

      const { error: erroAssinatura } = await supabase
        .from("assinatura")
        .insert([
          {
            aluno_id: aluno.id,
            plano_id: plano_id || null,
            status_assinatura: status || "Ativo",
            data_inicio: dataDaMatricula,
            data_assinatura: dataDaMatricula,
          },
        ]);

      if (erroAssinatura) {
        console.error("ERRO CREATE ASSINATURA:", erroAssinatura);
        return res.status(500).json({ erro: erroAssinatura.message });
      }
    }

    if (isFuncionario) {
      const { data: funcionario, error: erroFuncionario } = await supabase
        .from("funcionario")
        .insert([
          {
            pessoa_id: pessoa.id,
            cargo_id: cargo_id || null,
            data_admissao: data_admissao || dataAdmissao || dataAtual,
            status: "Ativo",
          },
        ])
        .select()
        .single();

      if (erroFuncionario) {
        console.error("ERRO CREATE FUNCIONARIO:", erroFuncionario);
        return res.status(500).json({ erro: erroFuncionario.message });
      }

      funcionarioCriado = funcionario;
    }

    return res.status(201).json({
      sucesso: true,
      pessoa,
      aluno: alunoCriado,
      funcionario: funcionarioCriado,
    });
  } catch (err) {
    console.error("ERRO GERAL POST:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// PUT - ATUALIZAR PESSOA / ALUNO
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
      senha,
      isAluno,
      plano_id,
      status,
      data_matricula,
      dataMatricula,
    } = req.body;

    const { data: pessoa, error: erroPessoa } = await supabase
      .from("pessoa")
      .update({
        nome,
        cpf,
        telefone,
        email,
        data_nascimento: dataNascimento,
        endereco,
        password: senha,
      })
      .eq("id", id)
      .select()
      .single();

    if (erroPessoa) {
      console.error("ERRO UPDATE PESSOA:", erroPessoa);
      return res.status(500).json({ erro: erroPessoa.message });
    }

    if (isAluno !== false) {
      let { data: aluno, error: erroBuscaAluno } = await supabase
        .from("aluno")
        .select("id")
        .eq("pessoa_id", id)
        .maybeSingle();

      if (erroBuscaAluno) {
        console.error("ERRO BUSCA ALUNO:", erroBuscaAluno);
        return res.status(500).json({ erro: erroBuscaAluno.message });
      }

      if (!aluno) {
        const dataDaMatricula =
          data_matricula ||
          dataMatricula ||
          new Date().toISOString().split("T")[0];
        const { data: novoAluno, error: erroCriarAluno } = await supabase
          .from("aluno")
          .insert([
            {
              pessoa_id: id,
              status: status || "Ativo",
              data_matricula: dataDaMatricula,
            },
          ])
          .select("id")
          .single();

        if (erroCriarAluno) {
          console.error("ERRO CRIAR ALUNO NO UPDATE:", erroCriarAluno);
          return res.status(500).json({ erro: erroCriarAluno.message });
        }

        aluno = novoAluno;
      } else {
        const { error: erroAluno } = await supabase
          .from("aluno")
          .update({ status: status || "Ativo" })
          .eq("id", aluno.id);

        if (erroAluno) {
          console.error("ERRO UPDATE ALUNO:", erroAluno);
          return res.status(500).json({ erro: erroAluno.message });
        }
      }

      const {
        data: assinaturaExistente,
        error: erroBuscaAssinatura,
      } = await supabase
        .from("assinatura")
        .select("id")
        .eq("aluno_id", aluno.id)
        .maybeSingle();

      if (erroBuscaAssinatura) {
        console.error("ERRO BUSCA ASSINATURA:", erroBuscaAssinatura);
        return res.status(500).json({ erro: erroBuscaAssinatura.message });
      }

      if (assinaturaExistente) {
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
      } else {
        const dataInicio =
          data_matricula ||
          dataMatricula ||
          new Date().toISOString().split("T")[0];
        const { error: erroCriarAssinatura } = await supabase
          .from("assinatura")
          .insert([
            {
              aluno_id: aluno.id,
              plano_id: plano_id || null,
              status_assinatura: status || "Ativo",
              data_inicio: dataInicio,
              data_assinatura: dataInicio,
            },
          ]);

        if (erroCriarAssinatura) {
          console.error("ERRO CRIAR ASSINATURA:", erroCriarAssinatura);
          return res.status(500).json({ erro: erroCriarAssinatura.message });
        }
      }
    }

    return res.json({
      sucesso: true,
      mensagem: "Pessoa atualizada com sucesso",
      pessoa,
    });
  } catch (err) {
    console.error("ERRO GERAL PUT:", err);
    return res.status(500).json({ erro: err.message });
  }
};

// =========================
// DELETE - EXCLUIR PESSOA / ALUNO
// =========================
exports.deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;
    const dataExclusao = new Date().toISOString();

    const { data: aluno, error: erroBuscaAluno } = await supabase
      .from("aluno")
      .select("id")
      .eq("pessoa_id", id)
      .maybeSingle();

    if (erroBuscaAluno) {
      console.error("ERRO BUSCA ALUNO DELETE:", erroBuscaAluno);
      return res.status(500).json({ erro: erroBuscaAluno.message });
    }

    if (aluno) {
      const { error: erroAssinatura } = await supabase
        .from("assinatura")
        .update({
          deleted_at: dataExclusao,
          status_assinatura: "Inativo",
        })
        .eq("aluno_id", aluno.id);

      if (erroAssinatura) {
        console.error("ERRO DELETE ASSINATURA:", erroAssinatura);
        return res.status(500).json({ erro: erroAssinatura.message });
      }

      const { error: erroAcesso } = await supabase
        .from("acesso")
        .update({ deleted_at: dataExclusao })
        .eq("aluno_id", aluno.id);

      if (erroAcesso) {
        console.error("ERRO DELETE ACESSO:", erroAcesso);
        return res.status(500).json({ erro: erroAcesso.message });
      }

      const { error: erroAluno } = await supabase
        .from("aluno")
        .update({
          deleted_at: dataExclusao,
          status: "Inativo",
        })
        .eq("id", aluno.id);

      if (erroAluno) {
        console.error("ERRO DELETE ALUNO:", erroAluno);
        return res.status(500).json({ erro: erroAluno.message });
      }
    }

    const { error: erroPessoa } = await supabase
      .from("pessoa")
      .update({ deleted_at: dataExclusao })
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
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null);

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.json({ total: count, totalAlunos: count });
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

// =========================
// GET - CARGOS
// =========================
exports.getCargos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cargo")
      .select("id, nome_cargo, salario_base")
      .is("deleted_at", null)
      .order("nome_cargo", { ascending: true });

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

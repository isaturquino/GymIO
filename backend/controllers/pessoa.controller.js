const supabase = require("../config/supabase");

/**
 * =========================
 * VALIDADORES
 * =========================
 */

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

const isValidCPF = (cpf) => {
  return cpf && cpf.replace(/\D/g, "").length === 11;
};

const requiredFields = (fields, body) => {
  return fields.filter(
    (f) => !body[f] || body[f].toString().trim() === ""
  );
};

/**
 * =========================
 * GET PESSOAS
 * =========================
 */
exports.getPessoas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pessoa")
      .select("*")
      .is("deleted_at", null)
      .order("id", { ascending: false });

    if (error) return res.status(500).json({ erro: error.message });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

/**
 * =========================
 * POST - CRIAR PESSOA
 * =========================
 */
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
      isFuncionario,
      plano_id,
      cargo_id,
      status,
      data_matricula,
      data_admissao,
    } = req.body;

    // VALIDACAO
    const missing = requiredFields(
      ["nome", "cpf", "telefone", "email"],
      req.body
    );

    if (missing.length)
      return res.status(400).json({
        erro: "Campos obrigatórios faltando",
        campos: missing,
      });

    if (!isValidEmail(email))
      return res.status(400).json({ erro: "Email inválido" });

    if (!isValidCPF(cpf))
      return res.status(400).json({ erro: "CPF inválido" });

    if (!isAluno && !isFuncionario)
      return res.status(400).json({
        erro: "Marque aluno ou funcionário",
      });

    // CRIAR PESSOA
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

    if (erroPessoa)
      return res.status(500).json({ erro: erroPessoa.message });

    const hoje = new Date().toISOString().split("T")[0];

    let aluno = null;
    let funcionario = null;

    // ALUNO
    if (isAluno) {
      const { data, error } = await supabase
        .from("aluno")
        .insert([
          {
            pessoa_id: pessoa.id,
            status: status || "Ativo",
            data_matricula: data_matricula || hoje,
          },
        ])
        .select()
        .single();

      if (error)
        return res.status(500).json({ erro: error.message });

      aluno = data;

      await supabase.from("assinatura").insert([
        {
          aluno_id: aluno.id,
          plano_id: plano_id || null,
          status_assinatura: status || "Ativo",
          data_inicio: data_matricula || hoje,
          data_assinatura: data_matricula || hoje,
        },
      ]);
    }

    // FUNCIONÁRIO
    if (isFuncionario) {
      const { data, error } = await supabase
        .from("funcionario")
        .insert([
          {
            pessoa_id: pessoa.id,
            cargo_id: cargo_id || null,
            data_admissao: data_admissao || hoje,
            status: "Ativo",
          },
        ])
        .select()
        .single();

      if (error)
        return res.status(500).json({ erro: error.message });

      funcionario = data;
    }

    return res.status(201).json({
      sucesso: true,
      pessoa,
      aluno,
      funcionario,
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

/**
 * =========================
 * UPDATE
 * =========================
 */
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
      status,
    } = req.body;

    if (!id) {
      return res.status(400).json({ erro: "ID obrigatório" });
    }

    const { data, error } = await supabase
      .from("pessoa")
      .update({
        nome,
        cpf,
        telefone,
        email,
        data_nascimento: dataNascimento, // 👈 AQUI está o problema corrigido
        endereco,
        password: senha,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    if (!data) {
      return res.status(404).json({ erro: "Pessoa não encontrada" });
    }

    return res.json({
      sucesso: true,
      pessoa: data,
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

/**
 * =========================
 * DELETE (LOGICO)
 * =========================
 */
exports.deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("pessoa")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error)
      return res.status(500).json({ erro: error.message });

    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

/**
 * =========================
 * EXTRAS
 * =========================
 */
exports.getTotalAlunos = async (_, res) => {
  const { count, error } = await supabase
    .from("aluno")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  if (error) return res.status(500).json({ erro: error.message });

  return res.json({ total: count });
};

exports.getPlanos = async (_, res) => {
  const { data, error } = await supabase
    .from("plano")
    .select("*")
    .is("deleted_at", null);

  if (error) return res.status(500).json({ erro: error.message });

  return res.json(data);
};

exports.getCargos = async (_, res) => {
  const { data, error } = await supabase
    .from("cargo")
    .select("id, nome_cargo, salario_base")
    .is("deleted_at", null);

  if (error) return res.status(500).json({ erro: error.message });

  return res.json(data);
};
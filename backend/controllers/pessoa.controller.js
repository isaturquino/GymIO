const supabase = require("../config/supabase");

// 🔥 LISTAR
const getPessoas = async (req, res) => {
  const { data, error } = await supabase
    .from("pessoa")
    .select("*")
    .is("deleted_at", null);

  if (error) {
    console.log("GET ERROR:", error);
    return res.status(500).json(error);
  }

  return res.json(data);
};

// 🔥 CRIAR
const createPessoa = async (req, res) => {
  try {
    const body = req.body;

    const camposObrigatorios = [
      "nome",
      "cpf",
      "rg",
      "telefone",
      "endereco",
      "data_nascimento",
    ];

    for (let campo of camposObrigatorios) {
      if (!body[campo]) {
        return res.status(400).json({
          erro: `Campo obrigatório faltando: ${campo}`,
        });
      }
    }

    let data_nascimento = body.data_nascimento.replace(/\D/g, "");

    if (data_nascimento.length === 8) {
      data_nascimento = `${data_nascimento.slice(4)}-${data_nascimento.slice(
        2,
        4
      )}-${data_nascimento.slice(0, 2)}`;
    }

    const { data, error } = await supabase
      .from("pessoa")
      .insert([
        {
          nome: body.nome,
          cpf: body.cpf,
          rg: body.rg,
          telefone: body.telefone,
          endereco: body.endereco,
          data_nascimento,
        },
      ])
      .select();

    if (error) {
      console.log("🔥 ERRO SUPABASE:", error);
      return res.status(500).json(error);
    }

    return res.json(data);
  } catch (err) {
    console.log("🔥 ERRO GERAL:", err);
    return res.status(500).json(err);
  }
};

// 🔥 ATUALIZAR
const updatePessoa = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("pessoa")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) return res.status(500).json(error);

  return res.json(data);
};

// 🔥 DELETAR (soft delete)
const deletePessoa = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("pessoa")
    .update({ deleted_at: new Date() })
    .eq("id", id);

  if (error) return res.status(500).json(error);

  return res.json({ message: "Deletado com sucesso" });
};

module.exports = {
  getPessoas,
  createPessoa,
  updatePessoa,
  deletePessoa,
};
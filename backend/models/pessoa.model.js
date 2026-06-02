const supabase = require("../config/supabase");

// LISTAR TODOS
const getAllPessoas = async () => {
  const { data, error } = await supabase
    .from("pessoa")
    .select("*")
    .is("deleted_at", null)
    .order("id", { ascending: false });

  if (error) throw error;

  return data;
};

// BUSCAR POR ID
const getPessoaById = async (id) => {
  const { data, error } = await supabase
    .from("pessoa")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  return data;
};

// CRIAR
const createPessoa = async (pessoa) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    dataNascimento,
    endereco,
    senha,
  } = pessoa;

  const { data, error } = await supabase
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

  if (error) throw error;

  return data;
};

// ATUALIZAR
const updatePessoa = async (id, pessoa) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    dataNascimento,
    endereco,
    senha,
  } = pessoa;

  const { data, error } = await supabase
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

  if (error) throw error;

  return data;
};

// DELETAR LÓGICO
const deletePessoa = async (id) => {
  const { error } = await supabase
    .from("pessoa")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
};

module.exports = {
  getAllPessoas,
  getPessoaById,
  createPessoa,
  updatePessoa,
  deletePessoa,
};
const pool = require("../config/supabase"); // seu pool do pg

// LISTAR TODOS
const getAllPessoas = async () => {
  const result = await pool.query("SELECT * FROM pessoa ORDER BY id DESC");
  return result.rows;
};

// BUSCAR POR ID
const getPessoaById = async (id) => {
  const result = await pool.query("SELECT * FROM pessoa WHERE id = $1", [id]);
  return result.rows[0];
};

// CRIAR
const createPessoa = async (pessoa) => {
  const { nome, cpf, telefone, plano, status } = pessoa;

  const result = await pool.query(
    `INSERT INTO pessoa (nome, cpf, telefone, plano, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nome, cpf, telefone, plano, status || "ativo"]
  );

  return result.rows[0];
};

// ATUALIZAR
const updatePessoa = async (id, pessoa) => {
  const { nome, cpf, telefone, plano, status } = pessoa;

  const result = await pool.query(
    `UPDATE pessoa
     SET nome=$1, cpf=$2, telefone=$3, plano=$4, status=$5
     WHERE id=$6
     RETURNING *`,
    [nome, cpf, telefone, plano, status, id]
  );

  return result.rows[0];
};

// DELETAR
const deletePessoa = async (id) => {
  await pool.query("DELETE FROM pessoa WHERE id=$1", [id]);
};

module.exports = {
  getAllPessoas,
  getPessoaById,
  createPessoa,
  updatePessoa,
  deletePessoa,
};
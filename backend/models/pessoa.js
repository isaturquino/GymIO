import { pool } from '../config/database.js'

export const Pessoa = {
  async create(data) {
    const query = `
      INSERT INTO pessoa (nome, cpf, email, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [data.nome, data.cpf, data.email, data.telefone]

    const result = await pool.query(query, values)
    return result.rows[0]
  },

  async findAll() {
    const result = await pool.query(
      'SELECT * FROM pessoa WHERE deleted_at IS NULL'
    )
    return result.rows
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM pessoa WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  async update(id, data) {
    const query = `
      UPDATE pessoa
      SET nome=$1, cpf=$2, email=$3, telefone=$4
      WHERE id=$5
      RETURNING *
    `
    const values = [data.nome, data.cpf, data.email, data.telefone, id]

    const result = await pool.query(query, values)
    return result.rows[0]
  },

  async delete(id) {
    await pool.query(
      'UPDATE pessoa SET deleted_at = NOW() WHERE id = $1',
      [id]
    )
  }
}
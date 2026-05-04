import { Pessoa } from '../models/pessoa.js'

export const create = async (req, res) => {
  try {
    const pessoa = await Pessoa.create(req.body)
    res.json(pessoa)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

export const list = async (req, res) => {
  try {
    const pessoas = await Pessoa.findAll()
    res.json(pessoas)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

export const getById = async (req, res) => {
  try {
    const pessoa = await Pessoa.findById(req.params.id)
    res.json(pessoa)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

export const update = async (req, res) => {
  try {
    const pessoa = await Pessoa.update(req.params.id, req.body)
    res.json(pessoa)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

export const remove = async (req, res) => {
  try {
    await Pessoa.delete(req.params.id)
    res.json({ message: 'Deletado com sucesso' })
  } catch (err) {
    res.status(500).json(err.message)
  }
}
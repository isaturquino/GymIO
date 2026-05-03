import express from 'express'
import dotenv from 'dotenv'

// rotas
import pessoaRoutes from './routes/pessoa.routes.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()

// middleware
app.use(express.json())

// rotas
app.use('/pessoas', pessoaRoutes)
app.use('/auth', authRoutes)

// rota teste
app.get('/', (req, res) => {
  res.send('API rodando')
})

export default app
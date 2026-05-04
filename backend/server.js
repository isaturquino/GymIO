import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(cors());
app.use(express.json());

// ======================
// ROTAS
// ======================
const alunoRoutes = require('./routes/alunoRoutes');
app.use('/alunos', alunoRoutes);
import authRoutes from "./routes/auth.routes.js";

app.use("/auth", authRoutes);

// (depois você adiciona outras)
// import alunosRoutes from "./routes/alunos.routes.js";
// app.use("/alunos", alunosRoutes);

// ======================
// ROTA TESTE
// ======================
app.get("/", (req, res) => {
  res.json({ message: "API GymIO rodando" });
});

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
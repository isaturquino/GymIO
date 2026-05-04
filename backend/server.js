require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// ROTAS
// ======================
const pessoaRoutes = require("./routes/pessoa.routes");
const alunoRoutes = require("./routes/alunoRoutes");

app.use("/pessoas", pessoaRoutes);
app.use("/alunos", alunoRoutes);

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
  console.log("Servidor rodando na porta", PORT);
});
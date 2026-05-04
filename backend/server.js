require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const pessoaRoutes = require("./routes/pessoa.routes");

app.use("/pessoas", pessoaRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
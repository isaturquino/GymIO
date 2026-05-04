require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pessoaRoutes = require("./routes/pessoa.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pessoas", pessoaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API GymIO rodando" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
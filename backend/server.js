require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pessoaRoutes = require("./routes/pessoa.routes");
const authRoutes = require("./routes/auth.routes");
const planosRoutes = require("./routes/planos.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ROTAS
app.use("/api/pessoas", pessoaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/planos", planosRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ message: "API GymIO rodando" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
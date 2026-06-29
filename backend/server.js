require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pessoaRoutes = require("./routes/pessoa.routes");
const authRoutes = require("./routes/auth.routes");
// const dashboardRoutes = require("./routes/dashboard.routes");
const planosRoutes = require("./routes/planos.routes");
const funcionariosRoutes = require("./routes/funcionarios.routes");

const app = express();

const cookieParser = require("cookie-parser");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/pessoas", pessoaRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/dashboard", dashboardRoutes);
app.use("/api/planos", planosRoutes);
app.use("/api/funcionarios", funcionariosRoutes);




app.get("/", (req, res) => {
  res.json({ message: "API GymIO rodando" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

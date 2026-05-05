require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pessoaRoutes = require("./routes/pessoa.routes");
const authRoutes = require("./routes/auth.routes");

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


app.get("/", (req, res) => {
  res.json({ message: "API GymIO rodando" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
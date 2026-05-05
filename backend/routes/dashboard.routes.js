const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, (req, res) => {
  res.json({ mensagem: "Acesso liberado", user: req.user });
});

module.exports = router;
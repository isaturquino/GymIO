const express = require("express");
const router = express.Router();
const controller = require("../controllers/pessoa.controller");

// =========================
// GET
// =========================
router.get("/", controller.getPessoas);

// adicionais úteis
router.get("/total-alunos", controller.getTotalAlunos);
router.get("/planos", controller.getPlanos);

// =========================
// CRUD
// =========================
router.get("/", controller.getPessoas);
router.post("/", controller.createPessoa);
router.put("/:id", controller.updatePessoa);
router.delete("/:id", controller.deletePessoa);

module.exports = router;
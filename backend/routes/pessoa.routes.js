const express = require("express");
const router = express.Router();

const {
  getPessoas,
  createPessoa,
  updatePessoa,
  deletePessoa,
} = require("../controllers/pessoa.controller");

router.get("/", getPessoas);
router.post("/", createPessoa);
router.put("/:id", updatePessoa);
router.delete("/:id", deletePessoa);

module.exports = router;
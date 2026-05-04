const express = require("express");
const router = express.Router();
const controller = require("../controllers/pessoa.controller");

router.get("/", controller.getPessoas);
router.post("/", controller.createPessoa);
router.put("/:id", controller.updatePessoa);
router.delete("/:id", controller.deletePessoa);

module.exports = router;
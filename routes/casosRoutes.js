import express from "express";
import * as casosController from "../controllers/casosController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  casosController.obterCasos,
  casosController.obterCasosAgenteId,
  casosController.obterCasosStatus
);

router.get("/:id/agente", authMiddleware, casosController.obterAgenteDoCaso);

router.get(
  "/search",
  authMiddleware,
  casosController.paginaSearch,
  casosController.pesquisarCasos
);

router.get("/:id", authMiddleware, casosController.obterUmCaso);

router.post("/", authMiddleware, casosController.criarCaso);

router.put("/:id", authMiddleware, casosController.atualizarCaso);

router.patch("/:id", authMiddleware, casosController.atualizarCaso);

router.delete("/:id", authMiddleware, casosController.apagarCaso);

export default router;

import express from "express";
import * as agentesController from "../controllers/agentesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  agentesController.obterAgentes,
  agentesController.obterAgentesCargo,
  agentesController.obterAgentesSort
);

router.get("/:id", agentesController.obterUmAgente);

router.get("/:id/casos", authMiddleware, agentesController.obterCasosDoAgente);

router.post("/", authMiddleware, agentesController.criarAgente);

router.put("/:id", authMiddleware, agentesController.atualizarAgente);

router.patch("/:id", authMiddleware, agentesController.atualizarAgente);

router.delete("/:id", authMiddleware, agentesController.apagarAgente);

export default router;

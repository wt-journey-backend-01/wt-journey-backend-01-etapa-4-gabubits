import express from "express";
import * as agentesController from "../controllers/agentesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/agents",
  authMiddleware,
  agentesController.obterAgentes,
  agentesController.obterAgentesCargo,
  agentesController.obterAgentesSort
);

router.get("/agents/:id", authMiddleware, agentesController.obterUmAgente);

router.get(
  "/agents/:id/casos",
  authMiddleware,
  agentesController.obterCasosDoAgente
);

router.post("/agents", authMiddleware, agentesController.criarAgente);

router.put("/agents/:id", authMiddleware, agentesController.atualizarAgente);

router.patch("/agents/:id", authMiddleware, agentesController.atualizarAgente);

router.delete("/agents/:id", authMiddleware, agentesController.apagarAgente);

export default router;

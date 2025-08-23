import express from "express";
import * as agentesController from "../controllers/agentesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/agentes",
  authMiddleware,
  agentesController.obterAgentes,
  agentesController.obterAgentesCargo,
  agentesController.obterAgentesSort
);

router.get("/agentes/:id", authMiddleware, agentesController.obterUmAgente);

router.get(
  "/agentes/:id/casos",
  authMiddleware,
  agentesController.obterCasosDoAgente
);

router.post("/agentes", authMiddleware, agentesController.criarAgente);

router.put("/agentes/:id", authMiddleware, agentesController.atualizarAgente);

router.patch("/agentes/:id", authMiddleware, agentesController.atualizarAgente);

router.delete("/agentes/:id", authMiddleware, agentesController.apagarAgente);

export default router;

import express from "express";
import * as agentesController from "../controllers/agentesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/agents",
  agentesController.obterAgentes,
  agentesController.obterAgentesCargo,
  agentesController.obterAgentesSort
);

router.get("/agents/:id", agentesController.obterUmAgente);

router.get("/agents/:id/casos", agentesController.obterCasosDoAgente);

router.post("/agents", agentesController.criarAgente);

router.put("/agents/:id", agentesController.atualizarAgente);

router.patch("/agents/:id", agentesController.atualizarAgente);

router.delete("/agents/:id", agentesController.apagarAgente);

export default router;

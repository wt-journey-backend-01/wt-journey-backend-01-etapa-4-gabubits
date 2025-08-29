import express from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", authController.registrarUsuario);

router.post("/auth/login", authController.loginUsuario);

router.delete("/users/:id", authController.apagarUsuario);

router.post("/auth/logout", authController.logoutUsuario);

router.get("/usuarios/me", authMiddleware, authController.usuarioLogado);

export default router;

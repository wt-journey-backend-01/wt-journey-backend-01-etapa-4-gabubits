import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/register", authController.registrarUsuario);

router.post("/auth/login", authController.loginUsuario);

router.delete("/users/:id", authController.apagarUsuario);

router.post("/auth/logout", authController.logoutUsuario);

export default router;

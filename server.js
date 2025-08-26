import express from "express";
import agentesRoutes from "./routes/agentesRoutes.js";
import casosRoutes from "./routes/casosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use("/casos", authMiddleware, casosRoutes);
app.use("/agentes", authMiddleware, agentesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Servidor do Departamento de Polícia rodando em localhost:${PORT}`
  );
});

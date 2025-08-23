import * as Errors from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.headers.authorization;

    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      throw new Errors.TokenError({
        token: "Token não encontrado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (e) {
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      return next(
        new Errors.TokenError({ token: "Token inválido ou expirado" })
      );
    }
    next(e);
  }
}

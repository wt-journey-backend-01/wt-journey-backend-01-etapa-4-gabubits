import * as Errors from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const cookieToken = req.cookies?.access_token;
    const authHeader = req.headers["authorization"];
    const headerToken = authHeader && authHeader.split(" ")[1];

    const token = cookieToken || headerToken;

    if (!token) {
      throw new Errors.TokenError({
        access_token: "Token não fornecido",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (error, user) => {
      if (error) {
        throw new Errors.TokenError({
          access_token: "Token inválido ou expirado",
        });
      }

      req.user = user;
      return next();
    });
  } catch (e) {
    return next(e);
  }
}

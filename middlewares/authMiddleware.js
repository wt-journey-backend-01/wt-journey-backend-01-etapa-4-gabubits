import * as Errors from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    console.log("Header recebido:\n", req.headers);
    console.log("Body recebido:\n", req.body);
    console.log("Method: ", req.method);
    console.log("Route: ", req.path);

    const tokenHeader = req.headers["authorization"];

    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      throw new Errors.TokenError({
        token: "Token não encontrado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    return next();
  } catch (e) {
    return next(e);
  }
}

import db from "../db/db.js";

// POST /auth/register
export async function criarUsuario(dados) {
  const result = await db("usuarios").insert(dados, "*");
  return result.length ? result[0] : undefined;
}

export async function obterUsuario(email) {
  return await db("usuarios").whereILike("email", email).first();
}

export async function apagarUsuario(id) {
  const result = await db("usuarios").where({ id }).del("*");
  return result.length ? true : false;
}

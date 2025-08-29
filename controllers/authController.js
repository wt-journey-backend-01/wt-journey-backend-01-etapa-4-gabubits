import { z } from "zod";
import {
  usuarioRegSchema,
  usuarioLoginSchema,
  idSchema,
} from "../utils/schemas.js";
import * as usuariosRepository from "../repositories/usuariosRepository.js";
import * as Errors from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registrarUsuario(req, res, next) {
  try {
    const body_parse = usuarioRegSchema.safeParse(req.body);
    if (!body_parse.success) {
      const { formErrors, fieldErrors } = z.flattenError(body_parse.error);
      throw new Errors.InvalidFormatError({
        ...(formErrors.length ? { bodyFormat: formErrors } : {}),
        ...fieldErrors,
      });
    }

    const usuario_existe = await usuariosRepository.obterUsuario(
      body_parse.data.email
    );

    if (usuario_existe) {
      throw new Errors.EmailExistsError({
        email: `O email '${body_parse.data.email}' já está em uso.`,
      });
    }

    const salt = await bcrypt.genSalt(
      parseInt(process.env.SALT_ROUNDS || "10")
    );
    const hashedPassword = await bcrypt.hash(body_parse.data.senha, salt);

    await usuariosRepository.criarUsuario({
      ...body_parse.data,
      senha: hashedPassword,
    });

    return res.status(201).json(body_parse.data);
  } catch (e) {
    return next(e);
  }
}

export async function loginUsuario(req, res, next) {
  try {
    const body_parse = usuarioLoginSchema.safeParse(req.body);

    if (!body_parse.success) {
      const { formErrors, fieldErrors } = z.flattenError(body_parse.error);
      throw new Errors.InvalidFormatError({
        ...(formErrors.length ? { bodyFormat: formErrors } : {}),
        ...fieldErrors,
      });
    }

    const usuario_existe = await usuariosRepository.obterUsuario(
      body_parse.data.email
    );

    if (!usuario_existe) {
      throw new Errors.UserNotFoundError({
        user: `O usuário com o email '${body_parse.data.email}' não foi encontrado.`,
      });
    }

    const senha_valida = await bcrypt.compare(
      body_parse.data.senha,
      usuario_existe.senha
    );

    if (!senha_valida) {
      throw new Errors.InvalidPasswordError({
        senha: "A senha é inválida.",
      });
    }

    const token = jwt.sign(usuario_existe, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      access_token: token,
    });
  } catch (e) {
    return next(e);
  }
}

export async function apagarUsuario(req, res, next) {
  try {
    const id_parse = idSchema.safeParse(req.params);

    if (!id_parse.success)
      throw new Errors.InvalidIdError(
        z.flattenError(id_parse.error).fieldErrors
      );

    const usuario_apagado = await usuariosRepository.apagarUsuario(
      id_parse.data.id
    );

    if (!usuario_apagado)
      throw new Errors.IdNotFoundError({
        id: `O ID '${id_parse.data.id}' não existe nos usuarios`,
      });

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
}

export async function logoutUsuario(req, res, next) {
  try {
    req.user = undefined;

    return res.status(200).json({
      logout: "Logout realizado com sucesso!",
    });
  } catch (e) {
    return next(e);
  }
}

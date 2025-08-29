class APIError extends Error {
  constructor(status, message, errors) {
    super(status, message, errors);

    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export class InvalidIdError extends APIError {
  constructor(errors) {
    super(404, "ID inválido", errors);
  }
}

export class IdNotFoundError extends APIError {
  constructor(errors) {
    super(404, "ID inexistente", errors);
  }
}

export class InvalidFormatError extends APIError {
  constructor(errors) {
    super(400, "Parâmetros inválidos", errors);
  }
}

export class InvalidQueryError extends APIError {
  constructor(errors) {
    super(400, "Query inválida", errors);
  }
}

export class NotFoundRouteError extends APIError {
  constructor(errors) {
    super(404, "Endpoint inexistente", errors);
  }
}

export class EmailExistsError extends APIError {
  constructor(errors) {
    super(400, "Email existente", errors);
  }
}

export class UserNotFoundError extends APIError {
  constructor(errors) {
    super(401, "Usuário não encontrado", errors);
  }
}

export class InvalidPasswordError extends APIError {
  constructor(errors) {
    super(401, "Senha inválida", errors);
  }
}

export class TokenError extends APIError {
  constructor(errors) {
    super(401, "Token inválido", errors);
  }
}

export function errorHandler(err, req, res, next) {
  const { status, message, errors } = err;
  if (err instanceof TokenError) {
    return res.status(401).json({ status, message, errors });
  }
  return res.status(status || 500).send({ status, message, errors });
}

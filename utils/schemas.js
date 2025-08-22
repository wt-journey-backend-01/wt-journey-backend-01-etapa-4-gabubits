import { z } from "zod";

const baseIdSchema = (id = "id") => ({
  [id]: z
    .string({
      error: (issue) => {
        if (!issue.input) return `${id} é um campo obrigatório.`;
      },
    })
    .min(1, `${id} não pode ser vazio`)
    .regex(/^[1-9]\d*$/, `${id} deve ser um número inteiro positivo`)
    .transform((value) => Number(value)),
});

export const idSchema = z.object(baseIdSchema());
export const agenteIdSchema = z.object(baseIdSchema("agente_id"));
export const casoIdSchema = z.object(baseIdSchema("id"));

const baseStringSchema = (fieldName) => ({
  [fieldName]: z
    .string({
      error: (issue) => {
        if (!issue.input) return `${fieldName} é um campo obrigatório.`;
        if (issue.code === "invalid_type")
          return `${fieldName} é um campo de tipo string`;
      },
    })
    .min(1, `${fieldName} não pode ser vazio`),
});

export const baseDateSchema = (fieldName) => ({
  [fieldName]: z.iso
    .date({
      error: (issue) => {
        if (!issue.input) return `${fieldName} é um campo obrigatório.`;
        if (issue.code === "invalid_type")
          return `${fieldName} é um campo de tipo string`;
        if (issue.code === "invalid_format")
          return `Campo ${fieldName} não representa uma data válida`;
      },
    })
    .refine(
      (date) => new Date(date + "T00:00:00.000Z") <= new Date(),
      `Campo ${fieldName} não representa uma data válida`
    ),
});

const baseEnumSchema = (fieldName, values) => ({
  [fieldName]: z
    .string({
      error: (issue) => {
        if (!issue.input) return `${fieldName} é um campo obrigatório.`;
        if (issue.code === "invalid_type")
          return `${fieldName} é um campo de tipo string`;
      },
    })
    .toLowerCase()
    .pipe(
      z.enum(values, {
        error: (issue) => {
          if (issue.code === "invalid_value")
            return `${fieldName} deve ser ${values.join(" ou ")}.`;
        },
      })
    ),
});

export const statusSchema = z.object(
  baseEnumSchema("status", ["aberto", "solucionado"])
);
export const sortSchema = z.object({
  sort: z
    .templateLiteral([z.enum(["-", ""]), "dataDeIncorporacao"])
    .transform((val) => (val[0] === "-" ? -1 : 1)),
});

export const agenteSchema = z.object(
  {
    ...baseStringSchema("nome"),
    ...baseDateSchema("dataDeIncorporacao"),
    ...baseStringSchema("cargo"),
  },
  {
    error: (issue) => {
      if (issue.code === "invalid_type")
        return "O corpo de requisição deve ser um OBJETO.";
    },
  }
);

export const casoSchema = z.object(
  {
    ...baseStringSchema("titulo"),
    ...baseStringSchema("descricao"),
    ...baseEnumSchema("status", ["aberto", "solucionado"]),
    agente_id: z
      .int({
        error: (issue) => {
          if (!issue.input) return `agente_id é um campo obrigatório.`;
          if (issue.code === "invalid_type")
            return `agente_id deve ser um número inteiro.`;
        },
      })
      .min(1, "agente_id deve ser um número inteiro positivo"),
  },
  {
    error: (issue) => {
      if (issue.code === "invalid_type")
        return "O corpo de requisição deve ser um OBJETO.";
    },
  }
);

export const agentePatchSchema = z.strictObject(agenteSchema.partial().shape, {
  error: (issue) => `Chave não reconhecida: '${issue.keys}'`,
});
export const casoPatchSchema = z.strictObject(casoSchema.partial().shape, {
  error: (issue) => `Chave não reconhecida: '${issue.keys}'`,
});

export const agentesQuerySchema = z.union([
  z
    .object({
      sort: z
        .templateLiteral([z.enum(["-", ""]), "dataDeIncorporacao"])
        .transform((val) => (val[0] === "-" ? -1 : 1)),
    })
    .strict(),
  z.object({ ...baseStringSchema("cargo") }).strict(),
]);

export const casosQuerySchema = z.union([
  z.object({ ...baseIdSchema("agente_id") }).strict(),
  z
    .object({
      ...baseEnumSchema("status", ["aberto", "solucionado"]),
    })
    .strict(),
]);

export const searchQuerySchema = z
  .object({ ...baseStringSchema("q") })
  .strict();

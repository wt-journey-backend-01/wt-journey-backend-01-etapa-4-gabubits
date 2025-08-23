/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("usuarios").del();

  await knex("usuarios").insert([
    {
      nome: "Fulano",
      email: "fulano@gmail.com",
      senha: "Ful@no123",
    },
    {
      nome: "Ciclano",
      email: "ciclano@gmail.com",
      senha: "Cicl@no123",
    },
  ]);
}

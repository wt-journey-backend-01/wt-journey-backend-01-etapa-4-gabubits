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
      senha: "$2b$10$C1o1d/MeMmcUJerJEp1Cr.0omC/M1W5gY7MuetkBPA6U4bxgVokBG",
    },
    {
      nome: "Ciclano",
      email: "ciclano@gmail.com",
      senha: "$2b$10$6rwx8ri11j9YXaStDz0gCOP.u3jsXkqH4CV7UyFs6ayOnLfmOPozO",
    },
  ]);
}

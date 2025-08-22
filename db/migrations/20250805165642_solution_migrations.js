/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("agentes", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.date("dataDeIncorporacao").notNullable();
    table.string("cargo").notNullable();
  });

  await knex.schema.createTable("casos", (table) => {
    table.increments("id").primary();
    table.string("titulo").notNullable();
    table.string("descricao").notNullable();
    table.enum("status", ["aberto", "solucionado"]).notNullable();
    table.integer("agente_id").unsigned();

    table
      .foreign("agente_id")
      .references("id")
      .inTable("agentes")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {}

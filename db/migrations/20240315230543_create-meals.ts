import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Remover temporariamente a restrição de chave estrangeira
  await knex.schema.table("meals", (table) => {
    table.dropForeign(["user_id"]);
  });

  // Criar a tabela de refeições com todas as colunas
  await knex.schema.createTable("meals", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable(); // Não precisa mais de referência aqui
    table.string("mealsName").notNullable();
    table.string("description").nullable();
    table.date("date").notNullable();
    table.timestamps(true, true);
    table.boolean("is_on_diet").notNullable();
  });

  // Adicionar novamente a restrição de chave estrangeira
  await knex.schema.alterTable("meals", (table) => {
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remover a tabela de refeições
  await knex.schema.dropTableIfExists("meals");
}
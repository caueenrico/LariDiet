import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("users.id").notNullable()
    table.string("mealsName").notNullable()
    table.string("description").nullable()
    table.date("date").notNullable()
    table.timestamps(true, true)
    table.boolean('is_on_diet').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}


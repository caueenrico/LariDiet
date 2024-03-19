import { Knex, knex as setupKnex } from "knex";
import 'dotenv/config'
import { env } from "./env";


export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,

  migrations: {
    extension: 'ts',
    directory: './db/migrations' //npm run knex -- migrate:make create-nomedatabela
  }
}

export const knex = setupKnex(config)
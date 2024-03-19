import { Knex, knex as setupKnex } from "knex";
import "dotenv/config";
import { env } from "./env";

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,

  useNullAsDefault: true,

  migrations: {
    extension: "ts",
    directory: "./db/migrations", //npm run knex -- migrate:make create-nomedatabela
  },
};

export const knex = setupKnex(config);

import { FastifyInstance } from "fastify";

import { map, string, z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/createMals",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      let sessionId = request.cookies.sessionId;

      const userLogged = await knex("users")
        .where({ session_id: sessionId })
        .first();

      console.log(userLogged);

      const { name, description, isOnDiet, date } = createMealsBodySchema.parse(
        request.body
      );

      await knex("meals").insert({
        user_id: userLogged.id,
        mealsName: name,
        description,
        is_on_diet: isOnDiet,
        date,
      });
    }
  );

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;
      const userLoged = await knex("users")
        .where({ session_id: sessionId })
        .first();

      const mealsByUser = await knex("meals")
        .where({ user_id: userLoged.id })
        .select("*");

      return reply.status(200).send({ mealsByUser });
    }
  );

  app.put(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: string(),
      });

      const editMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { name, description, isOnDiet, date } = editMealsBodySchema.parse(
        request.body
      );

      const { id } = getMealsParamsSchema.parse(request.params);
      console.log(id);

      //verificando se a refeição existe e pertence ao usuário logado
      const sessionId = request.cookies.sessionId;
      const userLogged = await knex("users")
        .where({ session_id: sessionId })
        .first();

      if (!userLogged) {
        return reply.status(401).send("Usuário não autorizado");
      }

      const meals = await knex("meals")
        .where({ id, user_id: userLogged.id })
        .first();

      if (!meals) {
        return reply
          .status(401)
          .send("Refeição não encontrada ou não pertence ao usuário");
      }

      //atualizar a refeição
      await knex("meals").where({ id }).update({
        mealsName: name,
        description,
        is_on_diet: isOnDiet,
        date,
      });

      return reply.status(200).send("Refeição atualizada com sucesso");
    }
  );

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: string(),
      });

      const { id } = getMealsParamsSchema.parse(request.params);
      console.log(id);

      // Verificar se a refeição existe e pertence ao usuário logado
      const sessionId = request.cookies.sessionId;
      const userLogged = await knex("users")
        .where({ session_id: sessionId })
        .first();

      if (!userLogged) {
        return reply.status(401).send("Usuário não autorizado");
      }

      const meal = await knex("meals")
        .where({ id, user_id: userLogged.id })
        .first();

      if (!meal) {
        return reply
          .status(404)
          .send("Refeição não encontrada ou não pertence ao usuário");
      }

      // Deletar a refeição
      await knex("meals").where({ id }).del();

      return reply.status(200).send("Refeição deletada com sucesso");
    }
  );

  app.get(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const idMealSchema = z.object({
        id: string(),
      });

      const { id } = idMealSchema.parse(request.params);

      // Verificar se a refeição existe e pertence ao usuário logado
      const sessionId = request.cookies.sessionId;
      const userLogged = await knex("users")
        .where({ session_id: sessionId })
        .first();

      if (!userLogged) {
        return reply.status(401).send("Usuário não autorizado");
      }

      const meal = await knex("meals")
        .where({ id, user_id: userLogged.id })
        .first();

      if (!meal) {
        return reply
          .status(404)
          .send("Refeição não encontrada ou não pertence ao usuário");
      }

      //mostrando a refeição
      const mealEspecific = await knex("meals").where({id}).first()

      return reply.status(200).send(mealEspecific)
    }
  );
}

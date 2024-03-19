import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
    });

    const { username, email, password } = createUserBodySchema.parse(
      request.body
    ); //validando dados

    const checkUserAredyExist = await knex("users").where({email}).first()

    if(checkUserAredyExist){
      return reply.status(500).send("este e-mail ja foi cadastrado, faça o login");
    }

    await knex("users").insert({
      id: randomUUID(),
      username,
      email,
      password,
    });

    return reply.status(201).send("usário cadastrado com sucesso !");
  });

  app.post("/", async (request, reply) => {
    const userSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = userSchema.parse(request.body);

    const userExists = await knex("users").where({ email }).select("*").first();

    let sessionId = request.cookies.sessionId;

    if (userExists && userExists.password === password) {
      if (!sessionId || sessionId === null) {
        sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, //7 dias
        });
      }

      // Formate a data para corresponder ao formato de created_at
      const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

      await knex("users")
        .where({ email })
        .update({ updated_at , session_id: sessionId });

      return reply.status(200).send(userExists);
    } else {
      return reply
        .status(404)
        .send({ message: "Usuário não encontrado ou senha incorreta" });
    }
  });

  //rota para logout 
  app.post('/logout', async(request, reply)=>{
    reply.clearCookie("sessionId", {path: '/'});
    return reply.status(200).send("usuário desconectado")
  })
}

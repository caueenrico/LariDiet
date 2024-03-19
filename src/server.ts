import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import cookie from "@fastify/cookie";
import { mealsRoutes } from "./routes/meals";
import { env } from "./env";

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users'
})
app.register(mealsRoutes, {
  prefix:'meals'
})

app.listen({
  host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
}).then(() => {
  console.log('o servidor está rodando na porta ' + env.PORT)
})
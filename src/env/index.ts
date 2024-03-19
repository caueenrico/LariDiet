import { z } from 'zod'

//formato de dados que vou receber nas variaveis ambientes
const envSchema = z.object({
  NODE_ENV: z.enum(['development','test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite','pg']), //para deploy pg: Postgress
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
})

//armazenando o retorno da variavel
const _env = envSchema.safeParse(process.env)

//tratamento da variavel
if(_env.success === false) {
  console.error("variavel de ambiente invalida", _env.error.format())

  throw new Error('Invalid enviroment variables')
}

export const env = _env.data
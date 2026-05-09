import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(' Variáveis de ambiente inválidas:', _env.error.message);
  process.exit(1);
}

export const env = _env.data;
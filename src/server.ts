import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
  console.log(`Swagger em http://localhost:${env.PORT}/api/docs`);
  console.log(`Health check em http://localhost:${env.PORT}/health`);
});
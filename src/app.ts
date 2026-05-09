import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { cnaeRoutes } from './modules/cnae/cnaeRoutes.js';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

app.get('/api/docs/json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/cnaes", cnaeRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
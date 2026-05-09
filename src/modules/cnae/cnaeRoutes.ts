import { Router } from "express";
import { CnaeController } from "./cnaeController.js";
import { validateBody, validateQuery, validateParams } from "../../shared/middlewares/validate.js";
import {
  createCnaeSchema,
  updateCnaeSchema,
  paginationSchema,
  idParamsSchema
} from "./cnaeSchema.js";

const router = Router();
const controller = new CnaeController();

router.post("/", validateBody(createCnaeSchema), controller.create);
router.get("/", validateQuery(paginationSchema), controller.findAll);
router.get("/:id", validateParams(idParamsSchema),controller.findById);
router.put("/:id", validateBody(updateCnaeSchema), controller.update);
router.delete("/:id", controller.softDelete);

export { router as cnaeRoutes };
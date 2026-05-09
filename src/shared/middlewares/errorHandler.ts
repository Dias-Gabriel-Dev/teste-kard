import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";
import { ZodError } from "zod";
import { env } from "../../config/env.js";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Error de validação",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (env.NODE_ENV === "development") {
    console.error("Erro interno", error);
  }

  res.status(500).json({
    status: "error",
    message: "Error interno do servidor",
  });
}
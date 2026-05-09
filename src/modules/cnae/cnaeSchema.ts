import { z } from "zod";

export const createCnaeSchema = z.object({
  cnae_complete: z
    .string({ message: "cnae completo é obrigatório" })
    .min(1, "cnae completo não pode ser vazio"),
  cnae_class: z
    .string({ message: "classe cnae é obrigatória" })
    .min(1, "classe cnae não pode ser vazia"),
  sector: z
    .string({ message: "setor é obrigatório" })
    .min(1, "setor não pode ser vazio"),
  turnover: z
    .number({ message: "faturamento é obrigatório" })
    .positive("faturamento deve ser um valor positivo"),
  risk_range: z
    .string({ message: "faixa de risco é obrigatório" })
    .min(1, "faixa de risco não pode ser vazio"),
  cnae_score: z
    .number({ message: "cnae score é obrigatório" })
    .int("cnae score deve ser um número inteiro")
});

export const updateCnaeSchema = createCnaeSchema.partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const idParamsSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido")
});

export type CreateCnaeInput = z.infer<typeof createCnaeSchema>;
export type UpdateCnaeInput = z.infer<typeof updateCnaeSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
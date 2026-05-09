import { prisma } from "../../lib/prisma.js";
import { CreateCnaeInput, UpdateCnaeInput } from "./cnaeSchema.js";

export class CnaeRepository {
  async create(data: CreateCnaeInput) {
    return prisma.cnae.create({ data });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.cnae.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      prisma.cnae.count({
        where: { deleted_at: null },
      }),
    ]);

    return{
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
    };
  }

  async findById(id: string) {
    return prisma.cnae.findFirst({
      where: { id, deleted_at: null },
    });
  }

  async update(id: string, data: UpdateCnaeInput) {
    return prisma.cnae.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return prisma.cnae.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
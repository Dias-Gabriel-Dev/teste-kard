import { CnaeRepository } from "./cnaeRepository.js";
import { CreateCnaeInput, UpdateCnaeInput } from "./cnaeSchema.js";
import { AppError } from "../../shared/errors/appError.js";

export class CnaeService {
  private repository: CnaeRepository;

  constructor() {
    this.repository = new CnaeRepository();
  }

  async create(data: CreateCnaeInput) {
    return this.repository.create(data);
  }

  async findAll(page: number, limit: number) {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string) {
    const cnae = await this.repository.findById(id);

    if (!cnae) {
      throw new AppError("CNAE não encontrado", 404);
    }

    return cnae;
  }

  async update(id: string, data: UpdateCnaeInput) {
    await this.findById(id);

    return this.repository.update(id, data);
  }

  async softDelete(id: string) {
    await this.findById(id);

    return this.repository.softDelete(id);
  }
}
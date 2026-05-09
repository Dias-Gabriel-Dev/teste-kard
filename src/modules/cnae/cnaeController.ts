import { Request, Response } from "express";
import { CnaeService } from "./cnaeService.js";
import { PaginationQuery } from "./cnaeSchema.js";


export class CnaeController {
  private service: CnaeService;

  constructor() {
    this.service = new CnaeService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const cnae = await this.service.create(req.body);
    res.status(201).json(cnae);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = req.query as unknown as PaginationQuery;
    const result = await this.service.findAll(page, limit);
    res.json(result);
  };

  findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const cnae = await this.service.findById(req.params.id);
    res.json(cnae)
  };

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const cnae = await this.service.update(req.params.id, req.body);
    res.json(cnae)
  };

  softDelete = async (req: Request<{ id: string}>, res: Response): Promise<void> => {
    await this.service.softDelete(req.params.id);
    res.status(204).send();
  };
}
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";

const validCnae = {
  cnae_complete: "62.01-5-01",
  cnae_class: "6201-5",
  sector: "Tecnologia da Informação",
  turnover: 1500000.50,
  risk_range: "baixo",
  cnae_score: 85,
};

describe("CNAE Endpoints", () => {

  // TESTES POST
  describe("POST /api/cnaes", () => {
    it("cria um registro com dados válidos",
    async () => {
      const response = await request(app)
        .post("/api/cnaes")
        .send(validCnae);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.cnae_complete).toBe(validCnae.cnae_complete);
      expect(response.body.deleted_at).toBeNull();
    });

    it("retorna 400 quando o corpo da requisição está vázio", async () => {
      const response = await request(app).post("/api/cnaes").send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("retorna 400 quando campos de sring estão vazios", async () => {
      const response = await request(app).post("/api/cnaes")
      .send({ ...validCnae, cnae_complete: ""});

      expect(response.status).toBe(400);
    });

    it("retorna 400 quando o faturamento é negativo", async () => {
      const response = await request(app).post("/api/cnaes")
      .send({ ...validCnae, turnover: -100});

      expect(response.status).toBe(400);
    });

    it("retorna 400 quando cnae score não é inteiro", async () => {
      const response = await request(app).post("/api/cnaes")
      .send({...validCnae, cnae_score: 85.5});

      expect(response.status).toBe(400);
    });

    it("retorna 400 quando o tipo do campo é incorreto", async () => {
      const response = await request(app).post("/api/cnaes")
      .send({ ...validCnae, turnover: "not-a-number" });

      expect(response.status).toBe(400);
    });
  });

  // TESTES GET
   describe('GET /api/cnaes', () => {
    it('retorna lista vazia quando não há registros', async () => {
      const response = await request(app).get('/api/cnaes');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta.total).toBe(0);
    });

    it('retorna registros com metadados de paginação', async () => {
      await request(app).post('/api/cnaes').send(validCnae);
      await request(app).post('/api/cnaes').send({
        ...validCnae,
        cnae_complete: '47.11-3-02',
      });

      const response = await request(app)
        .get('/api/cnaes')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('deve respeitar paginação', async () => {
      // Cria 3 registros
      for (let i = 0; i < 3; i++) {
        await request(app).post('/api/cnaes').send({
          ...validCnae,
          cnae_complete: `code-${i}`,
        });
      }

      const response = await request(app)
        .get('/api/cnaes')
        .query({ page: 1, limit: 2 });

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.totalPages).toBe(2);
    });

    it('retorna registros deletados', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);
      await request(app).delete(`/api/cnaes/${created.body.id}`);

      const response = await request(app).get('/api/cnaes');
      expect(response.body.data).toHaveLength(0);
    });
  });

  // TESTES GET/:id
  
  describe('GET /api/cnaes/:id', () => {
    it('retorna registro por ID', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);

      const response = await request(app)
        .get(`/api/cnaes/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(created.body.id);
    });

    it('retorna 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/api/cnaes/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
    });

    it('retorna 404 para registro deletado', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);
      await request(app).delete(`/api/cnaes/${created.body.id}`);

      const response = await request(app)
        .get(`/api/cnaes/${created.body.id}`);

      expect(response.status).toBe(404);
    });
  });

  // TESTE PUT/:id
  describe('PUT /api/cnaes/:id', () => {
    it('atualiza um registro existente', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);

      const response = await request(app)
        .put(`/api/cnaes/${created.body.id}`)
        .send({ turnover: 2000000, cnae_score: 90 });

      expect(response.status).toBe(200);
      expect(response.body.turnover).toBe(2000000);
      expect(response.body.cnae_score).toBe(90);
    });

    it('retorna 404 ao atualizar ID inexistente', async () => {
      const response = await request(app)
        .put('/api/cnaes/00000000-0000-0000-0000-000000000000')
        .send({ turnover: 999 });

      expect(response.status).toBe(404);
    });

    it('retorna 400 com dados de validação inválidos', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);

      const response = await request(app)
        .put(`/api/cnaes/${created.body.id}`)
        .send({ turnover: -500 });

      expect(response.status).toBe(400);
    });
  });

  // TESTES DELETE/:id
  describe('DELETE /api/cnaes/:id', () => {
    it('realiza soft delete e retornar 204', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);

      const response = await request(app)
        .delete(`/api/cnaes/${created.body.id}`);

      expect(response.status).toBe(204);

      // Verificar que deleted_at foi preenchido no banco
      const record = await prisma.cnae.findUnique({
        where: { id: created.body.id },
      });
      expect(record?.deleted_at).not.toBeNull();
    });

    it('retorna 404 ao deletar ID inexistente', async () => {
      const response = await request(app)
        .delete('/api/cnaes/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
    });

    it('retorna 404 ao deletar registro já deletado', async () => {
      const created = await request(app)
        .post('/api/cnaes')
        .send(validCnae);

      await request(app).delete(`/api/cnaes/${created.body.id}`);
      const response = await request(app)
        .delete(`/api/cnaes/${created.body.id}`);

      expect(response.status).toBe(404);
    });
  });
});

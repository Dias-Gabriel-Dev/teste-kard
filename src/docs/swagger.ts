export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "CRUD CNAE - Teste Kard",
    description: "API REST para gerenciamento de CNAEs",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
  ],
  tags: [
    { name: "CNAE", description: "Operações CRUD para registros CNAE" },
  ],
  paths: {
    '/api/cnaes': {
      post: {
        tags: ['CNAE'],
        summary: 'Criar um novo registro CNAE',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCnaeInput' },
              example: {
                cnae_complete: '62.01-5-01',
                cnae_class: '6201-5',
                sector: 'Tecnologia da Informação',
                turnover: 1500000.50,
                risk_range: 'Baixo',
                cnae_score: 85,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registro criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cnae' },
              },
            },
          },
          '400': {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
        },
      },
      get: {
        tags: ['CNAE'],
        summary: 'Listar registros',
        description: 'Registros soft-deleted não são incluídos.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista paginada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' },
              },
            },
          },
        },
      },
    },
    '/api/cnaes/{id}': {
      get: {
        tags: ['CNAE'],
        summary: 'Buscar registro por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Registro encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cnae' },
              },
            },
          },
          '404': {
            description: 'Não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AppError' },
              },
            },
          },
        },
      },
      put: {
        tags: ['CNAE'],
        summary: 'Atualizar registro',
        description: 'Aceita atualização parcial.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCnaeInput' },
              example: { turnover: 2000000, cnae_score: 90 },
            },
          },
        },
        responses: {
          '200': {
            description: 'Registro atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cnae' },
              },
            },
          },
          '400': { description: 'Erro de validação' },
          '404': { description: 'Não encontrado' },
        },
      },
      delete: {
        tags: ['CNAE'],
        summary: 'Excluir registro',
        description: 'Preenche deleted_at. Registro permanece no banco.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Excluído com sucesso' },
          '404': { description: 'Não encontrado' },
        },
      },
    },
  },
  components: {
    schemas: {
      Cnae: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          deleted_at: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          cnae_complete: { type: 'string' },
          cnae_class: { type: 'string' },
          sector: { type: 'string' },
          turnover: { type: 'number', format: 'float' },
          risk_range: { type: 'string' },
          cnae_score: { type: 'integer' },
        },
      },
      CreateCnaeInput: {
        type: 'object',
        required: [
          'cnae_complete', 'cnae_class', 'sector',
          'turnover', 'risk_range', 'cnae_score',
        ],
        properties: {
          cnae_complete: { type: 'string', minLength: 1 },
          cnae_class: { type: 'string', minLength: 1 },
          sector: { type: 'string', minLength: 1 },
          turnover: { type: 'number', minimum: 0, exclusiveMinimum: true },
          risk_range: { type: 'string', minLength: 1 },
          cnae_score: { type: 'integer' },
        },
      },
      UpdateCnaeInput: {
        type: 'object',
        description: 'Todos os campos opcionais para update parcial',
        properties: {
          cnae_complete: { type: 'string', minLength: 1 },
          cnae_class: { type: 'string', minLength: 1 },
          sector: { type: 'string', minLength: 1 },
          turnover: { type: 'number', minimum: 0, exclusiveMinimum: true },
          risk_range: { type: 'string', minLength: 1 },
          cnae_score: { type: 'integer' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Cnae' },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Erro de validação' },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
      AppError: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string' },
        },
      },
    },
  },
};
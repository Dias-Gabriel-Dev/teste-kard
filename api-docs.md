# Exemplos de testes manuais

Base URL: `http://localhost:3000`

---

## POST /api/cnaes — Criar Registro

**Request:**

    POST /api/cnaes
    Content-Type: application/json

    {
      "cnae_complete": "62.01-5-01",
      "cnae_class": "6201-5",
      "sector": "Tecnologia da Informação",
      "turnover": 1500000.50,
      "risk_range": "Baixo",
      "cnae_score": 85
    }

**Response (201):**

    {
      "id": "uuid-gerado",
      "created_at": "2026-05-07T13:45:00.000Z",
      "updated_at": "2026-05-07T13:45:00.000Z",
      "deleted_at": null,
      "cnae_complete": "62.01-5-01",
      "cnae_class": "6201-5",
      "sector": "Tecnologia da Informação",
      "turnover": 1500000.5,
      "risk_range": "Baixo",
      "cnae_score": 85
    }

---

## GET /api/cnaes — Listar com Paginação

**Request:**

    GET /api/cnaes?page=1&limit=10

**Response (200):**

    {
      "data": [ ...registros... ],
      "meta": {
        "total": 5,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    }

---

## GET /api/cnaes/:id — Buscar por ID

**Request:**

    GET /api/cnaes/uuid-do-registro

**Response (200):** Registro CNAE completo
**Response (404):** `{ "status": "error", "message": "Registro CNAE não encontrado" }`

---

## PUT /api/cnaes/:id — Atualizar

**Request (atualização parcial):**

    PUT /api/cnaes/uuid-do-registro
    Content-Type: application/json

    { "turnover": 2000000, "cnae_score": 90 }

**Response (200):** Registro atualizado

---

## DELETE /api/cnaes/:id — Soft Delete

**Request:**

    DELETE /api/cnaes/uuid-do-registro

**Response:** 204 No Content

## Verificação da Sprint

npm test

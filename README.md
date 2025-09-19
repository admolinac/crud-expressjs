# Event API Documentation

## Base URL

```
[http://localhost:3030](http://localhost:3030)
```

---

## Health Check

**Endpoint:**
`GET /health`

**Descripción:**
Verifica que el servicio esté funcionando correctamente.

**Response:**

```json
{
  "status": "OK",
  "message": "Service is healthy!",
  "time": 123.456
}
```

---

## Endpoints de Events

### Obtener todos los eventos

**Endpoint:**
`GET /api/events`

**Query Parameters (opcional):**

- `page` (number) - Número de página para paginación.
- `limit` (number) - Cantidad de registros por página.

**Ejemplos:**

```
GET /api/events
GET /api/events?page=2&limit=5
```

**Response (sin paginación):**

```json
{
  "code": "OK",
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": "a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1",
      "name": "Salary",
      "description": "Monthly salary payment",
      "amount": 1500,
      "date": "2025-03-01T00:00:00.000Z",
      "type": "income",
      "attachment": "salary-slip.pdf"
    }
  ]
}
```

**Response (con paginación):**

```json
{
  "code": "OK",
  "message": "Events retrieved successfully in pagination",
  "data": [ ...paginated events... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

### Obtener un evento por ID

**Endpoint:**
`GET /api/events/:id`

**Path Parameters:**

- `id` (UUID) - ID del evento.

**Ejemplo:**

```
GET /api/events/a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1
```

**Response:**

```json
{
  "code": "OK",
  "message": "Event found",
  "data": {
    "id": "a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1",
    "name": "Salary",
    "description": "Monthly salary payment",
    "amount": 1500,
    "date": "2025-03-01T00:00:00.000Z",
    "type": "income",
    "attachment": "salary-slip.pdf"
  }
}
```

---

### Crear un evento

**Endpoint:**
`POST /api/events`

**Body Parameters:**

| Campo       | Tipo   | Obligatorio | Descripción                                  |
| ----------- | ------ | ----------- | -------------------------------------------- |
| name        | string | Sí          | Nombre del evento (1-20 caracteres)          |
| description | string | No          | Descripción del evento (máx. 100 caracteres) |
| amount      | number | Sí          | Monto positivo                               |
| date        | string | Sí          | Fecha en formato ISO (`YYYY-MM-DD`)          |
| type        | string | Sí          | "income" o "expense"                         |
| attachment  | string | No          | Archivo adjunto                              |

**Ejemplo:**

```json
{
  "name": "Freelance",
  "description": "Payment for project",
  "amount": 600,
  "date": "2025-04-01",
  "type": "income",
  "attachment": "invoice.pdf"
}
```

**Response:**

```json
{
  "code": "OK",
  "message": "Event created successfully!",
  "data": {
    "id": "generated-uuid",
    "name": "Freelance",
    "description": "Payment for project",
    "amount": 600,
    "date": "2025-04-01T00:00:00.000Z",
    "type": "income",
    "attachment": "invoice.pdf"
  }
}
```

---

### Actualizar un evento

**Endpoint:**
`PUT /api/events/:id`

**Path Parameters:**

- `id` (UUID) - ID del evento a actualizar.

**Body Parameters:**
Se pueden enviar solo los campos a actualizar (mismos que en `POST`).

**Ejemplo:**

```json
{
  "amount": 650,
  "description": "Updated payment description"
}
```

**Response:**

```json
{
  "code": "OK",
  "message": "Event updated!",
  "data": {
    "id": "a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1",
    "name": "Freelance",
    "description": "Updated payment description",
    "amount": 650,
    "date": "2025-04-01T00:00:00.000Z",
    "type": "income",
    "attachment": "invoice.pdf"
  }
}
```

---

### Eliminar un evento

**Endpoint:**
`DELETE /api/events/:id`

**Path Parameters:**

- `id` (UUID) - ID del evento a eliminar.

**Response:**

```json
{
  "code": "OK",
  "message": "Event deleted!",
  "data": {
    "id": "a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1",
    "name": "Salary",
    "description": "Monthly salary payment",
    "amount": 1500,
    "date": "2025-03-01T00:00:00.000Z",
    "type": "income",
    "attachment": "salary-slip.pdf"
  }
}
```

---

### Manejo de errores

**400 – Validación fallida**

```json
{
  "code": "VAL_ERR",
  "message": "Validation failed",
  "errors": [
    { "msg": "Name is mandatory.", "param": "name", "location": "body" }
  ]
}
```

**404 – No encontrado**

```json
{
  "code": "NF",
  "message": "Event not found"
}
```

**500 – Error interno**

```json
{
  "code": "ERR",
  "message": "Internal server error"
}
```

---

### Notas

- Todos los IDs de eventos son UUID.
- La paginación se realiza con query params `page` y `limit`.
- Los campos `description` y `attachment` son opcionales.
- Las fechas deben estar en formato ISO (`YYYY-MM-DD`).
- El tipo solo puede ser `"income"` o `"expense"`.

# Việt Phục Studio — System Architecture

Việt Phục Studio is built as a production-grade full-stack web application with a modern layered architecture.

## Architectural Flow

```
[Browser]
   │
   ▼ (HTTP / JSON / REST API)
[Next.js App Router (Port 3000)]
   │
   ▼ (REST API / JWT Authorization)
[Spring Boot REST Controllers (Port 8080)]
   │
   ▼
[Service Layer] ──► [Cultural Validation Engine]
   │
   ▼
[Repository Layer (Spring Data JPA / Hibernate)]
   │
   ▼
[Database (PostgreSQL / H2 Fallback)]
```

## Core Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Vietnamese cultural color palette
- **Icons**: Lucide React Icons
- **HTTP Services**: Centralized fetch wrapper (`lib/api-client.ts`)

### Backend
- **Framework**: Spring Boot 3.2.5 (Java 21 / 25)
- **Security**: Spring Security with JWT Bearer Token Authentication
- **ORM & Validation**: Spring Data JPA, Hibernate, Jakarta Validation
- **Database Migration**: Flyway (`db/migration/V1__initial_schema.sql`)
- **Database**: PostgreSQL (Production) with H2 in-memory (Local dev fallback)
- **Testing**: JUnit 5, Mockito, Spring Boot Starter Test

## API Contracts & Standardized Responses

Every endpoint returns a unified `ApiResponse<T>` structure:

### Success Response (200 OK / 201 Created):
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (400 / 401 / 404 / 500):
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Chi tiết thông báo lỗi"
  }
}
```


# Employee Management System — Full Stack (Next.js 13 + Auth0 + Spring Boot + PostgreSQL)

> Production-ready, secure full-stack application with authentication, server-side-proxied API access, and deployments on Render.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Security Model](#security-model)
4. [Features](#features)
5. [Folder Structure](#folder-structure)
6. [Local Development](#local-development)
7. [Deployment (Render)](#deployment-render)
8. [Environment Variables (Important)](#environment-variables-important)
9. [Auth0 Configuration](#auth0-configuration)
10. [API Contracts / Example Requests](#api-contracts--example-requests)
11. [Operational Tips & Troubleshooting](#operational-tips--troubleshooting)
12. [Future Enhancements](#future-enhancements)
13. [Author & License](#author--license)

--

Snapshots 
<img width="1732" height="962" alt="image" src="https://github.com/user-attachments/assets/e7d51da6-951e-4b7e-a4f0-a68ba98d2030" />
<img width="1750" height="947" alt="image" src="https://github.com/user-attachments/assets/c3d44dd3-ae10-4857-b702-88e627812859" />
<img width="1675" height="910" alt="image" src="https://github.com/user-attachments/assets/2850eecc-53ad-4bcd-bd0d-1082713ed023" />


---

## Project Overview

This application is an **Employee Management System** demonstrating a secure, modern full-stack architecture:

- **Frontend:** Next.js 13 (TypeScript, App Router), Tailwind CSS, deployed to Render.
- **Auth:** Auth0 (OIDC / OAuth2) for sign-in with social providers (Google) and session management.
- **Backend:** Spring Boot (Java 21) REST API secured as an OAuth2 Resource Server (JWT validation) and an additional API key check for service-to-service calls.
- **Database:** PostgreSQL (hosted on Render or any managed provider).
- **Deployment:** Both frontend and backend are deployed to Render with environment variables.

Design goals:
- Keep secrets off the browser; tokens and API keys only handled server-side.
- Centralize auth logic in Next.js API routes to avoid exposing tokens to client code.
- Ensure robust security and portability between local and cloud environments.

---

## Architecture

```
+-----------------+       HTTPS        +---------------------------+      HTTPS       +----------------+
|   Browser UI    |  <-------------->  |  Next.js Frontend (SSR)   |  <----------->  | Spring Boot API |
| (Next.js client) |                    | (App Router + API routes) |                 | (resource-server)|
+-----------------+                    +---------------------------+                 +----------------+
       |                                             |
       |                                             v
       |                                       Auth0 (OIDC/OAuth2)
       |                                      (login, tokens, session)
       |
       v
  User actions
```

Key notes:
- The browser authenticates with **Auth0** (hosted). After login, Auth0 redirects to the frontend callback route.
- Next.js stores a secure **server-side** session cookie (`appSession`) — **HTTP-only**, encrypted — never accessible from frontend JavaScript.
- When Next.js API routes call the backend, they use `getAccessToken()` to extract the access token from the encrypted session, then attach:
  - `Authorization: Bearer <access_token>` (Auth0 token)
  - `X-API-Key: <service_api_key>` (from server env)
- The Spring Boot app validates the JWT against Auth0 (`issuer-uri`) and checks the API key from a header.

Advantages:
- Tokens never appear in browser JS → safer from XSS.
- Backend only accepts HTTPS requests with a valid token and API key → safer service-to-service comms.

---

## Security Model

1. **Auth0 (Identity Provider)**:
   - Issues OpenID Connect ID tokens and Access tokens.
   - Configured with an API Identifier (audience) used for access tokens.

2. **Session Management**:
   - `@auth0/nextjs-auth0` stores session in an encrypted cookie `appSession`.
   - Cookies are `HttpOnly`, `Secure`, and encrypted using your `AUTH0_SECRET`.

3. **API Access**:
   - Frontend **server** attaches both Bearer token and `X-API-Key`.
   - Spring Boot validates JWT via `issuer-uri` (Auth0) and optionally checks `aud` claim.
   - Spring Security config should permit public endpoints like `/actuator/health` and protect API endpoints.

4. **Secrets**:
   - Keep all secrets (Auth0 client secret, API key, DB credentials) in the environment or secret manager.
   - Do **not** commit `.env` files or hard-coded secrets to source control.

---

## Features

- User authentication via Auth0 (supports social logins).
- Secure server-side session handling in Next.js.
- CRUD operations for employees (GET, POST, PUT, DELETE).
- Layered backend: controllers, services, repositories, DTOs.
- PostgreSQL persistence and JPA mapping.
- CORS configured for both localhost and deployed frontend.
- Docker / docker-compose templates for local multi-service runs (optional).
- Health checks and Render-compatible configuration.

---

## Folder Structure (high-level)

### Frontend (Next.js)
```
frontend/
├─ app/
│  ├─ api/
│  │  └─ employees/
│  │     ├─ route.ts        # GET, POST
│  │     └─ [id]/route.ts   # PUT, DELETE
│  └─ (UI pages & components)
├─ components/
├─ services/
├─ styles/
├─ public/
├─ package.json
└─ next.config.js
```

### Backend (Spring Boot)
```
backend/
├─ src/main/java/com/example/
│  ├─ controller/
│  ├─ service/
│  ├─ repository/
│  ├─ model/
│  └─ config/               # SecurityConfig, CORS config
├─ src/main/resources/application.yml
├─ pom.xml
└─ Dockerfile
```

---

## Local Development

### Prerequisites
- Node.js >= 20
- Java 21
- Maven
- PostgreSQL

### Backend (Spring Boot)
1. Configure `application.yml` or `application.properties`:
```yaml
server:
  port: 8083

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/employeedb
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://ppc-in-dev.us.auth0.com/
```

2. Run:
```bash
./mvnw clean package -DskipTests
java -jar target/*.jar
```

### Frontend (Next.js)
1. Create `.env.local`:
```
AUTH0_SECRET='your-random-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://ppc-in-dev.us.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
AUTH0_AUDIENCE='https://api.employee-management.com'

NEXT_PUBLIC_API_BASE_URL='http://localhost:8083/api'
NEXT_PUBLIC_API_KEY='ppc-web-123456789'
```

2. Install and Run:
```bash
npm install
npm run dev
```

---

## Deployment (Render)

### Frontend (Next.js) on Render
- Create a new **Web Service** linking to your frontend repo.
- Environment:
  - `NODE_VERSION` 20+
  - Add env variables (same as `.env.local`) but with production URLs:
    - `AUTH0_BASE_URL='https://employee-frontend-hatj.onrender.com'`
    - `NEXT_PUBLIC_API_BASE_URL='https://employee-api-ytss.onrender.com/api'`
    - `NEXT_PUBLIC_API_KEY='ppc-web-123456789'`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

### Backend (Spring Boot) on Render
- Create a **Web Service** linking to your backend repo.
- Environment Variables:
  - `AUTH0_ISSUER='https://ppc-in-dev.us.auth0.com/'`
  - `AUTH0_AUDIENCE='https://api.employee-management.com'`
  - DB connection (e.g., `JDBC_DATABASE_URL`, `DB_USER`, `DB_PASS`)
  - `API_KEY=ppc-web-123456789`
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/employee-api-*.jar`
- Health Check Path: `/actuator/health` (or `/healthz` if you added it).

---

## Environment Variables (Important)

Make sure to set the following **on Render** and locally (via `.env.local` or secret manager):

### Frontend
```
AUTH0_SECRET
AUTH0_BASE_URL
AUTH0_ISSUER_BASE_URL
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_AUDIENCE
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_API_KEY
```

### Backend
```
SERVER_PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASS
AUTH0_ISSUER
AUTH0_AUDIENCE
API_KEY
```

---

## Auth0 Configuration

1. **Create an Auth0 Application** (type: Single Page Application)
   - Save `CLIENT_ID` and `CLIENT_SECRET`.

2. **Create an Auth0 API**
   - Set Identifier to: `https://api.employee-management.com`
   - Configure scopes if needed.

3. **Allowed Callback URLs**
```
http://localhost:3000/api/auth/callback
https://employee-frontend-hatj.onrender.com/api/auth/callback
```

4. **Allowed Logout URLs**
```
http://localhost:3000
https://employee-frontend-hatj.onrender.com
```

5. **Allowed Web Origins**
```
http://localhost:3000
https://employee-frontend-hatj.onrender.com
```

---

## API Contracts / Example Requests

**GET all employees** (proxied via Next.js)
```
GET /api/employees
Cookie: appSession=<encrypted session>
```

**POST create employee**
```
POST /api/employees
Content-Type: application/json
Body: { "name":"Jane Doe", "position":"Engineer", "salary":50000, ... }
```

**Direct backend request (for testing)**
```
curl -H "Authorization: Bearer <access_token>" -H "X-API-Key: ppc-web-123456789" https://employee-api-ytss.onrender.com/api/employees
```

---

## Operational Tips & Troubleshooting

- **405 Method Not Allowed** — When using App Router, ensure you have matching HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`) in `app/api/.../route.ts` or `[id]/route.ts`.
- **Unexpected token '<'** — You tried to parse HTML as JSON. Inspect `response.status` and `response.headers['content-type']` and dump response text for debugging.
- **401 Unauthorized** — Check that:
  - `AUTH0_AUDIENCE` is set and matches API Identifier.
  - Auth0 token returned to Next.js has the correct `aud` claim.
  - `getAccessToken()` returns a token (session exists).
- **Render health checks** — Configure health check path to `/actuator/health` or expose `/healthz` and permit it in Spring Security.
- **CORS** — Ensure Spring Boot allows frontend origin (deployed URL + localhost).

---

## Future Enhancements

- Role-based access control (Auth0 roles mapped to Spring authorities).
- Refresh token rotation for long-lived sessions.
- Add request logging/observability (OpenTelemetry).
- Rate-limiting and WAF rules.
- CI/CD pipeline for automated build & deploy (GitHub Actions).

---

## Author & License

**Author:** Pratik Chavan  
**Contact:** pratik2612001@gmail.com

Licensed under the **MIT License**.

---

## Mermaid Diagram (for documentation rendering)

```
graph LR
  Browser -->|login| Auth0
  Browser -->|requests (appSession cookie)| NextJS
  NextJS -->|Bearer + X-API-Key| SpringBoot
  SpringBoot -->|JPA| Postgres
  Auth0 -->|JWKs| SpringBoot
```


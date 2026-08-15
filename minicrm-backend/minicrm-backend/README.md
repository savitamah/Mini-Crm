# Mini CRM — Backend

A Spring Boot REST API backend for a lightweight CRM: manage contacts, leads, deals, follow-ups, tasks, and activities, with JWT-based auth and role-based access control.

## Tech Stack

- **Java 17**
- **Spring Boot 3.3.2** (Web, Data JPA, Security, Validation)
- **MySQL** (via `mysql-connector-j`)
- **JWT** auth (`jjwt` 0.12.6)
- **Lombok**
- **Maven**

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL running locally (or reachable via env vars) — the app auto-creates the database on startup

## Configuration

Configuration lives in `src/main/resources/application.yml` and is overridable via environment variables:

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `minicrm` | Database name (created automatically if missing) |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `JWT_SECRET` | dev default (change in prod) | Secret used to sign JWTs |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | JWT expiry in milliseconds |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed origins |

The server runs on port `8080` by default.

## Running Locally

```bash
# 1. Make sure MySQL is running and reachable
export DB_USER=root
export DB_PASSWORD=yourpassword

# 2. Run with Maven
mvn spring-boot:run
```

Or build a jar and run it:

```bash
mvn clean package -DskipTests
java -jar target/minicrm-backend-1.0.0.jar
```

## Running with Docker

```bash
docker build -t minicrm-backend .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=yourpassword \
  minicrm-backend
```

## Database Seeding

On first run (when the `users` table is empty), `DataSeeder` populates demo data automatically: 3 users, 2 contacts, 2 leads, and 1 deal.

**Demo login:**
```
Email: admin@minicrm.com
Password: admin123
```

Other seeded users: `jane@minicrm.com` (MANAGER) and `mike@minicrm.com` (SALES_REP), same password.

## Authentication & Authorization

The API uses stateless JWT auth. After logging in, include the token on subsequent requests:

```
Authorization: Bearer <token>
```

Access rules (`SecurityConfig`):
- `/api/auth/**` — public
- `/api/users/**` — `ADMIN` only
- `DELETE /api/**` — `ADMIN` or `MANAGER`
- everything else — any authenticated user

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in and receive a JWT |

### Contacts (`/api/contacts`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List contacts (paginated) |
| GET | `/{id}` | Get a contact |
| POST | `/` | Create a contact |
| PUT | `/{id}` | Update a contact |
| DELETE | `/{id}` | Delete a contact |

### Leads (`/api/leads`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List leads |
| GET | `/{id}` | Get a lead |
| POST | `/` | Create a lead |
| PUT | `/{id}` | Update a lead |
| PATCH | `/{id}/status` | Update lead status |
| DELETE | `/{id}` | Delete a lead |

### Deals (`/api/deals`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List deals |
| POST | `/` | Create a deal |
| PUT | `/{id}` | Update a deal |
| DELETE | `/{id}` | Delete a deal |

### Follow-ups (`/api/follow-ups`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List follow-ups |
| GET | `/today` | Follow-ups due today |
| GET | `/range` | Follow-ups within a date range |
| POST | `/` | Create a follow-up |
| PUT | `/{id}` | Update a follow-up |
| DELETE | `/{id}` | Delete a follow-up |

### Tasks (`/api/tasks`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List tasks |
| POST | `/` | Create a task |
| PUT | `/{id}` | Update a task |
| DELETE | `/{id}` | Delete a task |

### Activities (`/api/activities`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List activities |
| GET | `/lead/{leadId}` | Activities for a specific lead |

### Dashboard (`/api/dashboard`)
| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Aggregate CRM stats |

### Users (`/api/users`) — ADMIN only
| Method | Path | Description |
|---|---|---|
| GET | `/` | List users |
| POST | `/` | Create a user |
| PUT | `/{id}` | Update a user |
| DELETE | `/{id}` | Delete a user |

### Integrations (`/api/integrations`)
Backs the Settings → Integrations panel (Gmail, Google Calendar, WhatsApp, Mailchimp, Zapier, Slack). Credentials are stored server-side and only ever returned masked (e.g. `AIz••••X9k`).

| Method | Path | Description | Access |
|---|---|---|---|
| GET | `/` | List all integrations with connection status | any authenticated user |
| POST | `/{provider}/connect` | Connect an integration — body: `{ "credential": "..." }` | any authenticated user |
| DELETE | `/{provider}` | Disconnect an integration | `ADMIN` or `MANAGER` (falls under the `DELETE /api/**` rule) |

`provider` is one of: `gmail`, `google_calendar`, `whatsapp`, `mailchimp`, `zapier`, `slack`.

## Project Structure

```
src/main/java/com/minicrm/
├── config/         # Security config, CORS, data seeder
├── controller/      # REST controllers
├── dto/             # Request/response DTOs
├── entity/          # JPA entities
├── exception/        # Global exception handling
├── repository/       # Spring Data JPA repositories
├── security/         # JWT filter, JWT util, user details service
└── service/          # Business logic
```

## Notes

- `spring.jpa.hibernate.ddl-auto` is set to `update`, so the schema is created/updated automatically on startup — no manual migrations needed for local dev.
- Passwords are hashed with BCrypt.
- Change `JWT_SECRET` before deploying to production.

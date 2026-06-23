# BBQDN App Docker Deployment

A webapp template using the **BBQDN** stack:

- **B**un for runtime and package management
- **B**epalo **Q**uery
- **D**rizzle ORM for database mapping
- **N**ext.js for frontend architecture

---

## Monorepo Architecture

This project is a monorepo structured with Bun Workspaces and managed with Turborepo:

```text
├── app/
│   ├── frontend/       # Next.js application (standalone build output optimized)
│   └── server/         # Bun API server running native TypeScript
├── package/
│   └── logger/         # Shared workspace utility package
├── nginx/
│   ├── docker.conf.template # Docker-specific reverse proxy layout
│   └── raw.conf.template    # Native host VPS reverse proxy & static asset handler
├── turbo.json          # Pipeline task dependency graph configuration
├── docker-compose.yml  # Multi-container production layout orchestration
└── package.json        # Unified workspace scripts mapping
```

---

## Local Development Workflow

### 1. Prerequisites

Ensure you have Bun installed locally.

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
PORT=3000
SERVER_PORT=4000
USE_PROD_DATABASE=false
DATABASE_FILE_NAME="file:.local.db"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="development-secret-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000/api/auth"
BETTER_AUTH_TRUSTED_ORIGINS='["http://localhost:3000"]'
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Execution Commands

Run commands from the repository root. Bun automatically loads the top-level `.env`.

```bash
# Install workspace dependencies
bun install

# Run frontend and backend in watch mode
bun dev

# Apply database schema changes
bun db:migrate

# Launch Drizzle Studio
bun db:studio

# Run checks
bun lint
bun format
```

---

## Local Production Testing

Preview the production setup locally:

```bash
# Build production assets
bun build

# Start production bundles
bun start
```

> **Note:** The start pipeline copies required static assets into the standalone bundle to avoid local asset-loading issues.

---

## Deployment

### Deploy to a VPS Using Docker

#### 1. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Docker and Git

```bash
sudo apt install git docker.io docker-compose-plugin -y
sudo systemctl enable --now docker
```

#### 3. Setup SSL Certificates (Let's Encrypt)

Generate certificates on the VPS host:

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com
```

#### 4. Configure `docker-compose.yml`

Ensure the Nginx service mounts the SSL certificates:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    - /etc/letsencrypt/live/yourdomain.com:/etc/nginx/ssl:ro
    - next_static:/data/next/static:ro
    - next_public:/data/next/public:ro
```

---

## Continuous Integration & Deployment (CI/CD)

This template includes GitHub Actions workflows out of the box.

### Continuous Integration (`.github/workflows/ci.yml`)

On every push or pull request to `main`, the workflow:

- Caches dependencies via `~/.bun/install/cache`.
- Uses Turborepo's `.turbo` cache to skip unchanged work.
- Runs type checking, formatting checks, and Next.js builds in parallel.

### Continuous Deployment via SSH

Add the following secrets in:

**Settings → Secrets and variables → Actions**

| Secret                    | Description                             |
| ------------------------- | --------------------------------------- |
| `VPS_HOST`                | Server public IP address                |
| `VPS_USER`                | SSH user (e.g. `root`, `ubuntu`)        |
| `VPS_SSH_KEY`             | Private SSH key used for deployment     |
| `PROD_DATABASE_URL`       | Production PostgreSQL connection string |
| `PROD_BETTER_AUTH_SECRET` | High-entropy secret used by Better Auth |

After tests pass, the deployment workflow:

1. Connects to the VPS over SSH.
2. Pulls the latest changes.
3. Rebuilds containers.
4. Restarts services using:

```bash
docker compose up --build -d
```

This enables automated deployments with minimal downtime.

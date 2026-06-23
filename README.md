# BBQDN App Raw Manual Deployment

A webapp template using the **BBQDN** stack:

- **B**un for runtime and package management
- **B**epalo **Q**uery
- **D**rizzle ORM for database mapping
- **N**ext.js for frontend architecture

[Deployment using Docker](./README.docker.md)

---

## Monorepo Architecture

This project is a monorepo structured with Bun Workspaces and managed by Turborepo:

```text
├── app/
│   ├── frontend/            # Next.js application (standalone build output optimized)
│   └── server/              # Bun API server running native TypeScript
├── package/
│   └── logger/              # Shared workspace utility package
├── nginx/
│   ├── docker.conf.template # Docker-specific reverse proxy layout
│   └── raw.conf.template    # Native host VPS reverse proxy configuration
├── turbo.json               # Pipeline task dependency graph configuration
├── ecosystem.config.cjs     # PM2 process manager configuration
└── package.json             # Unified workspace scripts mapping
```

---

## Local Development Workflow

### 1. Prerequisites

Ensure Bun is installed locally.

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

Run commands from the repository root:

```bash
# Install dependencies
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

> **Note:** The start pipeline copies static assets into the standalone bundle to avoid local asset-loading issues.

---

## Production Manual Deployment (Without Docker)

### 1. Prepare Your VPS

SSH into your server and install the required components:

```bash
sudo apt update && sudo apt upgrade -y

# Install Git, Nginx, and PostgreSQL
sudo apt install git nginx postgresql postgresql-contrib -y

# Install Bun
curl -fsSL https://bun.sh/install | bash

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Install PM2 globally
bun install -g pm2
```

---

### 2. Create the Production Database

Switch to the PostgreSQL user:

```bash
sudo -i -u postgres
psql
```

Inside PostgreSQL:

```sql
CREATE USER bqp_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE bbqdn_prod;
GRANT ALL PRIVILEGES ON DATABASE bbqdn_prod TO bqp_user;
```

Exit:

```text
\q
exit
```

---

### 3. One-Time Nginx Initialization

Create the target deployment directory and configure the initial symbolic link to point directly to your version-controlled raw.conf file:

```bash
sudo mkdir -p /var/www/bbqdn
sudo chown -R $USER:$USER /var/www/bbqdn

# Link Nginx sites-available directly to your repository folder
sudo ln -sf /var/www/bbqdn/nginx/raw.conf /etc/nginx/sites-available/bbqdn
sudo ln -sf /etc/nginx/sites-available/bbqdn /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/bbqdn /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl restart nginx
```

---

## Continuous Integration & Deployment (CI/CD)

### Continuous Deployment via SSH

Add the following secrets to:

**Settings → Secrets and variables → Actions**

| Secret        | Description                         |
| ------------- | ----------------------------------- |
| `VPS_HOST`    | Server public IP address            |
| `VPS_USER`    | SSH user (e.g. `root`, `ubuntu`)    |
| `VPS_SSH_KEY` | Private SSH key used for deployment |

---

### GitHub Actions Deployment

```yaml
deploy:
  needs: build-and-test
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest

  steps:
    - name: Manual Native SSH Deploy
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          export PATH="$HOME/.bun/bin:$PATH"

          if [ ! -d "/var/www/bbqdn" ]; then
            git clone https://github.com/${{ github.repository }}.git /var/www/bbqdn
          fi

          cd /var/www/bbqdn
          git pull origin main

          # Ensure production environment variables are configured
          bun install --frozen-lockfile
          bun turbo run build
          bun --env-file=.env turbo run migrate:prod

          # Reload PM2 processes with zero downtime
          bun run pm2:reload
```

After tests succeed, GitHub Actions connects to the server over SSH, updates the repository, rebuilds the application, runs database migrations, and reloads the PM2-managed processes without downtime.

## The Quick VPS Fix (If the pipeline hangs)

If your pipeline runs into this, SSH into your VPS one time and grant your non-root user passwordless execution privileges specifically for the Nginx lifecycle control binaries:
Bash

```sh
sudo visudo
```

Add this rule line at the very bottom of the configuration file (replacing ubuntu with your target VPS_USER name):
Plaintext

```sh
ubuntu ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /usr/bin/systemctl reload nginx
```

# IT MANAGEMENT SYSTEM

Web system for managing a support team (incident support), with additional project and HR modules.

Built with Angular on the front-end and Node.js/Express + MySQL on the back-end.

## About this repository

The code is published here as a portfolio piece.

## Features

- Login with MFA (TOTP) and captcha (reCAPTCHA)
- Incident, problem, and RCA management
- SLA control and reopening justifications
- Analyst, allocation, vacation, on-call, and skills module
- Project timebox / capacity planning
- HR module (candidates, hours tracking)
- Report export (Excel/CSV)
- Multi-tenant: the system supports multiple "accounts" (databases)

## Technologies

- **Frontend:** Angular 19, Angular Material, Chart.js
- **Backend:** Node.js, Express, MySQL2
- **Authentication:** bcrypt, TOTP (MFA), reCAPTCHA v2

## Running locally

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1. Database

Create a database (e.g. `empresa1`) and import the structure. Two options:

```bash
# Option A: table structure only, everything empty
mysql -u root -p empresa1 < backend/schema.sql

# Option B (recommended for testing): structure + domain/catalog tables already
# populated (systems, modules, status, problem types, reasons, holidays...),
# so the application doesn't open completely empty
mysql -u root -p empresa1 < backend/seed.sql
```

> Neither file contains real incident, user, analyst, or time-tracking data — only structure, and in the case of `seed.sql`, generic catalog data.

After importing, create a test user so you can log in:

```bash
cd backend
npm install
node seed-test-user.js
```

This creates the user **TESTE1** / password **teste1** in the database (adjustable via the `SEED_DB_NAME` variable if you use a database name other than `empresa1`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # adjust MySQL host/user/password if needed
node server.js
```

### 3. Frontend

```bash
npm install
ng serve --open
```

The application opens at `http://localhost:4200`. On the login screen, select the account matching the database you created.

> Windows shortcut: `sig.bat` starts both backend and frontend.

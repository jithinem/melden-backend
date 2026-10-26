# Melden Backend

Express API for customer, invoice, and payment management.

## Run the app locally

### Prerequisites

- Node.js and npm
- PostgreSQL

Create a PostgreSQL database, then create a `.env` file in the repository root:

```env
DATABASE_URL="postgresql://<user>:root@localhost:5432/<database>?schema=public"
PORT=5001
NODE_ENV=development
```

Replace `<user>`, `<password>`, and `<database>` with your local PostgreSQL credentials and database name.

### Install, migrate, and start

From the repository root:

```sh
npm ci
npm run prisma:generate
npm run migrate:deploy
npm run dev
```

The API runs at `http://localhost:5001`. Check that it is responding at `http://localhost:5001/health`.

The server seeds the demo customers and invoices on startup. Repeated starts do not duplicate existing seed records.

To create and apply a new development migration after changing the Prisma schema, run:

```sh
npm run migrate:dev -- <migration_name>
npm run prisma:generate
```

## Import the API collection into Postman

1. Open Postman and select **Import**.
2. Select **Files**, then choose `postman.json` from the repository root.
3. Import the **Melden Invoicing and Payments API** collection.
4. Use the collection's `base_url` variable, which defaults to `http://localhost:5001`. Change it in the collection variables if the server uses another host or port.
5. Set `customer_id` and `invoice_id` to IDs from your database before sending requests that reference them.

The collection includes the health checks and currently enabled customer, invoice, and payment endpoints. Customer PUT and DELETE routes are not included because they are currently disabled.

All application API routes are under `/api/v1`; for example, the invoice list is `GET http://localhost:5001/api/v1/invoices`.

# melden-backend

## Run the full app with Docker Compose

From the repository root, run:

```sh
docker compose up --build -d
```

Compose starts PostgreSQL with the `melden_db` database, then starts the backend after the database is healthy. Backend startup runs `npm run prisma:generate` and `npm run migrate:deploy` before launching the API. The frontend is available at <http://localhost:5173>; the API is available at <http://localhost:5001>.

The backend container connects to `postgresql://postgres:undertaker@db:5432/melden_db?schema=public`; containers use the Compose service hostname `db`, not `localhost`. PostgreSQL is published on host port `5433` to avoid conflict with a local PostgreSQL service already using `5432`, and is available from the host at `postgresql://postgres:undertaker@localhost:5433/melden_db?schema=public`. PostgreSQL data persists in the `postgres_data` volume.

To stop the services without removing database data, run `docker compose down`. To remove database data as well, run `docker compose down --volumes`.
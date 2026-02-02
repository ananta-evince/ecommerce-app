# Seed Railway (or any fresh) database

After connecting to a **new / empty** database (e.g. Railway), run from the **backend** folder:

```bash
cd backend
npm run seed
```

This inserts all product data. Optionally create an admin user:

```bash
npm run seed:admin
```

Use the same `.env` that points to your Railway DB (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT).

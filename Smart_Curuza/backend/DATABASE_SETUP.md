# PostgreSQL Database Setup Guide

## Prerequisites
You need PostgreSQL installed on your system. Choose one of the following options:

### Option 1: Install PostgreSQL Locally (Windows)
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

### Option 2: Use Docker (Recommended for Development)
```bash
docker run --name smart-curuza-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_curuza \
  -p 5432:5432 \
  -d postgres:15
```

### Option 3: Use a Cloud PostgreSQL Service
- **Supabase** (Free tier): https://supabase.com/
- **Neon** (Free tier): https://neon.tech/
- **Railway** (Free tier): https://railway.app/

---

## Step 1: Create the Database

### If using local PostgreSQL or Docker:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE smart_curuza;

# Exit psql
\q
```

### If using a cloud service:
The database is usually created automatically. Just get the connection string.

---

## Step 2: Configure Environment Variables

Update the `.env` file in the `backend` directory:

```env
# For local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=smart_curuza
DB_SSL=false

# For cloud PostgreSQL (example)
# DB_HOST=your-project.supabase.co
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_cloud_password
# DB_NAME=postgres
# DB_SSL=true
```

---

## Step 3: Run the Migration

The migration script is located at: `backend/migrations/001_initial_schema.sql`

### Method A: Using psql
```bash
cd backend
psql -U postgres -d smart_curuza -f migrations/001_initial_schema.sql
```

### Method B: Using a GUI tool
1. Open **pgAdmin** or **DBeaver**
2. Connect to your database
3. Open the `001_initial_schema.sql` file
4. Execute the script

---

## Step 4: Start the Backend

With TypeORM's `synchronize: true` in development mode, the tables will be automatically created based on the entities if they don't exist.

```bash
cd backend
npm run start:dev
```

You should see:
```
[TypeORM] Connection to database established
[NestFactory] Starting Nest application...
Application is running on: http://localhost:3001
```

---

## Step 5: Verify the Setup

### Check if tables were created:
```sql
-- Connect to the database
psql -U postgres -d smart_curuza

-- List all tables
\dt

-- You should see:
-- merchants
-- products
-- batches
-- customers
-- sales
-- debt_ledger
-- device_heartbeats
```

### Test the API:
```bash
# Health check
curl http://localhost:3001

# Should return: "Smart-Curuza Backend API Running"
```

---

## Troubleshooting

### Error: "Connection refused"
- Make sure PostgreSQL is running
- Check if the port 5432 is correct
- Verify the host (localhost vs 127.0.0.1)

### Error: "password authentication failed"
- Double-check the password in `.env`
- Make sure the username is correct

### Error: "database does not exist"
- Create the database manually using `CREATE DATABASE smart_curuza;`

### TypeORM synchronize not working
- Set `synchronize: true` in `typeorm.config.ts` (development only!)
- Or run the migration script manually

---

## Production Considerations

⚠️ **IMPORTANT**: Before deploying to production:

1. **Disable synchronize**:
   ```typescript
   synchronize: false  // Never use true in production!
   ```

2. **Use migrations**:
   - Install TypeORM CLI: `npm install -g typeorm`
   - Generate migrations: `typeorm migration:generate`
   - Run migrations: `typeorm migration:run`

3. **Enable SSL**:
   ```env
   DB_SSL=true
   ```

4. **Use environment-specific credentials**:
   - Never commit `.env` to version control
   - Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

---

## Next Steps

Once the database is set up:
1. ✅ Test the ClientManagement API endpoints
2. ✅ Create seed data for testing
3. ✅ Build additional modules (Inventory, Sales, etc.)

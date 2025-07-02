# Supabase Setup Guide

This project uses Supabase for the database backend. Follow these steps to set up your local development environment with Supabase.

## Prerequisites

Before starting, make sure you have the following installed:

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
2. **Node.js** (version 16+) and npm

## One-Command Setup (Recommended)

We've created a setup script that will handle all the necessary steps for you:

```bash
# Make the script executable
chmod +x setup-local.sh

# Run the setup script
./setup-local.sh
```

This script will:
- Check if Docker and Supabase CLI are installed
- Install Supabase CLI if needed (on macOS)
- Create a local .env.local file from env.example
- Start the local Supabase instance
- Apply database migrations and seed data

## Manual Setup

If you prefer to set up manually or if the script doesn't work for you, follow these steps:

### Step 1: Install Supabase CLI

#### macOS
```bash
brew install supabase/tap/supabase
```

#### Windows (using Scoop)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Linux
Follow the installation instructions at [Supabase CLI docs](https://supabase.com/docs/guides/cli/getting-started)

### Step 2: Set Up Environment Variables

```bash
# Copy the example environment variables
cp env.example .env.local
```

### Step 3: Start Supabase

```bash
# Start local Supabase services
supabase start
```

### Step 4: Apply Migrations and Seed Data

```bash
# Reset the database with migrations and seed data
supabase db reset
```

## Working with the Database

### Accessing Supabase Studio

After setup, you can access the Supabase Studio (admin UI) at:

```
http://localhost:54323
```

### Database Connection Information

- **Database URL**: `postgresql://postgres:postgres@localhost:54322/postgres`
- **API URL**: `http://localhost:54321`
- **Studio URL**: `http://localhost:54323`

### Working with Migrations

To create a new migration:

1. Create a SQL file in the `supabase/migrations` directory with a timestamp prefix:
   ```
   supabase/migrations/YYYYMMDDHHMMSS_description.sql
   ```

2. Apply the migration:
   ```bash
   supabase db reset
   ```

### Starting and Stopping Services

```bash
# Start services
supabase start

# Stop services
supabase stop

# Check status
supabase status
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, you may have another process using one of Supabase's ports (54321-54324). Stop any other PostgreSQL services or applications using these ports.

### Docker Issues

- Make sure Docker Desktop is running
- Try restarting Docker if you encounter container issues
- Check Docker logs for more detailed error information

### Database Reset Errors

If `supabase db reset` fails, try:
```bash
supabase stop
supabase start
supabase db reset
```

### Connection Issues

If your application can't connect to Supabase:
1. Verify your .env.local file has the correct URLs and keys
2. Confirm Supabase is running with `supabase status`
3. Try restarting the Supabase services

## Production Deployment

For production, you'll need to:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Update environment variables with your production Supabase URL and keys
3. Apply migrations to your production database:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) 
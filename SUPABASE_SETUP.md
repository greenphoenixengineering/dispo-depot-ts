# Supabase Setup Guide

This project uses Supabase for the database backend and NextAuth.js for authentication. Follow these steps to set up your local development environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Process](#setup-process)
   - [Step 1: Run the Setup Script](#step-1-run-the-setup-script)
   - [Step 2: Set Up Google OAuth Credentials](#step-2-set-up-google-oauth-credentials)
   - [Testing Your Setup](#testing-your-setup)
3. [Manual Setup](#manual-setup)
4. [Working with the Database](#working-with-the-database)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

## Prerequisites

Before starting, make sure you have the following installed:

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
2. **Node.js** (version 16+) and npm

## Setup Process

### Step 1: Run the Setup Script

We've created a setup script that will handle the initial Supabase setup for you:

```bash
# Make the script executable
chmod +x setup-local.sh

# Run the setup script
./setup-local.sh
```

This script will:
- Check if Docker and Supabase CLI are installed
- Install Supabase CLI if needed (on macOS)
- Create a local .env file from env.example
- Start the local Supabase instance
- Apply database migrations

After running the script, you'll need to:

1. Copy the following Supabase connection variables from the terminal output to your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_terminal
SUPABASE_SERVICE_ROLE=your_service_role_key_from_terminal
```

The actual values will be displayed in the terminal after the script completes. Look for the "ENVIRONMENT VARIABLES FOR YOUR PROJECT" section in the output.

### Step 2: Set Up Google OAuth Credentials

For authentication to work properly, you need to set up Google OAuth credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set up the OAuth consent screen if prompted
6. For "Application type", select "Web application"
7. Add the following authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
8. Click "Create" to generate your client ID and secret
9. Add these credentials to your `.env` file along with the required NextAuth configuration:

```
# Google OAuth
GOOGLE_ID=your_client_id
GOOGLE_SECRET=your_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

For `NEXTAUTH_SECRET`, use a random string to encrypt tokens. You can generate one using:
```bash
openssl rand -base64 32
```

After adding these environment variables, restart your Next.js development server for the changes to take effect.

### Testing Your Setup

To verify that everything is working correctly:

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to the sign-in page in your application
   
3. Try signing in with Google
   
4. After successful authentication, you should be redirected back to your application
   
5. Check the Supabase Studio (http://localhost:54323) to verify that:
   - A new user was created in the `next_auth.users` table
   - A new wholesaler record was created in the `public.wholesaler` table

If you encounter any issues, check the browser console and server logs for errors.

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
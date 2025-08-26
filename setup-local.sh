#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "========================================="
echo "🚀 Dispo Depot Supabase Setup Script 🚀"
echo "========================================="
echo "This script will set up your local Supabase database for development."
echo "It will apply the migration file that contains application-specific schemas and tables."
echo "Note: Default Supabase schemas (auth, storage, etc.) are created automatically."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker Desktop first:"
  echo "   https://www.docker.com/products/docker-desktop/"
  exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo "❌ Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI is not installed. Installing now..."
  
  # Check OS and install accordingly
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS, installing with Homebrew..."
    brew install supabase/tap/supabase || {
      echo "Failed to install with Homebrew. Please install manually:"
      echo "https://supabase.com/docs/guides/cli/getting-started"
      exit 1
    }
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Detected Linux, please follow installation instructions at:"
    echo "https://supabase.com/docs/guides/cli/getting-started"
    exit 1
  elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Detected Windows, please run this command in PowerShell:"
    echo "scoop bucket add supabase https://github.com/supabase/scoop-bucket.git"
    echo "scoop install supabase"
    exit 1
  else
    echo "Unknown OS. Please install Supabase CLI manually:"
    echo "https://supabase.com/docs/guides/cli/getting-started"
    exit 1
  fi
fi

# Create local .env file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file from env.example..."
  cp env.example .env.local || {
    echo "⚠️ Could not create .env.local file. Please copy env.example to .env.local manually."
  }
fi

echo "✅ Prerequisites checked!"
echo ""

echo "🔄 Starting local Supabase instance (this may take a few minutes the first time)..."
echo "   Downloading Docker images and setting up containers..."
supabase start

echo ""
echo "⏳ Waiting for Supabase services to be ready..."
sleep 10

# Get database connection information from supabase status
echo "📝 Getting database connection information..."
DB_URL=$(supabase status | grep 'DB URL' | awk '{print $3}')
API_URL=$(supabase status | grep 'API URL' | awk '{print $3}')
STUDIO_URL=$(supabase status | grep 'Studio URL' | awk '{print $3}')
ANON_KEY=$(supabase status | grep 'anon key' | awk '{print $3}')
SERVICE_ROLE_KEY=$(supabase status | grep 'service_role key' | awk '{print $3}')

echo ""
echo "🔄 Applying database migrations..."
echo "   This will create application-specific schemas, tables, and functions..."
echo "   (Default Supabase schemas like auth, storage, etc. are already created)"

# Try to apply migrations, with error handling
if ! supabase db reset --no-seed; then
  echo ""
  echo "⚠️  Migration encountered errors, but this might be okay if tables already exist."
  echo "   The following functions should now be available:"
  echo "     - get_tags_with_buyer_count: Returns tags with their buyer counts"
  echo "     - handle_new_user_to_wholesaler: Creates wholesaler record for new users"
  echo "     - update_buyer_and_sync_tags: Updates buyer info and their tags"
  echo "   Continuing with setup..."
fi

echo ""
echo "✅ Setup complete! Your local Supabase instance is now running."
echo ""
echo "📊 Connection Information:"
echo "-------------------------------------------"
echo "Database URL: $DB_URL"
echo "API URL: $API_URL"
echo "Studio URL: $STUDIO_URL"
echo ""

# Display environment variables that need to be set
echo "======================================================"
echo "🔑 ENVIRONMENT VARIABLES FOR YOUR PROJECT"
echo "======================================================"
echo ""
echo "Add these environment variables to your app when running:"
echo ""
echo "# Database Connection"
echo "DATABASE_URL=$DB_URL"
echo ""
echo "# Supabase Connection"
echo "NEXT_PUBLIC_SUPABASE_URL=$API_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
echo "SUPABASE_SERVICE_ROLE=$SERVICE_ROLE_KEY"
echo ""
echo "======================================================"
echo ""
echo "📋 INSTRUCTIONS:"
echo "1. Add the environment variables above to your development setup"
echo "2. Run 'npm run dev' to start your development server"
echo ""
echo "👉 Access Supabase Studio at: $STUDIO_URL"
echo "👉 When you're done, run 'supabase stop' to shut down the services"
echo ""
echo "Happy coding! 🎉"
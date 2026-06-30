#!/bin/bash
set -e

# Function to create database
create_database() {
    local db_name=$1
    echo "Creating database: $db_name"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE DATABASE $db_name;
        GRANT ALL PRIVILEGES ON DATABASE $db_name TO $POSTGRES_USER;
EOSQL
}

# Create additional databases
create_database knicks_auth
create_database knicks_products
create_database knicks_orders
create_database knicks_users

echo "All databases created successfully!"
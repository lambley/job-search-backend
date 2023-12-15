-- Check if the database exists; if not, then create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'joblistingdb') THEN
        CREATE DATABASE joblistingdb;
    END IF;
END $$;

-- Check if the user exists; if not, then create it and grant privileges
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'password';
        GRANT ALL PRIVILEGES ON DATABASE joblistingdb TO postgres;
    END IF;
END $$;

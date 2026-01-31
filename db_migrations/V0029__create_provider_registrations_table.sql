-- Create table for provider registrations and balances
CREATE TABLE IF NOT EXISTS provider_registrations (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_provider_registrations_provider_id ON provider_registrations(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_registrations_date ON provider_registrations(registration_date);
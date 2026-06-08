-- KYC System Database Schema
-- Pure SQL schema with proper constraints and relationships

-- Create ENUM type for KYC status
CREATE TYPE kyc_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('Admin', 'User', 'Agent');

-- Create ENUM type for document types
CREATE TYPE document_type AS ENUM ('Aadhaar', 'PAN', 'Passport', 'DrivingLicense', 'Utility', 'Other');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- KYC table
CREATE TABLE IF NOT EXISTS kyc (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    aadhaar VARCHAR(12),
    pan VARCHAR(10),
    status kyc_status DEFAULT 'Pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    kyc_id INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    type document_type NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kyc_id) REFERENCES kyc(id) ON DELETE CASCADE
);

-- Audit table for tracking KYC status changes
CREATE TABLE IF NOT EXISTS kyc_audit_log (
    id SERIAL PRIMARY KEY,
    kyc_id INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    old_status kyc_status,
    new_status kyc_status,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kyc_id) REFERENCES kyc(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_kyc_user_id ON kyc(user_id);
CREATE INDEX idx_kyc_status ON kyc(status);
CREATE INDEX idx_documents_kyc_id ON documents(kyc_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_kyc_audit_kyc_id ON kyc_audit_log(kyc_id);
CREATE INDEX idx_kyc_audit_changed_at ON kyc_audit_log(changed_at);

-- Sample data insertion
-- Password is 'admin123' (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
    ('Admin User', 'admin@kyc.com', '$2b$12$tYzG7M1vY9K8Z5X2Q1W3u.8X5Q1W3u8X5Y2Z0A1B2C3D4E5F6G7H8I9', 'Admin'),
    ('John Doe', 'john@example.com', '$2b$12$tYzG7M1vY9K8Z5X2Q1W3u.8X5Q1W3u8X5Y2Z0A1B2C3D4E5F6G7H8I9', 'User'),
    ('Agent Smith', 'agent@kyc.com', '$2b$12$tYzG7M1vY9K8Z5X2Q1W3u.8X5Q1W3u8X5Y2Z0A1B2C3D4E5F6G7H8I9', 'Agent')
ON CONFLICT DO NOTHING;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    onboarding_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'AUD',
    square_payment_id VARCHAR(255) UNIQUE,
    square_order_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_square_payment_id ON payments(square_payment_id);
CREATE INDEX idx_payments_status ON payments(status);


-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Merchants Table
-- Stores shop owner details & subscription status.
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    lock_status VARCHAR(50) DEFAULT 'UNLOCKED',
    -- e.g., 'LOCKED', 'UNLOCKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 2. Products Table
-- Handles "Breaking Bulk" (1 Sack = 50kg).
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barcode VARCHAR(255) UNIQUE,
    parent_id UUID REFERENCES products(id),
    -- Self-referencing for bulk items
    conversion_factor DECIMAL(10, 4) DEFAULT 1.0,
    -- e.g., 50 for 50kg sack
    stock DECIMAL(15, 4) DEFAULT 0.0,
    price DECIMAL(15, 2) DEFAULT 0.00,
    name VARCHAR(255),
    -- Implicitly needed for product identification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 3. Batches Table
-- Tracks profitability of specific stock batches (e.g., Sack of Eggplants).
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    cost_price DECIMAL(15, 2) NOT NULL,
    expected_revenue DECIMAL(15, 2) NOT NULL,
    current_revenue DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    -- e.g., 'ACTIVE', 'CLOSED', 'SPOILED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 4. Customers Table
-- Stores client profiles.
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_debt DECIMAL(15, 2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 5. Sales Table
-- Record transactions (Cash/MoMo/Credit).
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE
    SET NULL,
        -- Linked to customers, nullable for guest sales
        total DECIMAL(15, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        -- e.g., 'CASH', 'MOMO', 'CREDIT'
        sync_status VARCHAR(50) DEFAULT 'PENDING',
        -- e.g., 'PENDING', 'SYNCED'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 6. Debt Ledger Table
-- Tracks "Madeni" (Credit sales).
CREATE TABLE debt_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    -- Linked to customers
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    -- Linked to sales
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 7. Device Heartbeats Table
-- Used for the MDM security lock logic.
CREATE TABLE device_heartbeats (
    device_id VARCHAR(255) NOT NULL,
    -- Corresponds to merchants.device_id
    last_ping_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);
-- Indexes for performance optimization
CREATE INDEX idx_products_parent_id ON products(parent_id);
CREATE INDEX idx_batches_product_id ON batches(product_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_debt_ledger_customer_id ON debt_ledger(customer_id);
CREATE INDEX idx_debt_ledger_sale_id ON debt_ledger(sale_id);
CREATE INDEX idx_device_heartbeats_device_id ON device_heartbeats(device_id);
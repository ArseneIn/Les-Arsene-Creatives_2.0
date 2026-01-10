-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Merchants Table
-- Stores shop owner details and device lock status.
-- ==========================================
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    lock_status VARCHAR(50) DEFAULT 'UNLOCKED', -- 'LOCKED', 'UNLOCKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Products Table
-- Handles inventory and "Breaking Bulk" logic.
-- ==========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    barcode VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES products(id), -- Self-reference for Breaking Bulk (e.g., 1kg from 50kg sack)
    conversion_factor DECIMAL(10, 2) DEFAULT 1.0, -- e.g., 50 (1 Parent = 50 Children)
    stock DECIMAL(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. Batches Table (Yield Tracking)
-- Tracks profitability of specific stock batches.
-- ==========================================
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    cost_price DECIMAL(10, 2) NOT NULL,
    expected_revenue DECIMAL(10, 2) NOT NULL,
    current_revenue DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'SPOILED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. Customers Table
-- Stores client profiles and their total debt.
-- ==========================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_debt DECIMAL(10, 2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, phone) -- Ensure unique customer per merchant
);

-- ==========================================
-- 5. Sales Table
-- Records transactions. Linked to Customers for credit sales.
-- ==========================================
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Optional: Only for Credit/Loyalty sales
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'CASH', 'MOMO', 'CREDIT'
    sync_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'SYNCED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. Debt Ledger Table
-- Tracks specific credit sales ("Madeni").
-- Linked to BOTH Customer and Sale for audit trails.
-- ==========================================
CREATE TABLE debt_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE, -- Links debt to the specific transaction
    amount_due DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'OVERDUE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. Device Heartbeats Table
-- Used for MDM security lock logic.
-- ==========================================
CREATE TABLE device_heartbeats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) REFERENCES merchants(device_id) ON DELETE CASCADE,
    last_ping_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

-- ==========================================
-- Indexes for Performance
-- ==========================================
CREATE INDEX idx_sales_merchant ON sales(merchant_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_debt_customer ON debt_ledger(customer_id);
CREATE INDEX idx_debt_sale ON debt_ledger(sale_id);
CREATE INDEX idx_batches_product ON batches(product_id);

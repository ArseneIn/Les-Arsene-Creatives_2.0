--
-- Seed Data for Smart Curuza (Supabase)
-- WARNING: This contains dummy passwords. Change them immediately after logging in.
--

-- 1. Create a Super Admin User
-- Credentials: admin@smartcuruza.com / password123 / PIN: 1234
INSERT INTO public.users (
    id, 
    name, 
    email, 
    phone, 
    password, 
    pin_hash, 
    role, 
    created_at, 
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'System Administrator', 
    'admin@smartcuruza.com', 
    '+250700000000', 
    '$2b$10$Kda97hgRlAeTBLuC/ajKhehT4ZPVSWCnudwpgOOuBGO3E/GR9g0Lu', -- 'password123'
    '$2b$10$Je79Eb4fLLTfKyiHyiPuCu06DyL0Wf68pwkJs9CWSUuv5ICj2v1ai', -- '1234'
    'SUPERADMIN', 
    now(), 
    now()
);

-- 2. Create a Test Merchant User
-- Credentials: merchant@smartcuruza.com / password123 / PIN: 1234
INSERT INTO public.users (
    id, 
    name, 
    email, 
    phone, 
    password, 
    pin_hash, 
    role, 
    created_at, 
    updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222', 
    'Demo Merchant', 
    'merchant@smartcuruza.com', 
    '+250711111111', 
    '$2b$10$Kda97hgRlAeTBLuC/ajKhehT4ZPVSWCnudwpgOOuBGO3E/GR9g0Lu', -- 'password123'
    '$2b$10$Je79Eb4fLLTfKyiHyiPuCu06DyL0Wf68pwkJs9CWSUuv5ICj2v1ai', -- '1234'
    'MERCHANT', 
    now(), 
    now()
);

-- 3. Create a Merchant Business Profile for the Test Merchant
INSERT INTO public.merchants (
    id, 
    device_id, 
    wallet_balance, 
    lock_status, 
    business_name, 
    address, 
    phone, 
    vat_rate, 
    subscription_status, 
    owner_id, 
    created_at, 
    updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333', 
    'DEMO-DEVICE-001', 
    0, 
    'UNLOCKED', 
    'Demo Quincaillerie', 
    'Kigali, Rwanda', 
    '+250711111111', 
    18.00, 
    'ACTIVE', 
    '22222222-2222-2222-2222-222222222222', -- Links to Test Merchant User
    now(), 
    now()
);

-- 4. Update the Merchant User to link back to the Merchant Business
UPDATE public.users 
SET "merchantId" = '33333333-3333-3333-3333-333333333333' 
WHERE id = '22222222-2222-2222-2222-222222222222';

-- 5. Create a Demo Product for the Merchant
INSERT INTO public.products (
    id, 
    merchant_id, 
    name, 
    stock, 
    price, 
    cost_price, 
    status, 
    unit, 
    created_at
) VALUES (
    '44444444-4444-4444-4444-444444444444', 
    '33333333-3333-3333-3333-333333333333', 
    'Ciment Cimerwa 50kg', 
    100.00, 
    12500.00, 
    11000.00, 
    'active', 
    'pcs', 
    now()
);

-- ================================================================
-- DWS MONSTER — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ================================================================

-- BRANDS table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  service_type TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending | partial | paid | cancelled
  payment_method TEXT,
  invoice_number TEXT UNIQUE,
  notes TEXT,
  project_url TEXT,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- unread | read | replied
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEWSLETTER emails
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY — public can only read active brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (active = true);

-- Transactions, messages, newsletter — no public access (service role only)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at on transactions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample brands (your existing ones)
INSERT INTO brands (name, logo_url, website_url, display_order) VALUES
  ('Subio Foods', '/brands/Subio.webp', 'https://subiofoods.com', 1),
  ('CraveCart', '/brands/cravecart.webp', 'https://crave-cart-82wd.onrender.com', 2),
  ('Diyami Productions', '/brands/diyami.webp', 'https://diyamiproductions.com', 3),
  ('AC5 Construction', '/brands/ac5.webp', 'https://www.ac5construction.co.uk', 4);

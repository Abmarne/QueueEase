-- 1. Create ENUMs
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('business', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE queue_status AS ENUM ('active', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE token_status AS ENUM ('waiting', 'served', 'left');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure Trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SYNC: Add existing users who were missed
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'name',
  COALESCE((raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- 3. Create Queues table
CREATE TABLE queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status queue_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for guest entry
  guest_name TEXT, -- To store names of customers who don't log in
  position SERIAL, 
  status token_status NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Users: Owners can read/write their own profiles
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Queues: Everyone can read active queues, only businesses can manage their own
CREATE POLICY "Public can read active queues" ON queues
  FOR SELECT USING (true); -- Everyone can see all queues for joining

CREATE POLICY "Businesses can manage their own queues" ON queues
  FOR ALL USING (auth.uid() = business_id);

-- Tokens: Customers can read their own tokens, businesses can manage tokens in their queues
CREATE POLICY "Public can read their own token status" ON tokens
  FOR SELECT USING (true); -- We'll filter by ID in the application logic for status page

CREATE POLICY "Businesses can manage tokens in their queues" ON tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM queues 
      WHERE queues.id = tokens.queue_id 
      AND queues.business_id = auth.uid()
    )
  );

CREATE POLICY "Public can join queues" ON tokens
  FOR INSERT WITH CHECK (true); -- Allow anyone to join a queue

CREATE POLICY "Public can update their own token status" ON tokens
  FOR UPDATE USING (true); -- Allow 'leaving' via status page

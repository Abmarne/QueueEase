-- 1. Create ENUMs (Safe duplicate check)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('business', 'customer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'queue_status') THEN
        CREATE TYPE queue_status AS ENUM ('active', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_status') THEN
        CREATE TYPE token_status AS ENUM ('waiting', 'served', 'left');
    END IF;
END $$;

-- 2. Create Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Business logic to sync Auth Users to Public Users
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
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync any existing users right now
INSERT INTO public.users (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'name', COALESCE((raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
FROM auth.users ON CONFLICT (id) DO NOTHING;

-- 4. Create Queues table
CREATE TABLE IF NOT EXISTS public.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status queue_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Tokens table
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID NOT NULL REFERENCES public.queues(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL, 
  guest_name TEXT, 
  position INTEGER NOT NULL, 
  status token_status NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- 7. Policies for USERS (The Visibility Fix)
CREATE POLICY "Public can read all profile names" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON public.users FOR ALL USING (auth.uid() = id);

-- 8. Policies for QUEUES
CREATE POLICY "Anyone can view queues" ON public.queues FOR SELECT USING (true);
CREATE POLICY "Businesses manage own queues" ON public.queues FOR ALL USING (auth.uid() = business_id);

-- 9. Policies for TOKENS
CREATE POLICY "Anyone can view tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can join a queue" ON public.tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can update their own token" ON public.tokens FOR UPDATE USING (true);
CREATE POLICY "Businesses manage their queue tokens" ON public.tokens FOR ALL USING (
  EXISTS (SELECT 1 FROM public.queues WHERE queues.id = tokens.queue_id AND queues.business_id = auth.uid())
);

-- 10. Enable REAL-TIME (Broadcasting)
-- Check if publication exists, if not create, else add tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    -- Note: This can fail if tables are already in it, so we ignore errors for specific tables
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.queues, public.tokens;
    EXCEPTION
        WHEN others THEN NULL;
    END;
END $$;

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table for additional user data
CREATE TABLE IF NOT EXISTS public.users_2025_11_20_15_49 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT UNIQUE,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create character rarity enum
CREATE TYPE character_rarity AS ENUM ('common', 'rare', 'epic', 'legendary', 'mythical');

-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters_2025_11_20_15_49 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users_2025_11_20_15_49(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species_mix TEXT[] NOT NULL, -- Array of species that were crossbred
    rarity character_rarity NOT NULL,
    image_url TEXT,
    attributes JSONB DEFAULT '{}', -- Store character stats and traits
    is_tradeable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hatched_at TIMESTAMP WITH TIME ZONE
);

-- Create token locks table
CREATE TABLE IF NOT EXISTS public.token_locks_2025_11_20_15_49 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users_2025_11_20_15_49(id) ON DELETE CASCADE,
    token_amount DECIMAL(18, 8) NOT NULL,
    lock_duration_days INTEGER NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unlock_at TIMESTAMP WITH TIME ZONE NOT NULL,
    character_id UUID REFERENCES public.characters_2025_11_20_15_49(id),
    is_unlocked BOOLEAN DEFAULT false,
    transaction_hash TEXT
);

-- Create trading table
CREATE TABLE IF NOT EXISTS public.trades_2025_11_20_15_49 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.users_2025_11_20_15_49(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.users_2025_11_20_15_49(id),
    character_id UUID REFERENCES public.characters_2025_11_20_15_49(id) ON DELETE CASCADE,
    price_tokens DECIMAL(18, 8) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.users_2025_11_20_15_49 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters_2025_11_20_15_49 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_locks_2025_11_20_15_49 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_2025_11_20_15_49 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users_2025_11_20_15_49
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users_2025_11_20_15_49
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile" ON public.users_2025_11_20_15_49
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can view own characters" ON public.characters_2025_11_20_15_49
    FOR SELECT USING (
        owner_id IN (
            SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can view all tradeable characters" ON public.characters_2025_11_20_15_49
    FOR SELECT USING (is_tradeable = true);

CREATE POLICY "Users can update own characters" ON public.characters_2025_11_20_15_49
    FOR UPDATE USING (
        owner_id IN (
            SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own token locks" ON public.token_locks_2025_11_20_15_49
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can create token locks" ON public.token_locks_2025_11_20_15_49
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can view all active trades" ON public.trades_2025_11_20_15_49
    FOR SELECT USING (status = 'active' OR seller_id IN (
        SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
    ) OR buyer_id IN (
        SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
    ));

CREATE POLICY "Users can create trades for own characters" ON public.trades_2025_11_20_15_49
    FOR INSERT WITH CHECK (
        seller_id IN (
            SELECT id FROM public.users_2025_11_20_15_49 WHERE auth_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_characters_owner ON public.characters_2025_11_20_15_49(owner_id);
CREATE INDEX idx_characters_rarity ON public.characters_2025_11_20_15_49(rarity);
CREATE INDEX idx_token_locks_user ON public.token_locks_2025_11_20_15_49(user_id);
CREATE INDEX idx_trades_status ON public.trades_2025_11_20_15_49(status);
CREATE INDEX idx_trades_character ON public.trades_2025_11_20_15_49(character_id);
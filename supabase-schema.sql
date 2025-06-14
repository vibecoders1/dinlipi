-- দিনলিপি Database Schema
-- Run this in your Supabase SQL editor to create the necessary tables

-- Enable Row Level Security (RLS) by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_language TEXT DEFAULT 'bn',
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create diary_entries table
CREATE TABLE IF NOT EXISTS public.diary_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create practices table
CREATE TABLE IF NOT EXISTS public.practices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER DEFAULT 7,
    type TEXT DEFAULT 'daily_creation' CHECK (type IN ('daily_creation', 'mood_board', 'word_cloud', 'photo', 'drawing', 'writing', 'music', 'love')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create practice_entries table
CREATE TABLE IF NOT EXISTS public.practice_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
    emotions TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for diary_entries
CREATE POLICY "Users can view own diary entries" ON public.diary_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries" ON public.diary_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries" ON public.diary_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary entries" ON public.diary_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for practices
CREATE POLICY "Users can view own practices" ON public.practices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practices" ON public.practices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practices" ON public.practices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practices" ON public.practices
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for practice_entries
CREATE POLICY "Users can view own practice entries" ON public.practice_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice entries" ON public.practice_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice entries" ON public.practice_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice entries" ON public.practice_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for mood_entries
CREATE POLICY "Users can view own mood entries" ON public.mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON public.mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON public.mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON public.mood_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Functions to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER on_user_profiles_updated
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_diary_entries_updated
    BEFORE UPDATE ON public.diary_entries
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_practices_updated
    BEFORE UPDATE ON public.practices
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_date ON public.diary_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_practices_user_active ON public.practices(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_practice_entries_user_practice ON public.practice_entries(user_id, practice_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON public.mood_entries(user_id, date DESC);
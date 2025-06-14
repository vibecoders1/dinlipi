-- Create mood table
CREATE TABLE public.moods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default moods
INSERT INTO public.moods (name, emoji, color) VALUES
  ('happy', '😊', '#22c55e'),
  ('sad', '😢', '#3b82f6'),
  ('excited', '🤩', '#f59e0b'),
  ('angry', '😠', '#ef4444'),
  ('peaceful', '😌', '#8b5cf6'),
  ('anxious', '😰', '#f97316'),
  ('grateful', '🙏', '#10b981'),
  ('tired', '😴', '#6b7280'),
  ('confused', '😕', '#64748b'),
  ('motivated', '💪', '#ec4899');

-- Add mood_id column to diary_entries table
ALTER TABLE public.diary_entries 
ADD COLUMN mood_id UUID REFERENCES public.moods(id);

-- Set default mood to 'happy' for existing entries
UPDATE public.diary_entries 
SET mood_id = (SELECT id FROM public.moods WHERE name = 'happy');

-- Enable RLS for moods table
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for moods - everyone can read, no one can modify
CREATE POLICY "Moods are readable by everyone" 
ON public.moods 
FOR SELECT 
USING (true);
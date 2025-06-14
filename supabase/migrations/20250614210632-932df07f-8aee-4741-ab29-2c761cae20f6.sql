-- Add user_id column to tags table
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the unique constraint to include user_id
ALTER TABLE public.tags 
DROP CONSTRAINT IF EXISTS tags_name_key;

ALTER TABLE public.tags 
ADD CONSTRAINT tags_user_id_name_unique UNIQUE(user_id, name);

-- Enable Row Level Security on tables
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entry_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Users can view their own tags" 
ON public.tags 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
ON public.tags 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
ON public.tags 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
ON public.tags 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for diary_entry_tags
CREATE POLICY "Users can view their own diary entry tags" 
ON public.diary_entry_tags 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.diary_entries 
        WHERE id = diary_entry_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create their own diary entry tags" 
ON public.diary_entry_tags 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.diary_entries 
        WHERE id = diary_entry_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own diary entry tags" 
ON public.diary_entry_tags 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.diary_entries 
        WHERE id = diary_entry_id AND user_id = auth.uid()
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tags_user_name ON public.tags(user_id, name);
CREATE INDEX IF NOT EXISTS idx_diary_entry_tags_entry ON public.diary_entry_tags(diary_entry_id);
CREATE INDEX IF NOT EXISTS idx_diary_entry_tags_tag ON public.diary_entry_tags(tag_id);
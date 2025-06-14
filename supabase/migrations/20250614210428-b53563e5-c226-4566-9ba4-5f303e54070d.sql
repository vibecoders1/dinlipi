-- Create diary_entries table
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table for normalization
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diary_entry_tags junction table for many-to-many relationship
CREATE TABLE public.diary_entry_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diary_entry_id UUID NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(diary_entry_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX idx_diary_entries_date ON public.diary_entries(date);
CREATE INDEX idx_diary_entries_user_date ON public.diary_entries(user_id, date);
CREATE INDEX idx_diary_entry_tags_diary_entry_id ON public.diary_entry_tags(diary_entry_id);
CREATE INDEX idx_diary_entry_tags_tag_id ON public.diary_entry_tags(tag_id);

-- Enable Row Level Security
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entry_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diary_entries
CREATE POLICY "Users can view their own diary entries" 
ON public.diary_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries" 
ON public.diary_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" 
ON public.diary_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" 
ON public.diary_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for tags (allow all authenticated users to read, but only create if doesn't exist)
CREATE POLICY "Anyone can view tags" 
ON public.tags 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create tags" 
ON public.tags 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for diary_entry_tags (users can only manage tags for their own entries)
CREATE POLICY "Users can view tags for their own entries" 
ON public.diary_entry_tags 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.diary_entries 
    WHERE diary_entries.id = diary_entry_tags.diary_entry_id 
    AND diary_entries.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tags for their own entries" 
ON public.diary_entry_tags 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.diary_entries 
    WHERE diary_entries.id = diary_entry_tags.diary_entry_id 
    AND diary_entries.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete tags from their own entries" 
ON public.diary_entry_tags 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.diary_entries 
    WHERE diary_entries.id = diary_entry_tags.diary_entry_id 
    AND diary_entries.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_diary_entries_updated_at
BEFORE UPDATE ON public.diary_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
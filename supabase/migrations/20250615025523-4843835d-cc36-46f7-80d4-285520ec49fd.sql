-- Create practices table to store different types of practice entries
CREATE TABLE public.practices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  practice_type TEXT NOT NULL CHECK (practice_type IN ('photo', 'drawing', 'writing', 'music', 'daily_creation')),
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own practices" 
ON public.practices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own practices" 
ON public.practices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practices" 
ON public.practices 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practices" 
ON public.practices 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_practices_updated_at
BEFORE UPDATE ON public.practices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Add content field to todos table for multi-line notes
ALTER TABLE public.todos 
ADD COLUMN content TEXT;
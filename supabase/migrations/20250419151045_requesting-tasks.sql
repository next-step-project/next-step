ALTER TABLE public.tasks
ADD COLUMN requesting_tasks boolean DEFAULT false;

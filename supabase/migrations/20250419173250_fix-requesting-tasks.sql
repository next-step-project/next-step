ALTER TABLE public.tasks
  DROP COLUMN requesting_tasks;

ALTER TABLE public.topics
  ADD COLUMN requesting_tasks boolean DEFAULT false;

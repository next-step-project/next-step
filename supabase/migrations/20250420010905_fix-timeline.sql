ALTER TABLE public.timeline_nodes
  ADD COLUMN time timestamp with time zone NOT NULL DEFAULT now();

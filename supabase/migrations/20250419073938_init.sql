CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  owner uuid NOT NULL,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT fk_topics_owner FOREIGN KEY (owner) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE public.timeline_nodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT fk_topic_timeline_nodes FOREIGN KEY (topic_id) REFERENCES public.topics (id) ON DELETE CASCADE
);

CREATE TYPE public.task_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status public.task_status NOT NULL DEFAULT 'pending',

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT fk_topic_tasks FOREIGN KEY (topic_id) REFERENCES public.topics (id) ON DELETE CASCADE
);

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_owner ON public.topics
  FOR ALL
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

ALTER TABLE public.timeline_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_owner ON public.timeline_nodes
  FOR ALL
  USING (EXISTS(SELECT 1 FROM public.topics t WHERE t.id = topic_id AND t.owner = auth.uid()))
  WITH CHECK (EXISTS(SELECT 1 FROM public.topics t WHERE t.id = topic_id AND t.owner = auth.uid()));

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_owner ON public.tasks
  FOR ALL
  USING (EXISTS(SELECT 1 FROM public.topics t WHERE t.id = topic_id AND t.owner = auth.uid()))
  WITH CHECK (EXISTS(SELECT 1 FROM public.topics t WHERE t.id = topic_id AND t.owner = auth.uid()));

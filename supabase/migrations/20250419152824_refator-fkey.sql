ALTER TABLE public.topics
  DROP CONSTRAINT fk_topics_owner,
  ADD CONSTRAINT fk_topics_owner FOREIGN KEY (owner) 
    REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.timeline_nodes
  DROP CONSTRAINT fk_topic_timeline_nodes,
  ADD CONSTRAINT fk_topic_timeline_nodes FOREIGN KEY (topic_id) 
    REFERENCES public.topics (id) ON DELETE CASCADE;

ALTER TABLE public.tasks
  DROP CONSTRAINT fk_topic_tasks,
  ADD CONSTRAINT fk_topic_tasks FOREIGN KEY (topic_id) 
    REFERENCES public.topics (id) ON DELETE CASCADE;

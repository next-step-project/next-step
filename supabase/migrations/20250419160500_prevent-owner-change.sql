ALTER TABLE public.topics
  ALTER COLUMN owner SET DEFAULT auth.uid();

DROP POLICY allow_owner ON public.topics;
CREATE POLICY allow_owner ON public.topics
  FOR ALL
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

DROP POLICY allow_owner ON public.timeline_nodes;
CREATE POLICY allow_owner ON public.timeline_nodes
  FOR ALL
  USING (EXISTS (
    SELECT 1
    FROM public.topics
    WHERE public.topics.id = public.timeline_nodes.topic_id
      AND public.topics.owner = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.topics
    WHERE public.topics.id = public.timeline_nodes.topic_id
      AND public.topics.owner = auth.uid()
  ));

DROP POLICY allow_owner ON public.tasks;
CREATE POLICY allow_owner ON public.tasks
  FOR ALL
  USING (EXISTS (
    SELECT 1
    FROM public.topics
    WHERE public.topics.id = public.tasks.topic_id
      AND public.topics.owner = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1
    FROM public.topics
    WHERE public.topics.id = public.tasks.topic_id
      AND public.topics.owner = auth.uid()
  ));

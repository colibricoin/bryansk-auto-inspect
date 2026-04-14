
CREATE TABLE public.notification_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notification_emails"
ON public.notification_emails
FOR SELECT
USING (true);

-- Seed initial emails
INSERT INTO public.notification_emails (email, is_active) VALUES
  ('suvorovalud@yandex.ru', true),
  ('saleber@yandex.ru', true);

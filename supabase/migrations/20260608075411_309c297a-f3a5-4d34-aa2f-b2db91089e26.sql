
DROP POLICY IF EXISTS "Anyone can read notification_emails" ON public.notification_emails;
REVOKE SELECT ON public.notification_emails FROM anon, authenticated;

ALTER PUBLICATION supabase_realtime DROP TABLE public.requests;

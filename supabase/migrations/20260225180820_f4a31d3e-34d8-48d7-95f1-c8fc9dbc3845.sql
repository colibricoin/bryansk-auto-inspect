
-- Create requests table
CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source_form text NOT NULL DEFAULT 'online_booking',
  name text NOT NULL,
  phone text NOT NULL,
  vehicle_category text,
  plate_number text,
  desired_date date,
  desired_time text,
  comment text,
  status text NOT NULL DEFAULT 'new',
  admin_note text
);

-- Enable RLS
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public forms)
CREATE POLICY "Anyone can submit a request"
  ON public.requests FOR INSERT
  WITH CHECK (true);

-- Only service_role can read/update (admin via edge function)
-- No SELECT/UPDATE policies for anon - admin uses service_role key

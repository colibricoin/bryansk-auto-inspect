
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_category TEXT NOT NULL,
  plate_number TEXT,
  desired_date DATE,
  desired_time TEXT,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'confirmed', 'completed', 'canceled')),
  admin_note TEXT
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT (public booking form)
CREATE POLICY "Anyone can submit a booking"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — admin access via edge functions with service role

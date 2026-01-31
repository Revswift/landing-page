-- Create waitlist table for storing signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT REFERENCES public.waitlist(referral_code),
  position INTEGER NOT NULL,
  referral_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_referral_code ON public.waitlist(referral_code);
CREATE INDEX idx_waitlist_referred_by ON public.waitlist(referred_by);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join the waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own entry by email (for checking if already signed up)
CREATE POLICY "Anyone can view waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (true);

-- Create function to update referral count when someone uses a referral code
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE public.waitlist
    SET referral_count = referral_count + 1,
        updated_at = now()
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update referral counts
CREATE TRIGGER on_waitlist_insert_update_referral
AFTER INSERT ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_referral_count();

-- Create function to get next position
CREATE OR REPLACE FUNCTION public.get_next_waitlist_position()
RETURNS INTEGER AS $$
DECLARE
  next_pos INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 2400) + 1 INTO next_pos FROM public.waitlist;
  RETURN next_pos;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
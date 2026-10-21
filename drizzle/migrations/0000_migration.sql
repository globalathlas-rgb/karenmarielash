CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Only Karen's confirmed email becomes admin
CREATE OR REPLACE FUNCTION public.grant_owner_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'karen.lustosa2010@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_owner_role
AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_role();

CREATE TABLE public.anamnese_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  age int NOT NULL CHECK (age BETWEEN 12 AND 110),
  procedure text NOT NULL CHECK (char_length(procedure) BETWEEN 2 AND 200),
  answers jsonb NOT NULL,
  notes text CHECK (notes IS NULL OR char_length(notes) <= 2000),
  needs_review boolean NOT NULL DEFAULT false,
  guidelines_ack boolean NOT NULL CHECK (guidelines_ack),
  privacy_consent boolean NOT NULL CHECK (privacy_consent)
);
GRANT INSERT ON public.anamnese_submissions TO anon, authenticated;
GRANT SELECT, DELETE ON public.anamnese_submissions TO authenticated;
GRANT ALL ON public.anamnese_submissions TO service_role;
ALTER TABLE public.anamnese_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit" ON public.anamnese_submissions FOR INSERT TO anon, authenticated WITH CHECK (guidelines_ack AND privacy_consent);
CREATE POLICY "admin reads" ON public.anamnese_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes" ON public.anamnese_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.data_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 5 AND 160),
  request_type text NOT NULL CHECK (request_type IN ('acesso','exclusao')),
  details text CHECK (details IS NULL OR char_length(details) <= 1000)
);
GRANT INSERT ON public.data_requests TO anon, authenticated;
GRANT SELECT, DELETE ON public.data_requests TO authenticated;
GRANT ALL ON public.data_requests TO service_role;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request" ON public.data_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin reads requests" ON public.data_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes requests" ON public.data_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
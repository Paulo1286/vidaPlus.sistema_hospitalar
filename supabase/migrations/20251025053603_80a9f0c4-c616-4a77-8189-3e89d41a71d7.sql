-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('paciente', 'profissional', 'administrador');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'administrador'));

-- Update profiles table to include role reference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role public.app_role;

-- Update handle_new_user function to include role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  -- Get role from metadata, default to 'paciente'
  user_role := COALESCE((new.raw_user_meta_data->>'role')::public.app_role, 'paciente');
  
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário'),
    user_role
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$$;

-- Update RLS policies for pacientes table
DROP POLICY IF EXISTS "Users can view own pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Users can insert own pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Users can update own pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Users can delete own pacientes" ON public.pacientes;

CREATE POLICY "Pacientes can view own data"
ON public.pacientes
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'profissional') OR public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Pacientes can insert own data"
ON public.pacientes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorized users can update pacientes"
ON public.pacientes
FOR UPDATE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'profissional') OR public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Admins can delete pacientes"
ON public.pacientes
FOR DELETE
USING (public.has_role(auth.uid(), 'administrador'));

-- Update RLS policies for profissionais table
DROP POLICY IF EXISTS "Users can view own profissionais" ON public.profissionais;
DROP POLICY IF EXISTS "Users can insert own profissionais" ON public.profissionais;
DROP POLICY IF EXISTS "Users can update own profissionais" ON public.profissionais;
DROP POLICY IF EXISTS "Users can delete own profissionais" ON public.profissionais;

CREATE POLICY "All authenticated can view profissionais"
ON public.profissionais
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert profissionais"
ON public.profissionais
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Profissionais can update own data"
ON public.profissionais
FOR UPDATE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Admins can delete profissionais"
ON public.profissionais
FOR DELETE
USING (public.has_role(auth.uid(), 'administrador'));

-- Update RLS policies for agendamentos
DROP POLICY IF EXISTS "Users can view own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can insert own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can update own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can delete own agendamentos" ON public.agendamentos;

CREATE POLICY "Pacientes can view own agendamentos"
ON public.agendamentos
FOR SELECT
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Pacientes can insert agendamentos"
ON public.agendamentos
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'paciente') OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Authorized users can update agendamentos"
ON public.agendamentos
FOR UPDATE
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Authorized users can delete agendamentos"
ON public.agendamentos
FOR DELETE
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'administrador')
);

-- Update RLS policies for prontuarios
DROP POLICY IF EXISTS "Users can view own prontuarios" ON public.prontuarios;
DROP POLICY IF EXISTS "Users can insert own prontuarios" ON public.prontuarios;
DROP POLICY IF EXISTS "Users can update own prontuarios" ON public.prontuarios;
DROP POLICY IF EXISTS "Users can delete own prontuarios" ON public.prontuarios;

CREATE POLICY "Pacientes and profissionais can view prontuarios"
ON public.prontuarios
FOR SELECT
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Profissionais can insert prontuarios"
ON public.prontuarios
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Profissionais can update prontuarios"
ON public.prontuarios
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Admins can delete prontuarios"
ON public.prontuarios
FOR DELETE
USING (public.has_role(auth.uid(), 'administrador'));

-- Update RLS policies for telemedicina
DROP POLICY IF EXISTS "Users can view own telemedicina" ON public.telemedicina;
DROP POLICY IF EXISTS "Users can insert own telemedicina" ON public.telemedicina;
DROP POLICY IF EXISTS "Users can update own telemedicina" ON public.telemedicina;
DROP POLICY IF EXISTS "Users can delete own telemedicina" ON public.telemedicina;

CREATE POLICY "Pacientes and profissionais can view telemedicina"
ON public.telemedicina
FOR SELECT
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Authorized users can insert telemedicina"
ON public.telemedicina
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'paciente') OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Authorized users can update telemedicina"
ON public.telemedicina
FOR UPDATE
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'profissional') OR 
  public.has_role(auth.uid(), 'administrador')
);

CREATE POLICY "Admins can delete telemedicina"
ON public.telemedicina
FOR DELETE
USING (public.has_role(auth.uid(), 'administrador'));
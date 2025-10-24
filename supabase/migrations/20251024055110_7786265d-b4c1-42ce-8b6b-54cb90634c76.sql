-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create pacientes table
CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pacientes"
  ON public.pacientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pacientes"
  ON public.pacientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pacientes"
  ON public.pacientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pacientes"
  ON public.pacientes FOR DELETE
  USING (auth.uid() = user_id);

-- Create profissionais table
CREATE TABLE public.profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  crm TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profissionais"
  ON public.profissionais FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profissionais"
  ON public.profissionais FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profissionais"
  ON public.profissionais FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profissionais"
  ON public.profissionais FOR DELETE
  USING (auth.uid() = user_id);

-- Create agendamentos table
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE CASCADE NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendado',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agendamentos"
  ON public.agendamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agendamentos"
  ON public.agendamentos FOR DELETE
  USING (auth.uid() = user_id);

-- Create prontuarios table
CREATE TABLE public.prontuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'Baixa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prontuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prontuarios"
  ON public.prontuarios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prontuarios"
  ON public.prontuarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prontuarios"
  ON public.prontuarios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prontuarios"
  ON public.prontuarios FOR DELETE
  USING (auth.uid() = user_id);

-- Create telemedicina table
CREATE TABLE public.telemedicina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE CASCADE NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendada',
  sala_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.telemedicina ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own telemedicina"
  ON public.telemedicina FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own telemedicina"
  ON public.telemedicina FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own telemedicina"
  ON public.telemedicina FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own telemedicina"
  ON public.telemedicina FOR DELETE
  USING (auth.uid() = user_id);
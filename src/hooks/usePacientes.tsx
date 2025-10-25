import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Paciente {
  id: string;
  user_id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  endereco?: string;
  created_at: string;
}

export const usePacientes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Paciente[];
    },
  });

  const addPaciente = useMutation({
    mutationFn: async (newPaciente: Omit<Paciente, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("pacientes")
        .insert([{ ...newPaciente, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      toast({
        title: "Sucesso!",
        description: "Paciente cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePaciente = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Paciente> & { id: string }) => {
      const { data, error } = await supabase
        .from("pacientes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      toast({
        title: "Sucesso!",
        description: "Paciente atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    pacientes,
    isLoading,
    addPaciente: addPaciente.mutate,
    updatePaciente: updatePaciente.mutate,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Agendamento {
  id: string;
  user_id: string;
  paciente_id: string;
  profissional_id: string;
  data_hora: string;
  tipo: string;
  status: string;
  observacoes?: string;
  created_at: string;
}

export const useAgendamentos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .order("data_hora", { ascending: true });

      if (error) throw error;
      return data as Agendamento[];
    },
  });

  const addAgendamento = useMutation({
    mutationFn: async (newAgendamento: Omit<Agendamento, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("agendamentos")
        .insert([{ ...newAgendamento, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso.",
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

  const updateAgendamento = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Agendamento> & { id: string }) => {
      const { data, error } = await supabase
        .from("agendamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      toast({
        title: "Sucesso!",
        description: "Agendamento atualizado com sucesso.",
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

  const deleteAgendamento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agendamentos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      toast({
        title: "Sucesso!",
        description: "Agendamento cancelado com sucesso.",
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
    agendamentos,
    isLoading,
    addAgendamento: addAgendamento.mutate,
    updateAgendamento: updateAgendamento.mutate,
    deleteAgendamento: deleteAgendamento.mutate,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Telemedicina {
  id: string;
  user_id: string;
  paciente_id: string;
  profissional_id: string;
  data_hora: string;
  status: string;
  sala_id?: string;
  created_at: string;
}

export const useTelemedicina = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: consultas = [], isLoading } = useQuery({
    queryKey: ["telemedicina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("telemedicina")
        .select("*")
        .order("data_hora", { ascending: true });

      if (error) throw error;
      return data as Telemedicina[];
    },
  });

  const addConsulta = useMutation({
    mutationFn: async (newConsulta: Omit<Telemedicina, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("telemedicina")
        .insert([{ ...newConsulta, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telemedicina"] });
      toast({
        title: "Sucesso!",
        description: "Teleconsulta agendada com sucesso.",
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

  const updateConsulta = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Telemedicina> & { id: string }) => {
      const { data, error } = await supabase
        .from("telemedicina")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telemedicina"] });
      toast({
        title: "Sucesso!",
        description: "Teleconsulta atualizada com sucesso.",
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
    consultas,
    isLoading,
    addConsulta: addConsulta.mutate,
    updateConsulta: updateConsulta.mutate,
  };
};

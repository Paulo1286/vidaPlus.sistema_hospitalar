import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Prontuario {
  id: string;
  user_id: string;
  paciente_id: string;
  tipo: string;
  descricao: string;
  prioridade: string;
  data: string;
  created_at: string;
}

export const useProntuarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prontuarios = [], isLoading } = useQuery({
    queryKey: ["prontuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prontuarios")
        .select("*")
        .order("data", { ascending: false });

      if (error) throw error;
      return data as Prontuario[];
    },
  });

  const addProntuario = useMutation({
    mutationFn: async (newProntuario: Omit<Prontuario, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("prontuarios")
        .insert([{ ...newProntuario, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prontuarios"] });
      toast({
        title: "Sucesso!",
        description: "Prontuário criado com sucesso.",
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

  const updateProntuario = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prontuario> & { id: string }) => {
      const { data, error } = await supabase
        .from("prontuarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prontuarios"] });
      toast({
        title: "Sucesso!",
        description: "Prontuário atualizado com sucesso.",
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
    prontuarios,
    isLoading,
    addProntuario: addProntuario.mutate,
    updateProntuario: updateProntuario.mutate,
  };
};

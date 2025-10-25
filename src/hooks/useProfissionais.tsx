import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profissional {
  id: string;
  user_id: string;
  nome: string;
  especialidade: string;
  crm: string;
  email: string;
  telefone: string;
  created_at: string;
}

export const useProfissionais = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profissionais = [], isLoading } = useQuery({
    queryKey: ["profissionais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profissionais")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profissional[];
    },
  });

  const addProfissional = useMutation({
    mutationFn: async (newProfissional: Omit<Profissional, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("profissionais")
        .insert([{ ...newProfissional, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profissionais"] });
      toast({
        title: "Sucesso!",
        description: "Profissional cadastrado com sucesso.",
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

  const updateProfissional = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Profissional> & { id: string }) => {
      const { data, error } = await supabase
        .from("profissionais")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profissionais"] });
      toast({
        title: "Sucesso!",
        description: "Profissional atualizado com sucesso.",
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
    profissionais,
    isLoading,
    addProfissional: addProfissional.mutate,
    updateProfissional: updateProfissional.mutate,
  };
};

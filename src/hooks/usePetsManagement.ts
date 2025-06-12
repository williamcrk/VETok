
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id: string;
  name: string;
  especie: string;
  raca: string;
  tutores?: {
    nome: string;
  };
}

export const usePetsManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const deletePet = async (pet: Pet): Promise<boolean> => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente o paciente ${pet.name}? Esta ação não pode ser desfeita.`)) {
      return false;
    }

    setLoading(true);

    try {
      // Verificar se o pet tem relacionamentos ativos
      const [
        { data: atendimentos },
        { data: internamentos },
        { data: exames },
        { data: vacinacoes }
      ] = await Promise.all([
        supabase.from('atendimentos').select('id').eq('pet_id', pet.id).limit(1),
        supabase.from('internamentos').select('id').eq('paciente_id', pet.id).limit(1),
        supabase.from('exames').select('id').eq('pet_id', pet.id).limit(1),
        supabase.from('vacinacoes').select('id').eq('paciente_id', pet.id).limit(1)
      ]);

      const hasRelatedData = (atendimentos && atendimentos.length > 0) || 
                            (internamentos && internamentos.length > 0) || 
                            (exames && exames.length > 0) ||
                            (vacinacoes && vacinacoes.length > 0);

      if (hasRelatedData) {
        // Pet tem dados relacionados, apenas marcar nome como inativo
        const { error } = await supabase
          .from('pets')
          .update({ 
            name: `${pet.name} (INATIVO)`,
            tutor_id: null
          })
          .eq('id', pet.id);

        if (error) throw error;

        toast({
          title: "Paciente desativado",
          description: `${pet.name} foi marcado como inativo devido a dados relacionados existentes.`,
          variant: "default",
        });
      } else {
        // Pet não tem dados relacionados, pode ser excluído permanentemente
        const { error } = await supabase
          .from('pets')
          .delete()
          .eq('id', pet.id);

        if (error) throw error;

        toast({
          title: "Paciente excluído!",
          description: `${pet.name} foi removido permanentemente do sistema.`,
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o paciente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deletePet,
    loading
  };
};

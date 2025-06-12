
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface InternamentoData {
  id: string;
  motivo: string;
  diagnostico?: string;
  data_entrada: string;
  data_saida?: string;
  status: string;
  observacoes?: string;
  paciente_id: string;
  veterinario_id?: string;
  pet?: {
    name: string;
    especie: string;
    tutor?: {
      nome: string;
      telefone?: string;
    };
  };
  veterinario?: {
    nome: string;
  };
}

export const useInternamentos = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const loadInternamentos = async (): Promise<InternamentoData[]> => {
    try {
      setLoading(true);
      
      // Buscar internamentos
      const { data: internamentosData, error: internamentosError } = await supabase
        .from('internamentos')
        .select('*')
        .order('data_entrada', { ascending: false });

      if (internamentosError) {
        console.error('Erro ao buscar internamentos:', internamentosError);
        return [];
      }

      if (!internamentosData || internamentosData.length === 0) {
        return [];
      }

      // Buscar pets relacionados
      const petIds = internamentosData.map(i => i.paciente_id).filter(Boolean);
      const { data: petsData } = await supabase
        .from('pets')
        .select('id, name, especie, tutor_id')
        .in('id', petIds);

      // Buscar tutores relacionados
      const tutorIds = petsData?.map(p => p.tutor_id).filter(Boolean) || [];
      const { data: tutoresData } = await supabase
        .from('tutores')
        .select('id, nome, telefone')
        .in('id', tutorIds);

      // Buscar veterinários relacionados
      const vetIds = internamentosData.map(i => i.veterinario_id).filter(Boolean);
      const { data: vetsData } = await supabase
        .from('veterinarios')
        .select('id, nome')
        .in('id', vetIds);

      // Combinar os dados
      const internamentosCompletos: InternamentoData[] = internamentosData.map(internamento => {
        const pet = petsData?.find(p => p.id === internamento.paciente_id);
        const tutor = pet ? tutoresData?.find(t => t.id === pet.tutor_id) : undefined;
        const veterinario = vetsData?.find(v => v.id === internamento.veterinario_id);
        
        return {
          ...internamento,
          pet: pet ? {
            name: pet.name || 'Nome não informado',
            especie: pet.especie || 'Não informado',
            tutor: tutor ? {
              nome: tutor.nome || 'Não informado',
              telefone: tutor.telefone
            } : undefined
          } : undefined,
          veterinario: veterinario ? {
            nome: veterinario.nome || 'Não informado'
          } : undefined
        };
      });

      return internamentosCompletos;
    } catch (error) {
      console.error('Erro ao carregar internamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os internamentos",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createInternamento = async (data: {
    paciente_id: string;
    veterinario_id?: string;
    motivo: string;
    diagnostico?: string;
    observacoes?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('internamentos')
        .insert({
          paciente_id: data.paciente_id,
          veterinario_id: data.veterinario_id,
          motivo: data.motivo,
          diagnostico: data.diagnostico,
          observacoes: data.observacoes,
          data_entrada: new Date().toISOString(),
          status: 'Internado'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Paciente internado com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao criar internamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o internamento",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loadInternamentos,
    createInternamento,
    loading
  };
};

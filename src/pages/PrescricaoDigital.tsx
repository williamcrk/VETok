import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, MessageCircle, Mail, Printer, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NovaReceitaModal from '@/components/prescricao/NovaReceitaModal';

interface Receita {
  id: string;
  data_prescricao: string;
  status: string;
  observacoes?: string;
  pet?: {
    name: string;
    tutor?: {
      nome: string;
    };
  };
  veterinario?: {
    nome: string;
  };
  itens_receita_digital?: {
    medicamento: string;
  }[];
}

const PrescricaoDigital = () => {
  const { toast } = useToast();
  const [isNewRecipeOpen, setIsNewRecipeOpen] = useState(false);
  const [prescricoes, setPrescricoes] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceitas();
  }, []);

  const loadReceitas = async () => {
    try {
      setLoading(true);
      
      // Buscar receitas
      const { data: receitasData, error } = await supabase
        .from('receitas_digitais')
        .select('*')
        .order('data_prescricao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar receitas:', error);
        setPrescricoes([]);
        return;
      }

      if (!receitasData || receitasData.length === 0) {
        setPrescricoes([]);
        return;
      }

      // Buscar pets relacionados
      const petIds = receitasData.map(r => r.pet_id).filter(Boolean);
      const { data: petsData } = await supabase
        .from('pets')
        .select('id, name, tutor_id')
        .in('id', petIds);

      // Buscar tutores relacionados
      const tutorIds = petsData?.map(p => p.tutor_id).filter(Boolean) || [];
      const { data: tutoresData } = await supabase
        .from('tutores')
        .select('id, nome')
        .in('id', tutorIds);

      // Buscar veterinários relacionados
      const vetIds = receitasData.map(r => r.veterinario_id).filter(Boolean);
      const { data: vetsData } = await supabase
        .from('veterinarios')
        .select('id, nome')
        .in('id', vetIds);

      // Buscar itens das receitas
      const receitaIds = receitasData.map(r => r.id);
      const { data: itensData } = await supabase
        .from('itens_receita_digital')
        .select('receita_id, medicamento')
        .in('receita_id', receitaIds);

      // Combinar os dados
      const receitasCompletas: Receita[] = receitasData.map(receita => {
        const pet = petsData?.find(p => p.id === receita.pet_id);
        const tutor = pet ? tutoresData?.find(t => t.id === pet.tutor_id) : undefined;
        const veterinario = vetsData?.find(v => v.id === receita.veterinario_id);
        const itens = itensData?.filter(i => i.receita_id === receita.id) || [];
        
        return {
          id: receita.id,
          data_prescricao: receita.data_prescricao || new Date().toISOString(),
          status: receita.status || 'ativa',
          observacoes: receita.observacoes,
          pet: pet ? {
            name: pet.name || 'Nome não informado',
            tutor: tutor ? {
              nome: tutor.nome || 'Não informado'
            } : undefined
          } : undefined,
          veterinario: veterinario ? {
            nome: veterinario.nome || 'Não informado'
          } : undefined,
          itens_receita_digital: itens.map(item => ({
            medicamento: item.medicamento || 'Medicamento não informado'
          }))
        };
      });

      setPrescricoes(receitasCompletas);

    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as receitas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditReceita = (receita: Receita) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleViewReceita = (receita: Receita) => {
    toast({
      title: "Em desenvolvimento", 
      description: "Visualização completa será implementada em breve.",
    });
  };

  const handleSendWhatsApp = (receita: Receita) => {
    toast({
      title: "Em desenvolvimento",
      description: "Envio por WhatsApp será implementado em breve.",
    });
  };

  const handleSendEmail = (receita: Receita) => {
    toast({
      title: "Em desenvolvimento",
      description: "Envio por email será implementado em breve.",
    });
  };

  const handlePrint = (receita: Receita) => {
    toast({
      title: "Em desenvolvimento",
      description: "Impressão será implementada em breve.",
    });
  };

  if (loading) {
    return (
      <PageLayout title="Prescrição Digital">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando receitas...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Prescrição Digital">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Receitas Digitais</h2>
            <p className="text-gray-600">Crie e gerencie prescrições veterinárias</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsNewRecipeOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{prescricoes.length}</p>
                  <p className="text-sm text-gray-600">Total de Receitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Enviadas por WhatsApp</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Enviadas por Email</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>Prescrições criadas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            {prescricoes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma receita cadastrada</p>
                <p className="text-sm mt-2">
                  Clique em "Nova Receita" para criar sua primeira prescrição
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescricoes.map((receita) => (
                  <div key={receita.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">Receita #{receita.id.slice(0, 8)}</h3>
                        <Badge className={receita.status === 'ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {receita.status === 'ativa' ? 'Ativa' : 'Finalizada'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {receita.pet?.name} - {receita.pet?.tutor?.nome}
                      </p>
                      <p className="text-sm font-medium">{receita.veterinario?.nome}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(receita.data_prescricao).toLocaleDateString('pt-BR')} • 
                        {receita.itens_receita_digital?.map(item => item.medicamento).join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewReceita(receita)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditReceita(receita)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendWhatsApp(receita)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendEmail(receita)}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrint(receita)}
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <NovaReceitaModal
          open={isNewRecipeOpen}
          onOpenChange={setIsNewRecipeOpen}
          onSuccess={() => {
            loadReceitas();
            toast({
              title: "Receita criada!",
              description: "A receita foi criada com sucesso.",
            });
          }}
        />
      </div>
    </PageLayout>
  );
};

export default PrescricaoDigital;

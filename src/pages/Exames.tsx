import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, Plus, Eye, Clock, CheckCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SolicitarExameModal from '@/components/exames/SolicitarExameModal';
import VerExameModal from '@/components/exames/VerExameModal';

interface Exame {
  id: string;
  tipo_exame: string;
  status: string;
  urgencia: string;
  data_solicitacao: string;
  data_resultado?: string;
  resultado?: string;
  pet?: {
    name: string;
    tutor?: {
      nome: string;
    };
  };
  veterinario?: {
    nome: string;
  };
}

const Exames = () => {
  const { toast } = useToast();
  const [isSolicitarOpen, setIsSolicitarOpen] = useState(false);
  const [isVerOpen, setIsVerOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exame | null>(null);
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExames();
  }, []);

  const loadExames = async () => {
    try {
      setLoading(true);
      
      // Buscar exames
      const { data: examesData, error } = await supabase
        .from('exames_solicitados')
        .select('*')
        .order('data_solicitacao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar exames:', error);
        setExames([]);
        return;
      }

      if (!examesData || examesData.length === 0) {
        setExames([]);
        return;
      }

      // Buscar pets relacionados
      const petIds = examesData.map(e => e.pet_id).filter(Boolean);
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
      const vetIds = examesData.map(e => e.veterinario_id).filter(Boolean);
      const { data: vetsData } = await supabase
        .from('veterinarios')
        .select('id, nome')
        .in('id', vetIds);

      // Combinar os dados
      const examesCompletos: Exame[] = examesData.map(exame => {
        const pet = petsData?.find(p => p.id === exame.pet_id);
        const tutor = pet ? tutoresData?.find(t => t.id === pet.tutor_id) : undefined;
        const veterinario = vetsData?.find(v => v.id === exame.veterinario_id);
        
        return {
          id: exame.id,
          tipo_exame: exame.tipo_exame || 'Não informado',
          status: exame.status || 'pendente',
          urgencia: exame.urgencia || 'rotina',
          data_solicitacao: exame.data_solicitacao || new Date().toISOString(),
          data_resultado: exame.data_resultado,
          resultado: exame.resultado,
          pet: pet ? {
            name: pet.name || 'Nome não informado',
            tutor: tutor ? {
              nome: tutor.nome || 'Não informado'
            } : undefined
          } : undefined,
          veterinario: veterinario ? {
            nome: veterinario.nome || 'Não informado'
          } : undefined
        };
      });

      setExames(examesCompletos);

    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os exames",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerExame = (exame: Exame) => {
    setSelectedExam(exame);
    setIsVerOpen(true);
  };

  const handleEditExame = (exame: Exame) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const pendentes = exames.filter(e => e.status === 'pendente').length;
  const concluidos = exames.filter(e => e.status === 'concluido').length;
  const urgentes = exames.filter(e => e.urgencia === 'urgente').length;

  if (loading) {
    return (
      <PageLayout title="Exames">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando exames...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Exames">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Controle de Exames</h2>
            <p className="text-gray-600">Solicite e visualize resultados de exames</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsSolicitarOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Solicitar Exame
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{exames.length}</p>
                  <p className="text-sm text-gray-600">Total de Exames</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendentes}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{concluidos}</p>
                  <p className="text-sm text-gray-600">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{urgentes}</p>
                  <p className="text-sm text-gray-600">Urgentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Exames</CardTitle>
            <CardDescription>Exames solicitados e resultados</CardDescription>
          </CardHeader>
          <CardContent>
            {exames.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum exame solicitado</p>
                <p className="text-sm mt-2">
                  Clique em "Solicitar Exame" para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {exames.map((exame) => (
                  <div key={exame.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">#{exame.id.slice(0, 8)}</h3>
                          <Badge className={exame.status === 'concluido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {exame.status === 'concluido' ? 'Concluído' : 'Pendente'}
                          </Badge>
                          {exame.urgencia === 'urgente' && (
                            <Badge className="bg-red-100 text-red-800">Urgente</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {exame.pet?.name} - {exame.pet?.tutor?.nome}
                        </p>
                        <p className="text-sm font-medium">{exame.tipo_exame}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(exame.data_solicitacao).toLocaleDateString('pt-BR')} • {exame.veterinario?.nome}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleEditExame(exame)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleVerExame(exame)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Resultado
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <SolicitarExameModal
          open={isSolicitarOpen}
          onOpenChange={setIsSolicitarOpen}
          onSuccess={() => {
            loadExames();
            toast({
              title: "Exame solicitado!",
              description: "O exame foi solicitado com sucesso.",
            });
          }}
        />

        <VerExameModal
          open={isVerOpen}
          onOpenChange={setIsVerOpen}
          exame={selectedExam}
        />
      </div>
    </PageLayout>
  );
};

export default Exames;

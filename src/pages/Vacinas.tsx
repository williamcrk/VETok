
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar, Syringe, AlertTriangle, CheckCircle2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NovaVacinacaoModal from '@/components/vacinas/NovaVacinacaoModal';

interface Vacinacao {
  id: string;
  vacina: string;
  data_aplicacao: string;
  status: string;
  lote?: string;
  preco?: number;
  pet?: {
    name: string;
    especie: string;
    tutor?: {
      nome: string;
      telefone: string;
    };
  };
  veterinario?: {
    nome: string;
  };
}

const Vacinas = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovaModal, setShowNovaModal] = useState(false);
  const [vacinacoes, setVacinacoes] = useState<Vacinacao[]>([]);
  const [stats, setStats] = useState({
    totalVacinas: 0,
    vacinasHoje: 0,
    proximosVencimentos: 0,
    aplicadas: 0
  });

  useEffect(() => {
    loadVacinacoes();
  }, []);

  const loadVacinacoes = async () => {
    try {
      setLoading(true);
      
      // Buscar vacinações
      const { data: vacinacoesData, error } = await supabase
        .from('vacinacoes')
        .select('*')
        .order('data_aplicacao', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setVacinacoes([]);
        return;
      }

      if (!vacinacoesData || vacinacoesData.length === 0) {
        setVacinacoes([]);
        setStats({
          totalVacinas: 0,
          vacinasHoje: 0,
          proximosVencimentos: 0,
          aplicadas: 0
        });
        return;
      }

      // Buscar pets relacionados
      const petIds = vacinacoesData.map(v => v.paciente_id).filter(Boolean);
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
      const vetIds = vacinacoesData.map(v => v.veterinario_id).filter(Boolean);
      const { data: vetsData } = await supabase
        .from('veterinarios')
        .select('id, nome')
        .in('id', vetIds);

      // Combinar os dados
      const vacinacoesCompletas: Vacinacao[] = vacinacoesData.map(vacinacao => {
        const pet = petsData?.find(p => p.id === vacinacao.paciente_id);
        const tutor = pet ? tutoresData?.find(t => t.id === pet.tutor_id) : undefined;
        const veterinario = vetsData?.find(v => v.id === vacinacao.veterinario_id);
        
        return {
          id: vacinacao.id,
          vacina: vacinacao.vacina || 'Vacina não informada',
          data_aplicacao: vacinacao.data_aplicacao || new Date().toISOString(),
          status: vacinacao.status || 'Agendada',
          lote: vacinacao.lote,
          preco: vacinacao.preco,
          pet: pet ? {
            name: pet.name || 'Nome não informado',
            especie: pet.especie || 'Não informado',
            tutor: tutor ? {
              nome: tutor.nome || 'Não informado',
              telefone: tutor.telefone || ''
            } : undefined
          } : undefined,
          veterinario: veterinario ? {
            nome: veterinario.nome || 'Não informado'
          } : undefined
        };
      });

      setVacinacoes(vacinacoesCompletas);

      // Calcular estatísticas
      const hoje = new Date().toDateString();
      const vacinasHoje = vacinacoesCompletas.filter(v => 
        v.data_aplicacao && new Date(v.data_aplicacao).toDateString() === hoje
      ).length;
      
      const aplicadas = vacinacoesCompletas.filter(v => v.status === 'Aplicada').length;
      
      setStats({
        totalVacinas: vacinacoesCompletas.length,
        vacinasHoje,
        proximosVencimentos: Math.floor(vacinacoesCompletas.length * 0.2), // Estimativa
        aplicadas
      });

    } catch (error) {
      console.error('Erro ao carregar vacinações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vacinações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVacinacao = (vacinacao: Vacinacao) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleAplicarVacina = (vacinacao: Vacinacao) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de aplicação será implementada em breve.",
    });
  };

  const filteredVacinacoes = vacinacoes.filter(vacinacao =>
    vacinacao.vacina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacinacao.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacinacao.pet?.tutor?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aplicada': return 'bg-green-100 text-green-800';
      case 'Agendada': return 'bg-blue-100 text-blue-800';
      case 'Vencida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aplicada': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Agendada': return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'Vencida': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Syringe className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <PageLayout title="Controle de Vacinas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando vacinações...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Controle de Vacinas">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Vacinas</p>
                  <p className="text-2xl font-bold">{stats.totalVacinas}</p>
                </div>
                <Syringe className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vacinas Hoje</p>
                  <p className="text-2xl font-bold">{stats.vacinasHoje}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Próximos Vencimentos</p>
                  <p className="text-2xl font-bold">{stats.proximosVencimentos}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aplicadas</p>
                  <p className="text-2xl font-bold">{stats.aplicadas}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Controle de Vacinações</CardTitle>
                <CardDescription>Gerencie o calendário vacinal dos pacientes</CardDescription>
              </div>
              <Button onClick={() => setShowNovaModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Vacinação
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por vacina, paciente ou tutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredVacinacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Syringe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma vacinação encontrada</p>
                  <p className="text-sm mt-2">
                    {searchTerm ? 'Tente ajustar os filtros de busca' : 'Cadastre a primeira vacinação'}
                  </p>
                </div>
              ) : (
                filteredVacinacoes.map((vacinacao) => (
                  <div key={vacinacao.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {getStatusIcon(vacinacao.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{vacinacao.vacina}</h3>
                            <Badge className={getStatusColor(vacinacao.status)}>
                              {vacinacao.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Paciente: <span className="font-medium">{vacinacao.pet?.name}</span> ({vacinacao.pet?.especie})</p>
                            <p>Tutor: <span className="font-medium">{vacinacao.pet?.tutor?.nome}</span></p>
                            <div className="flex gap-4 mt-1">
                              {vacinacao.data_aplicacao && (
                                <span>Data: {new Date(vacinacao.data_aplicacao).toLocaleDateString('pt-BR')}</span>
                              )}
                              {vacinacao.lote && <span>Lote: {vacinacao.lote}</span>}
                              {vacinacao.preco && <span>Valor: R$ {vacinacao.preco.toFixed(2)}</span>}
                              {vacinacao.veterinario?.nome && <span>Vet: {vacinacao.veterinario.nome}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVacinacao(vacinacao)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        {vacinacao.status === 'Agendada' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleAplicarVacina(vacinacao)}
                          >
                            Aplicar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <NovaVacinacaoModal
        open={showNovaModal}
        onOpenChange={setShowNovaModal}
        onSuccess={() => {
          loadVacinacoes();
          toast({
            title: "Vacinação cadastrada!",
            description: "A vacinação foi cadastrada com sucesso.",
          });
        }}
      />
    </PageLayout>
  );
};

export default Vacinas;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Heart, Clock, Activity, Thermometer, Droplets, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInternamentos, type InternamentoData } from '@/hooks/useInternamentos';
import NovoInternamentoModal from './NovoInternamentoModal';

interface SinaisVitais {
  id: string;
  internamento_id: string;
  temperatura: number | null;
  frequencia_cardiaca: number | null;
  frequencia_respiratoria: number | null;
  pressao_arterial: string | null;
  data_aferimento: string;
}

const InternamentoAvancado = () => {
  const { toast } = useToast();
  const { loadInternamentos, loading } = useInternamentos();
  const [internamentos, setInternamentos] = useState<InternamentoData[]>([]);
  const [sinaisVitais, setSinaisVitais] = useState<SinaisVitais[]>([]);
  const [showNovoModal, setShowNovoModal] = useState(false);

  useEffect(() => {
    loadData();
    // Auto refresh a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const internamentosData = await loadInternamentos();
      setInternamentos(internamentosData.filter(i => i.status === 'Internado'));

      // Buscar sinais vitais recentes
      const { data: sinaisData, error: sinaisError } = await supabase
        .from('monitoramento_internacao')
        .select('*')
        .order('data_hora', { ascending: false })
        .limit(50);

      if (sinaisError) {
        console.error('Erro ao buscar sinais vitais:', sinaisError);
        setSinaisVitais([]);
      } else {
        setSinaisVitais(sinaisData?.map(item => ({
          id: item.id,
          internamento_id: item.internacao_id || '',
          temperatura: item.temperatura,
          frequencia_cardiaca: item.frequencia_cardiaca,
          frequencia_respiratoria: item.frequencia_respiratoria,
          pressao_arterial: item.pressao_arterial,
          data_aferimento: item.data_hora
        })) || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do internamento",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'crítico': return 'bg-red-500';
      case 'estável': return 'bg-green-500';
      case 'observação': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const calcularDiasInternado = (dataEntrada: string) => {
    const entrada = new Date(dataEntrada);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - entrada.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSinaisVitaisRecentes = (internamentoId: string) => {
    return sinaisVitais.filter(s => s.internamento_id === internamentoId).slice(0, 1)[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando internamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Internamento Avançado</h2>
          <p className="text-gray-600">Monitoramento em tempo real dos pacientes internados</p>
        </div>
        <Button 
          onClick={() => setShowNovoModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Internamento
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{internamentos.length}</p>
                <p className="text-sm text-gray-600">Internados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {internamentos.filter(i => 
                    i.motivo?.toLowerCase().includes('crítico') || 
                    i.motivo?.toLowerCase().includes('grave')
                  ).length}
                </p>
                <p className="text-sm text-gray-600">Estado Crítico</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {internamentos.filter(i => 
                    !i.motivo?.toLowerCase().includes('crítico') && 
                    !i.motivo?.toLowerCase().includes('grave')
                  ).length}
                </p>
                <p className="text-sm text-gray-600">Estáveis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {internamentos.length > 0 
                    ? Math.round(internamentos.reduce((acc, curr) => acc + calcularDiasInternado(curr.data_entrada), 0) / internamentos.length)
                    : 0
                  }
                </p>
                <p className="text-sm text-gray-600">Dias Médios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Internamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Internados</CardTitle>
          <CardDescription>Monitoramento em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          {internamentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum paciente internado no momento</p>
              <p className="text-sm mt-2">
                Clique em "Novo Internamento" para internar um paciente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {internamentos.map((internamento) => {
                const sinaisRecentes = getSinaisVitaisRecentes(internamento.id);
                const diasInternado = calcularDiasInternado(internamento.data_entrada);
                
                return (
                  <div key={internamento.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {internamento.pet?.name || 'Pet não identificado'}
                          </h3>
                          <Badge className={`${getStatusColor(internamento.status)} text-white`}>
                            {internamento.status}
                          </Badge>
                          <Badge variant="outline">
                            {diasInternado} dia{diasInternado !== 1 ? 's' : ''} internado
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Tutor:</strong> {internamento.pet?.tutor?.nome || 'Não informado'}</p>
                          <p><strong>Espécie:</strong> {internamento.pet?.especie || 'Não informado'}</p>
                          <p><strong>Motivo:</strong> {internamento.motivo}</p>
                          <p><strong>Entrada:</strong> {new Date(internamento.data_entrada).toLocaleString('pt-BR')}</p>
                          {internamento.observacoes && (
                            <p><strong>Observações:</strong> {internamento.observacoes}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <Button variant="outline" size="sm" className="mb-2">
                          Ver Prontuário
                        </Button>
                      </div>
                    </div>

                    {/* Sinais Vitais */}
                    {sinaisRecentes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Últimos Sinais Vitais
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {sinaisRecentes.temperatura && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-red-500" />
                              <span>{sinaisRecentes.temperatura}°C</span>
                            </div>
                          )}
                          {sinaisRecentes.frequencia_cardiaca && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span>{sinaisRecentes.frequencia_cardiaca} bpm</span>
                            </div>
                          )}
                          {sinaisRecentes.frequencia_respiratoria && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-blue-500" />
                              <span>{sinaisRecentes.frequencia_respiratoria} rpm</span>
                            </div>
                          )}
                          {sinaisRecentes.pressao_arterial && (
                            <div className="flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-purple-500" />
                              <span>{sinaisRecentes.pressao_arterial}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Registrado em: {new Date(sinaisRecentes.data_aferimento).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <NovoInternamentoModal
        open={showNovoModal}
        onOpenChange={setShowNovoModal}
        onSuccess={() => {
          loadData();
          toast({
            title: "Paciente internado!",
            description: "O internamento foi registrado com sucesso.",
          });
        }}
      />
    </div>
  );
};

export default InternamentoAvancado;

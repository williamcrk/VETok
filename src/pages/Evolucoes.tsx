import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, Pill, Plus, Clock } from 'lucide-react';
import NovaEvolucaoModal from '@/components/evolucoes/NovaEvolucaoModal';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import GraficosSinaisVitais from '@/components/evolucoes/GraficosSinaisVitais';

const Evolucoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internacoesAtivas, setInternacoesAtivas] = useState<any[]>([]);
  const [selectedInternacao, setSelectedInternacao] = useState<any | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInternacoesAtivas();
  }, []);

  useEffect(() => {
    if (selectedInternacao) {
      fetchTimelineData(selectedInternacao.id);
    } else {
      setTimelineEvents([]);
    }
  }, [selectedInternacao]);

  const fetchInternacoesAtivas = async () => {
    const { data, error } = await supabase
      .from('internacoes')
      .select('id, pet_id, data_entrada, pets(name)')
      .eq('status', 'ativa')
      .order('data_entrada', { ascending: false });
    if (data) setInternacoesAtivas(data);
    if (error) console.error("Erro ao buscar internações ativas:", error);
  };

  const fetchTimelineData = async (internacaoId: string) => {
    setLoading(true);
    const { data: evolucoesData, error: evolucoesError } = await supabase
      .from('evolucoes')
      .select('*, veterinarios(nome)')
      .eq('internacao_id', internacaoId);

    const { data: aplicacoesData, error: aplicacoesError } = await supabase
      .from('aplicacoes_medicacao')
      .select('*, veterinarios(nome), prescricoes_internacao(produtos(nome))')
      .eq('internacao_id', internacaoId);

    if (evolucoesError || aplicacoesError) {
      console.error("Erro ao buscar dados da timeline:", evolucoesError || aplicacoesError);
      setTimelineEvents([]);
      setLoading(false);
      return;
    }

    const evolucoes = evolucoesData.map(e => ({ ...e, type: 'evolucao', timestamp: e.data_evolucao }));
    const aplicacoes = aplicacoesData.map(a => ({ ...a, type: 'aplicacao', timestamp: a.data_hora_aplicacao }));

    const combinedEvents = [...evolucoes, ...aplicacoes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setTimelineEvents(combinedEvents);
    setLoading(false);
  };

  const formatDate = (dateString: string) => format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const renderTimelineItem = (event: any) => {
    const isEvolucao = event.type === 'evolucao';
    const Icon = isEvolucao ? ClipboardList : Pill;
    const bgColor = isEvolucao ? 'bg-blue-100' : 'bg-green-100';
    const borderColor = isEvolucao ? 'border-blue-500' : 'border-green-500';

    return (
      <div key={event.id} className="relative pl-8 py-4">
        <div className={`absolute left-0 top-4 h-full border-l-2 ${borderColor}`}></div>
        <div className={`absolute left-[-10px] top-4 w-5 h-5 rounded-full ${isEvolucao ? 'bg-blue-500' : 'bg-green-500'} border-2 border-background`}></div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-5 h-5 ${isEvolucao ? 'text-blue-600' : 'text-green-600'}`} />
          <h3 className="font-bold text-lg">{isEvolucao ? 'Evolução Clínica' : 'Medicação Aplicada'}</h3>
        </div>
        <p className="text-xs text-gray-500 ml-7 mb-2">{formatDate(event.timestamp)} por {event.veterinarios?.nome || 'N/A'}</p>
        
        <div className={`p-4 rounded-lg border ${bgColor}`}>
          {isEvolucao ? (
            <div className='space-y-2'>
              <p>{event.evolucao}</p>
              {event.observacoes && <p className="text-sm italic"><strong>Observações:</strong> {event.observacoes}</p>}
              <div className="flex gap-4 text-xs pt-2">
                <span><strong>Peso:</strong> {event.peso_atual || 'N/R'} kg</span>
                <span><strong>Temp:</strong> {event.temperatura || 'N/R'} °C</span>
                <span><strong>FC:</strong> {event.frequencia_cardiaca || 'N/R'} bpm</span>
                <span><strong>FR:</strong> {event.frequencia_respiratoria || 'N/R'} rpm</span>
              </div>
            </div>
          ) : (
            <p><strong>{event.prescricoes_internacao?.produtos?.nome || 'Produto não encontrado'}</strong> aplicado conforme prescrição.</p>
          )}
        </div>
      </div>
    );
  };

  const handleSelectInternacao = (internacaoId: string) => {
    const internacao = internacoesAtivas.find(i => i.id === internacaoId);
    setSelectedInternacao(internacao);
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Linha do Tempo do Paciente</h1>
          <p className="text-gray-600">Acompanhe de forma unificada as evoluções e medicações.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={!selectedInternacao}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Evolução
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Label>Selecione um Paciente Internado</Label>
          <Select onValueChange={handleSelectInternacao} value={selectedInternacao?.id || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {internacoesAtivas.map(i => (
                <SelectItem key={i.id} value={i.id}>
                  {i.pets.name} (Entrada: {format(parseISO(i.data_entrada), 'dd/MM/yyyy')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {timelineEvents.length > 0 && (
        <div className="mb-6">
          <GraficosSinaisVitais evolucoes={timelineEvents.filter(e => e.type === 'evolucao')} />
        </div>
      )}

      <div>
        {loading && <p>Carregando linha do tempo...</p>}
        {!loading && timelineEvents.length > 0 && (
          <div>{timelineEvents.map(renderTimelineItem)}</div>
        )}
        {!loading && timelineEvents.length === 0 && selectedInternacao && (
          <p className='text-center py-8 text-gray-500'>Nenhum evento encontrado para este paciente.</p>
        )}
         {!loading && !selectedInternacao && (
          <p className='text-center py-8 text-gray-500'>Selecione um paciente para ver sua linha do tempo.</p>
        )}
      </div>

      <NovaEvolucaoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => fetchTimelineData(selectedInternacao!.id)}
        internacaoId={selectedInternacao?.id}
        petId={selectedInternacao?.pet_id}
      />
    </PageLayout>
  );
};

export default Evolucoes;

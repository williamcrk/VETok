import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Dog, Calendar, Stethoscope, PlusCircle, Pill, Clock, History } from 'lucide-react';
import NovaPrescricaoModal from '@/components/internamento/NovaPrescricaoModal';
import { useToast } from '@/hooks/use-toast';
import { addHours, formatDistanceToNow, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DarAltaModal from '@/components/internamento/DarAltaModal';

interface Prescricao {
  id: string;
  produto_id: string;
  produtos: { nome: string; preco_venda: number; };
  dose: string;
  frequencia_horas: number;
  instrucoes: string | null;
  aplicacoes_medicacao: {
    id: string;
    data_hora_aplicacao: string;
    veterinarios: {
      nome: string;
    }
  }[];
}

const DetalhesInternacao = () => {
  const { id } = useParams<{ id: string }>();
  const [internacao, setInternacao] = useState<any>(null);
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPrescricaoOpen, setModalPrescricaoOpen] = useState(false);
  const { toast } = useToast();
  const [isDarAltaModalOpen, setIsDarAltaModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTudo();
    }
  }, [id]);

  const fetchTudo = async () => {
    setLoading(true);
    setInternacao(null);
    setPrescricoes([]);

    if (!id) {
      setLoading(false);
      return;
    }

    // Passo 1: Buscar os dados da internação, incluindo o pet e o tutor.
    const { data: internacaoData, error: internacaoError } = await supabase
      .from('internacoes')
      .select('*, pets(*, tutores(nome)), veterinarios(nome)')
      .eq('id', id)
      .single();

    if (internacaoError || !internacaoData) {
      console.error('Erro ao buscar internação:', internacaoError);
      toast({ title: "Erro", description: "Não foi possível carregar os dados da internação.", variant: "destructive" });
      setLoading(false);
      return;
    }
    setInternacao(internacaoData);

    // Passo 2: Buscar as prescrições e todos os seus dados aninhados.
    const { data: prescricoesData, error: prescricoesError } = await supabase
      .from('prescricoes_internacao')
      .select('*, produtos(nome, preco_venda), aplicacoes_medicacao(*, veterinarios(nome))')
      .eq('internacao_id', id)
      .order('created_at', { referencedTable: 'prescricoes_internacao', ascending: true })
      .order('data_hora_aplicacao', { referencedTable: 'aplicacoes_medicacao', ascending: false });
      
    if (prescricoesError) {
      console.error('Erro ao buscar prescrições:', prescricoesError);
      toast({ title: "Erro", description: "Não foi possível carregar as prescrições.", variant: "destructive" });
    } else {
      setPrescricoes(prescricoesData || []);
    }

    setLoading(false);
  };

  const handleAplicarMedicamento = async (prescricao: Prescricao) => {
    try {
      const { data: vetData, error: vetError } = await supabase.from('veterinarios').select('id').limit(1).single();
      if (vetError || !vetData) throw new Error("Nenhum veterinário encontrado para registrar a aplicação.");

      const { error: aplicacaoError } = await supabase.from('aplicacoes_medicacao').insert({
        prescricao_id: prescricao.id,
        internacao_id: id,
        profissional_id: vetData.id,
      });
      if (aplicacaoError) throw aplicacaoError;

      const itensParaBaixar = [{ produto_id: prescricao.produto_id, quantidade: 1 }];
      const { error: baixaError } = await supabase.rpc('baixar_estoque', { itens: itensParaBaixar });
      if (baixaError) {
        console.error("Aplicação registrada, mas houve erro na baixa de estoque:", baixaError.message);
      }

      const { error: financeiroError } = await supabase.from('financeiro').insert({
        descricao: `Aplicação de ${prescricao.produtos.nome}`,
        valor: prescricao.produtos.preco_venda,
        tipo: 'receita',
        pet_id: internacao.pet_id,
        status: 'pendente',
      });
      if (financeiroError) console.error("Erro ao lançar no financeiro:", financeiroError.message);

      toast({ title: "Sucesso!", description: `${prescricao.produtos.nome} aplicado.` });
      fetchTudo();

    } catch (error: any) {
      toast({ title: "Erro na aplicação", description: error.message, variant: "destructive" });
    }
  };
  
  const getProximaDoseStatus = (prescricao: Prescricao) => {
    const { frequencia_horas, aplicacoes_medicacao } = prescricao;
    const agora = new Date();
    
    if (aplicacoes_medicacao.length === 0) {
      return { text: 'Aplicar 1ª dose', color: 'text-blue-600 font-bold', proximaDose: agora, atrasada: true };
    }
    
    // As aplicações já vêm ordenadas da query
    const ultimaAplicacao = aplicacoes_medicacao[0];
    const dataUltimaAplicacao = parseISO(ultimaAplicacao.data_hora_aplicacao);
    const proximaDose = addHours(dataUltimaAplicacao, frequencia_horas);
    
    if (agora > proximaDose) {
      const tempoAtraso = formatDistanceToNow(proximaDose, { locale: ptBR });
      return { text: `Dose Atrasada (${tempoAtraso})`, color: 'text-red-600 font-bold', proximaDose, atrasada: true };
    }
    
    const tempoParaProxima = formatDistanceToNow(proximaDose, { locale: ptBR });
    return { text: `Próxima em ${tempoParaProxima}`, color: 'text-green-600', proximaDose, atrasada: false };
  };

  const handleDarAltaSuccess = () => {
    toast({
      title: "Alta Realizada com Sucesso!",
      description: "A internação foi movida para o histórico.",
    });
    setIsDarAltaModalOpen(false);
    fetchTudo();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não registrada';
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  if (loading) {
    return <PageLayout><p>Carregando...</p></PageLayout>;
  }

  if (!internacao) {
    return <PageLayout><p>Internação não encontrada.</p></PageLayout>;
  }

  return (
    <PageLayout>
      <Link to="/internamento" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        Voltar para o Painel de Internamento
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <Dog className="w-6 h-6 text-gray-700" />
              <span>{internacao.pets.name}</span>
              <span className="text-sm font-normal text-gray-500">/ Tutor: {internacao.pets.tutores.nome}</span>
            </CardTitle>
            {internacao.status === 'ativa' && (
              <Button onClick={() => setIsDarAltaModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                Dar Alta
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Agenda de Medicamentos</h2>
        <Button onClick={() => setModalPrescricaoOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Prescrição
        </Button>
      </div>

      <div className="space-y-4">
        {prescricoes.length > 0 ? prescricoes.map((p) => {
          const statusDose = getProximaDoseStatus(p);
          return (
            <Card key={p.id} className="overflow-hidden">
              <div className={`p-4 border-l-4 ${statusDose.atrasada ? 'border-red-500' : 'border-green-500'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{p.produtos.nome}</h3>
                    <p className="text-sm text-gray-600">Dose: {p.dose} • Frequência: a cada {p.frequencia_horas} horas</p>
                    {p.instrucoes && <p className="text-xs italic mt-1">Instruções: {p.instrucoes}</p>}
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-2">
                     <div className={`text-sm font-semibold ${statusDose.color} flex items-center gap-2`}>
                        <Clock className="w-4 h-4" />
                        {statusDose.text}
                     </div>
                     <Button onClick={() => handleAplicarMedicamento(p)} size="sm">Aplicar Dose</Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="historico">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <History className="w-4 h-4" />
                          Ver Histórico ({p.aplicacoes_medicacao.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {p.aplicacoes_medicacao.length > 0 ? (
                          <ul className="space-y-2 pt-2">
                            {p.aplicacoes_medicacao.map(app => (
                              <li key={app.id} className="text-sm text-gray-700 flex justify-between items-center">
                                <span>Aplicado em: {format(parseISO(app.data_hora_aplicacao), "dd/MM/yy 'às' HH:mm")}</span>
                                <span className="font-medium">por: {app.veterinarios?.nome || 'N/A'}</span>
                              </li>
                            ))}
                          </ul>
                        ) : <p className="text-sm text-gray-500 pt-2">Nenhuma aplicação registrada.</p>}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Card>
          )
        }) : <p className="text-center text-gray-500 py-8">Nenhuma prescrição adicionada para esta internação.</p>}
      </div>

      <NovaPrescricaoModal open={modalPrescricaoOpen} onOpenChange={setModalPrescricaoOpen} internacaoId={id!} onSuccess={fetchTudo} />
      <DarAltaModal isOpen={isDarAltaModalOpen} onOpenChange={setIsDarAltaModalOpen} internacaoId={id!} onSuccess={handleDarAltaSuccess} />
    </PageLayout>
  );
};

export default DetalhesInternacao; 
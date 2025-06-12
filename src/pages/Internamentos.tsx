import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Hospital, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import NovaInternacaoModal from '@/components/internamento/NovaInternacaoModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "@/components/ui/use-toast";

// Renomeando o componente para Internamentos (plural)
const Internamentos = () => {
  const navigate = useNavigate();
  const [internacoes, setInternacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInternacoes();
  }, []);

  const fetchInternacoes = async () => {
    setLoading(true);
    
    // 1. Buscar apenas os dados brutos das internações
    const { data: internacoesData, error: internacoesError } = await supabase
      .from('internacoes')
      .select('*')
      .order('data_entrada', { ascending: false });

    if (internacoesError) {
      console.error('Erro ao buscar internações (Passo 1):', internacoesError);
      toast({ title: "Erro de Conexão", description: "Não foi possível buscar os dados de internação.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // 2. Para cada internação, buscar os dados relacionados (pet, tutor, vet)
    const enrichedData = await Promise.all(
      internacoesData.map(async (internacao) => {
        const { data: petData, error: petError } = await supabase
          .from('pets')
          .select('name, tutores (nome)')
          .eq('id', internacao.pet_id)
          .single();

        const { data: vetData, error: vetError } = internacao.veterinario_id
          ? await supabase.from('veterinarios').select('nome').eq('id', internacao.veterinario_id).single()
          : { data: null, error: null };
        
        return {
          ...internacao,
          pets: petData || { name: 'Pet não encontrado', tutores: { nome: 'Tutor não encontrado' } },
          veterinarios: vetData || { nome: 'Não definido' },
        };
      })
    );

    setInternacoes(enrichedData);
    setLoading(false);
  };

  // Filtering logic
  const ativas = internacoes.filter(i => i.status === 'ativa');
  const concluidas = internacoes.filter(i => i.status === 'concluida');

  const filterList = (list: any[]) => list.filter(i =>
    (i.pets?.name && i.pets.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.pets?.tutores?.nome && i.pets.tutores.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAtivas = filterList(ativas);
  const filteredConcluidas = filterList(concluidas);

  const handleVerDetalhes = (id: string) => {
    navigate(`/internamento/${id}`); // A rota de detalhes continua no singular
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <Hospital className="w-8 h-8 text-blue-600" />
            <div>
                <h1 className="text-3xl font-bold">Painel de Internamento</h1>
                <p className="text-gray-600">Monitore todos os pacientes internados em tempo real.</p>
            </div>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Internação
        </Button>
      </div>

      <Tabs defaultValue="ativas" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="ativas">Ativas ({ativas.length})</TabsTrigger>
            <TabsTrigger value="concluidas">Histórico ({concluidas.length})</TabsTrigger>
          </TabsList>
          <div className="w-full max-w-sm">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                    placeholder="Buscar por nome do pet ou tutor..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </div>

        <TabsContent value="ativas">
          {loading ? <p>Carregando...</p> : (
            filteredAtivas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAtivas.map(renderInternacaoCard)}
              </div>
            ) : <p className="text-center text-gray-500 py-8">Nenhum paciente internado no momento.</p>
          )}
        </TabsContent>
        <TabsContent value="concluidas">
          {loading ? <p>Carregando...</p> : (
            filteredConcluidas.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConcluidas.map(renderInternacaoCard)}
              </div>
            ) : <p className="text-center text-gray-500 py-8">Nenhum registro de alta encontrado.</p>
          )}
        </TabsContent>
      </Tabs>

      <NovaInternacaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchInternacoes}
      />
    </PageLayout>
  );

  // Helper function to render cards to avoid repetition
  function renderInternacaoCard(internacao: any) {
    const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      try {
        const date = parseISO(dateString);
        return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
      } catch (error) {
        console.error("Erro ao formatar data:", dateString, error);
        return "Data inválida";
      }
    };

    return (
      <Card key={internacao.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{internacao.pets?.name}</span>
            <span className={`capitalize text-xs font-medium px-2 py-1 rounded-full ${internacao.status === 'ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {internacao.status}
            </span>
          </CardTitle>
          <p className="text-sm text-gray-500">Tutor: {internacao.pets?.tutores?.nome || 'Não encontrado'}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-1">
          <p className="text-sm"><strong>Entrada:</strong> {formatDate(internacao.data_entrada)}</p>
          {internacao.status === 'concluida' && (
            <p className="text-sm"><strong>Alta:</strong> {formatDate(internacao.data_alta)}</p>
          )}
          <p className="text-sm"><strong>Motivo:</strong> {internacao.motivo}</p>
          <p className="text-sm"><strong>Vet. Resp.:</strong> {internacao.veterinarios?.nome || 'Não definido'}</p>
        </CardContent>
        <div className="p-4 border-t">
          <Button className="w-full" onClick={() => handleVerDetalhes(internacao.id)}>
            Ver Detalhes
          </Button>
        </div>
      </Card>
    );
  }
};

export default Internamentos; // Exportando o componente com o nome correto

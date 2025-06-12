import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NovoProntuarioModal from '@/components/prontuarios/NovoProntuarioModal';
import DetalhesProntuarioModal from '@/components/prontuarios/DetalhesProntuarioModal';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Plus, Calendar, User, Stethoscope, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Prontuario {
  id: string;
  data_hora: string;
  pet_id: string;
  veterinario_id: string;
  diagnostico: string | null;
  tratamento: string | null;
  anamnese: string | null;
  observacoes: string | null;
  conteudo?: string | null;
  status: string;
  pets?: {
    name: string;
    especie: string;
    raca: string;
    tutores?: {
      nome: string;
      telefone: string;
    };
  };
  veterinarios?: {
    nome: string;
    crmv: string;
  };
}

const Prontuarios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoProntuarioModalOpen, setNovoProntuarioModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [prontuarioSelecionado, setProntuarioSelecionado] = useState<Prontuario | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [especieFilter, setEspecieFilter] = useState('all');

  useEffect(() => {
    fetchProntuarios();
  }, []);

  const fetchProntuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('atendimentos')
        .select(`
          id,
          data_hora,
          pet_id,
          veterinario_id,
          diagnostico,
          tratamento,
          anamnese,
          observacoes,
          conteudo,
          status,
          pets (
            name,
            especie,
            raca,
            tutores (
              nome,
              telefone
            )
          ),
          veterinarios (
            nome,
            crmv
          )
        `)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      setProntuarios(data || []);
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prontuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProntuarios = prontuarios.filter(prontuario => {
    const matchesSearch = 
      prontuario.pets?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.pets?.tutores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.veterinarios?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prontuario.status === statusFilter;
    const matchesEspecie = especieFilter === 'all' || prontuario.pets?.especie === especieFilter;
    
    return matchesSearch && matchesStatus && matchesEspecie;
  });

  const getStatusStats = () => {
    const concluidos = prontuarios.filter(p => p.status === 'concluido').length;
    const emAndamento = prontuarios.filter(p => p.status === 'em_andamento').length;
    const pendentes = prontuarios.filter(p => p.status === 'pendente').length;
    
    return { concluidos, emAndamento, pendentes };
  };

  const stats = getStatusStats();

  const handleVerDetalhes = (prontuario: Prontuario) => {
    setProntuarioSelecionado(prontuario);
    setDetalhesModalOpen(true);
  };

  if (loading) {
    return (
      <PageLayout title="Prontuários">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando prontuários...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Prontuários">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h2 className="text-base md:text-lg font-semibold">Gestão de Prontuários</h2>
            <p className="text-sm text-gray-600">Histórico médico e atendimentos</p>
          </div>
          <Button onClick={() => setNovoProntuarioModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Novo Prontuário</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />
                <div>
                  <p className="text-lg md:text-2xl font-bold">{prontuarios.length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-lg md:text-2xl font-bold">{stats.concluidos}</p>
                  <p className="text-xs md:text-sm text-gray-600">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-lg md:text-2xl font-bold">{stats.emAndamento}</p>
                  <p className="text-xs md:text-sm text-gray-600">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-lg md:text-2xl font-bold">{stats.pendentes}</p>
                  <p className="text-xs md:text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col space-y-3 md:space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                <div>
                  <CardTitle className="text-base md:text-lg">Lista de Prontuários</CardTitle>
                  <CardDescription className="text-sm">Histórico de atendimentos</CardDescription>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar paciente, tutor, diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={especieFilter} onValueChange={setEspecieFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Espécie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Cão">Cão</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Ave">Ave</SelectItem>
                      <SelectItem value="Roedor">Roedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            {filteredProntuarios.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  {prontuarios.length === 0 ? 'Nenhum prontuário encontrado' : 'Nenhum prontuário corresponde aos filtros'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {prontuarios.length === 0 
                    ? 'Comece criando o primeiro prontuário de atendimento'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredProntuarios.map((prontuario) => (
                  <Card 
                    key={prontuario.id}
                    className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleVerDetalhes(prontuario)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {prontuario.pets?.especie === 'Cão' ? '🐕' : 
                             prontuario.pets?.especie === 'Gato' ? '🐱' : '🐾'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-base">{prontuario.pets?.name}</h3>
                            <p className="text-sm text-gray-600">{prontuario.pets?.raca}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(prontuario.status)}`}>
                          {prontuario.status === 'concluido' ? 'Concluído' :
                           prontuario.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(prontuario.data_hora).toLocaleDateString('pt-BR')}</span>
                          <span>{new Date(prontuario.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-3 h-3" />
                          <span className="truncate">{prontuario.pets?.tutores?.nome}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Stethoscope className="w-3 h-3" />
                          <span className="truncate">{prontuario.veterinarios?.nome}</span>
                        </div>
                        
                        {prontuario.diagnostico && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <strong>Diagnóstico:</strong> {prontuario.diagnostico.substring(0, 100)}
                            {prontuario.diagnostico.length > 100 && '...'}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="mt-4 pt-3 border-t flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); handleVerDetalhes(prontuario); }}>
                          Ver Completo
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); /* lógica de edição futura */ }}>
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <NovoProntuarioModal 
          open={novoProntuarioModalOpen} 
          onOpenChange={setNovoProntuarioModalOpen}
          onSuccess={fetchProntuarios}
        />
        <DetalhesProntuarioModal
            prontuario={prontuarioSelecionado}
            open={detalhesModalOpen}
            onOpenChange={setDetalhesModalOpen}
        />
      </div>
    </PageLayout>
  );
};

export default Prontuarios;

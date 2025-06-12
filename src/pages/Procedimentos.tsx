import React, { useState, useEffect, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Filter, Clock, Scissors, Stethoscope, 
  FileText, Activity, Calendar, DollarSign, AlertCircle,
  CheckCircle, XCircle, Timer, Loader2, Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Tipos alinhados com o Supabase
interface Procedimento {
  id: string;
  nome: string;
  categoria: 'cirurgia' | 'consulta' | 'exame' | 'tratamento' | 'emergencia';
  pet_id: string;
  tutor_id: string;
  veterinario_id: string;
  data_hora: string;
  duracao: number; // em minutos
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'adiado';
  valor: number;
  observacoes: string | null;
  // Relacionamentos que virão do Supabase
  pets?: { nome: string };
  tutores?: { nome: string, id: string };
  veterinarios?: { nome: string };
  procedimento_itens?: ProcedimentoItem[];
}

interface ProcedimentoItem {
    id?: string;
    procedimento_id: string;
    produto_id: string;
    quantidade: number;
    valor_cobrado: number;
    produtos?: { // Relação com a tabela produtos
        nome: string;
    }
}

interface Pet {
  id: string;
  name: string;
  tutor_id: string;
  tutores: {
    id: string;
    nome: string;
  }
}

interface Veterinario {
  id: string;
  nome: string;
}

interface Produto {
    id: string;
    nome: string;
    preco_venda: number;
    estoque_atual: number;
}

const Procedimentos = () => {
  const { toast } = useToast();
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [novoProcedimento, setNovoProcedimento] = useState<Partial<Procedimento>>({ procedimento_itens: [] });
  const [itemAtual, setItemAtual] = useState<{ produto_id: string; quantidade: number | string }>({ produto_id: '', quantidade: 1 });
  
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<Procedimento | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: procsData, error: procsError } = await supabase
        .from('procedimentos')
        .select(`*, pets(nome), tutores(id, nome), veterinarios(nome), procedimento_itens(*, produtos(nome))`)
        .order('data_hora', { ascending: false });

      if (procsError) throw procsError;
      setProcedimentos(procsData || []);

      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select(`id, name, tutor_id, tutores(id, nome)`);

      if (petsError) throw petsError;
      setPets(petsData || []);
      
      const { data: vetsData, error: vetsError } = await supabase
        .from('veterinarios')
        .select(`id, nome`);
      
      if (vetsError) throw vetsError;
      setVeterinarios(vetsData || []);

      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('id, nome, preco_venda, estoque_atual');
      
      if(produtosError) throw produtosError;
      setProdutos(produtosData || []);

    } catch (error: any) {
      toast({ title: "Erro ao carregar dados", description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const procedimentosFiltrados = procedimentos.filter(proc => {
    const searchLower = busca.toLowerCase();
    const matchBusca = proc.nome.toLowerCase().includes(searchLower) ||
                      proc.pets?.nome.toLowerCase().includes(searchLower) ||
                      proc.tutores?.nome.toLowerCase().includes(searchLower);
    const matchCategoria = filtroCategoria === 'todos' || proc.categoria === filtroCategoria;
    const matchStatus = filtroStatus === 'todos' || proc.status === filtroStatus;
    return matchBusca && matchCategoria && matchStatus;
  });

  const handleAddItem = () => {
    if (!itemAtual.produto_id || !itemAtual.quantidade || +itemAtual.quantidade <= 0) {
        toast({ title: "Item inválido", description: "Selecione um produto e uma quantidade válida.", variant: "destructive"});
        return;
    }
    const produtoSelecionado = produtos.find(p => p.id === itemAtual.produto_id);
    if (!produtoSelecionado) return;

    const novoItem: ProcedimentoItem = {
        procedimento_id: '', // será preenchido ao salvar
        produto_id: produtoSelecionado.id,
        quantidade: +itemAtual.quantidade,
        valor_cobrado: produtoSelecionado.preco_venda * +itemAtual.quantidade,
        produtos: { nome: produtoSelecionado.nome }
    };
    
    const itensAtuais = novoProcedimento.procedimento_itens || [];
    setNovoProcedimento({...novoProcedimento, procedimento_itens: [...itensAtuais, novoItem] });
    setItemAtual({ produto_id: '', quantidade: 1 }); // reseta o form de item
  }

  const handleRemoveItem = (index: number) => {
    const itensAtuais = novoProcedimento.procedimento_itens || [];
    const novosItens = [...itensAtuais];
    novosItens.splice(index, 1);
    setNovoProcedimento({ ...novoProcedimento, procedimento_itens: novosItens });
  }

  const criarProcedimento = async () => {
    if (!novoProcedimento.nome || !novoProcedimento.pet_id || !novoProcedimento.veterinario_id || !novoProcedimento.data_hora) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, paciente, veterinário e data/hora.", variant: "destructive"});
      return;
    }

    const selectedPet = pets.find(p => p.id === novoProcedimento.pet_id);
    if (!selectedPet) {
        toast({ title: "Erro", description: "Pet selecionado não encontrado.", variant: "destructive"});
        return;
    }

    setSubmitting(true);
    try {
      const { data: procData, error: procError } = await supabase.from('procedimentos').insert([{
        ...novoProcedimento,
        tutor_id: selectedPet.tutor_id,
        status: 'agendado',
      }]).select().single();

      if (procError) throw procError;

      if (novoProcedimento.procedimento_itens && novoProcedimento.procedimento_itens.length > 0) {
          const itensParaSalvar = novoProcedimento.procedimento_itens.map(item => ({
              procedimento_id: procData.id,
              produto_id: item.produto_id,
              quantidade: item.quantidade,
              valor_cobrado: item.valor_cobrado,
          }));

          const { error: itensError } = await supabase.from('procedimento_itens').insert(itensParaSalvar);
          if (itensError) throw itensError;
      }
      
      toast({ title: "Sucesso", description: "Procedimento criado com sucesso." });
      setDialogAberto(false);
      setNovoProcedimento({ procedimento_itens: [] });
      loadData();
    } catch (error: any) {
      toast({ title: "Erro ao criar procedimento", description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };
  
  const atualizarStatusProcedimento = async (id: string, status: Procedimento['status']) => {
    try {
        const { error } = await supabase
            .from('procedimentos')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
        toast({ title: 'Status Atualizado!', description: `O procedimento foi marcado como ${status}.` });

        if (status === 'concluido') {
            const procedimentoConcluido = procedimentos.find(p => p.id === id);
            if (!procedimentoConcluido || !procedimentoConcluido.procedimento_itens) return;

            const updatesEstoque = procedimentoConcluido.procedimento_itens.map(item =>
                supabase.rpc('baixar_estoque', {
                    produto_id_param: item.produto_id,
                    quantidade_param: item.quantidade
                })
            );

            const totalItens = procedimentoConcluido.procedimento_itens.reduce((sum, item) => sum + item.valor_cobrado, 0);
            const valorTotalProcedimento = (procedimentoConcluido.valor || 0) + totalItens;
            
            const lancamentosPromises = [
              supabase.from('financeiro').insert([{
                tutor_id: procedimentoConcluido.tutor_id,
                valor_total: valorTotalProcedimento,
                status: 'pendente',
                forma_pagamento: 'a_definir',
              }]),
              supabase.from('evolucoes').insert(
                procedimentoConcluido.procedimento_itens.map(item => ({
                    pet_id: procedimentoConcluido.pet_id,
                    evolucao: `Item utilizado: ${item.produtos?.nome} (Qtd: ${item.quantidade})`,
                }))
              )
            ];

            await Promise.all([...updatesEstoque, ...lancamentosPromises]);
            toast({ title: 'Automação Concluída!', description: 'Estoque, financeiro e prontuário atualizados.' });
        }
        loadData();
    } catch (error: any) {
        toast({ title: 'Erro na automação', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'adiado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendado': return <Clock className="w-4 h-4" />;
      case 'em_andamento': return <Timer className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      case 'cancelado': return <XCircle className="w-4 h-4" />;
      case 'adiado': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'cirurgia': return <Scissors className="w-4 h-4" />;
      case 'consulta': return <Stethoscope className="w-4 h-4" />;
      case 'exame': return <FileText className="w-4 h-4" />;
      case 'tratamento': return <Activity className="w-4 h-4" />;
      case 'emergencia': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const estatisticas = {
    totalProcedimentos: procedimentos.length,
    agendados: procedimentos.filter(p => p.status === 'agendado').length,
    emAndamento: procedimentos.filter(p => p.status === 'em_andamento').length,
    concluidos: procedimentos.filter(p => p.status === 'concluido').length,
    receitaTotal: procedimentos.filter(p => p.status === 'concluido').reduce((acc, p) => acc + p.valor, 0)
  };

  if (loading) {
    return (
      <PageLayout title="Módulo de Procedimentos">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Carregando dados...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Módulo de Procedimentos">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{estatisticas.totalProcedimentos}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agendados</p>
                  <p className="text-2xl font-bold text-blue-600">{estatisticas.agendados}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.emAndamento}</p>
                </div>
                <Timer className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.concluidos}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita</p>
                  <p className="text-2xl font-bold text-green-600">R$ {estatisticas.receitaTotal.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Procedimentos</CardTitle>
            <CardDescription>Visualize e gerencie todos os procedimentos agendados e realizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por procedimento, paciente ou cliente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="tratamento">Tratamento</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="adiado">Adiado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Veterinário</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedimentosFiltrados.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoriaIcon(proc.categoria)}
                        <span className="font-medium">{proc.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{proc.pets?.nome}</TableCell>
                    <TableCell>{proc.veterinarios?.nome}</TableCell>
                    <TableCell>{new Date(proc.data_hora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(proc.status)}>{proc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select value={proc.status} onValueChange={(newStatus) => atualizarStatusProcedimento(proc.id, newStatus as any)}>
                          <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Mudar Status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="agendado">Agendado</SelectItem>
                              <SelectItem value="em_andamento">Em Andamento</SelectItem>
                              <SelectItem value="concluido">Concluído</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                              <SelectItem value="adiado">Adiado</SelectItem>
                          </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agendar Procedimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Agendar Novo Procedimento</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="geral">
                <TabsList>
                  <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
                  <TabsTrigger value="materiais">Materiais & Medicamentos</TabsTrigger>
                </TabsList>
                <TabsContent value="geral" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Procedimento</Label>
                      <Input
                        value={novoProcedimento.nome || ''}
                        onChange={(e) => setNovoProcedimento({...novoProcedimento, nome: e.target.value})}
                        placeholder="Ex: Consulta de retorno, Castração"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select onValueChange={(value) => setNovoProcedimento({...novoProcedimento, categoria: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cirurgia">Cirurgia</SelectItem>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="exame">Exame</SelectItem>
                          <SelectItem value="tratamento">Tratamento</SelectItem>
                          <SelectItem value="emergencia">Emergência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Paciente</Label>
                      <Select value={novoProcedimento.pet_id} onValueChange={(value) => setNovoProcedimento({...novoProcedimento, pet_id: value as any})}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione o paciente" />
                          </SelectTrigger>
                          <SelectContent>
                              {pets.map(pet => (
                                  <SelectItem key={pet.id} value={pet.id}>
                                      {pet.name} ({pet.tutores.nome})
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Veterinário Responsável</Label>
                      <Select value={novoProcedimento.veterinario_id} onValueChange={(value) => setNovoProcedimento({...novoProcedimento, veterinario_id: value as any})}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione o veterinário" />
                          </SelectTrigger>
                          <SelectContent>
                              {veterinarios.map(vet => (
                                  <SelectItem key={vet.id} value={vet.id}>
                                      {vet.nome}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data e Hora</Label>
                      <Input
                        type="datetime-local"
                        value={novoProcedimento.data_hora || ''}
                        onChange={(e) => setNovoProcedimento({...novoProcedimento, data_hora: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duração Estimada (minutos)</Label>
                      <Input
                        type="number"
                        value={novoProcedimento.duracao || ''}
                        onChange={(e) => setNovoProcedimento({...novoProcedimento, duracao: parseInt(e.target.value)})}
                        placeholder="Duração em minutos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={novoProcedimento.valor || ''}
                        onChange={(e) => setNovoProcedimento({...novoProcedimento, valor: parseFloat(e.target.value)})}
                        placeholder="Valor do procedimento"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Observações Iniciais</Label>
                       <Textarea
                        value={novoProcedimento.observacoes || ''}
                        onChange={(e) => setNovoProcedimento({...novoProcedimento, observacoes: e.target.value})}
                        placeholder="Informações importantes, preparo, etc."
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="materiais" className="pt-4 space-y-4">
                  <div>
                    <Label>Adicionar Item ao Procedimento</Label>
                    <div className="flex gap-2 mt-2">
                      <Select value={itemAtual.produto_id} onValueChange={(value) => setItemAtual({...itemAtual, produto_id: value})}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto do estoque..." />
                          </SelectTrigger>
                          <SelectContent>
                              {produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome} (Estoque: {p.estoque_atual})</SelectItem>)}
                          </SelectContent>
                      </Select>
                      <Input 
                          type="number" 
                          placeholder="Qtd." 
                          className="w-24" 
                          value={itemAtual.quantidade}
                          onChange={(e) => setItemAtual({...itemAtual, quantidade: e.target.value})}
                      />
                      <Button onClick={handleAddItem}>Adicionar</Button>
                    </div>
                  </div>
                  <div>
                      <h4 className="font-medium text-sm mb-2">Itens Adicionados</h4>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead>Qtd.</TableHead>
                                  <TableHead>Valor</TableHead>
                                  <TableHead></TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {(novoProcedimento.procedimento_itens || []).map((item, index) => (
                                  <TableRow key={index}>
                                      <TableCell>{item.produtos?.nome}</TableCell>
                                      <TableCell>{item.quantidade}</TableCell>
                                      <TableCell>R$ {item.valor_cobrado.toFixed(2)}</TableCell>
                                      <TableCell>
                                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                              <Trash2 className="w-4 h-4 text-red-500"/>
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={criarProcedimento} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {submitting ? 'Salvando...' : 'Salvar Procedimento'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default Procedimentos;

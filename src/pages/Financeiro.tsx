
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Plus, Search, Calendar, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FinanceiroItem {
  id: string;
  valor_total: number;
  status: string;
  forma_pagamento?: string;
  created_at: string;
  data_pagamento?: string;
  parcelas?: number;
  tutor_id?: string;
  atendimento_id?: string;
  tutores?: {
    nome: string;
  };
  atendimentos?: {
    pets: {
      name: string;
    };
  };
}

const Financeiro = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [periodoFilter, setPeriodoFilter] = useState('mes');
  const [financeiro, setFinanceiro] = useState<FinanceiroItem[]>([]);
  const [stats, setStats] = useState({
    receitaMensal: 0,
    despesasMensais: 0,
    lucroLiquido: 0,
    margemLucro: 0,
    contasReceber: 0,
    contasVencidas: 0
  });

  useEffect(() => {
    loadFinanceiro();
  }, [periodoFilter]);

  const loadFinanceiro = async () => {
    try {
      setLoading(true);
      
      // Calcular data baseada no período
      const hoje = new Date();
      let dataInicio: string;
      
      switch (periodoFilter) {
        case 'hoje':
          dataInicio = hoje.toISOString().split('T')[0];
          break;
        case 'semana':
          const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
          dataInicio = semanaAtras.toISOString().split('T')[0];
          break;
        case 'mes':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();
          break;
        case 'trimestre':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1).toISOString();
          break;
        default:
          dataInicio = new Date(hoje.getFullYear(), 0, 1).toISOString();
      }

      const { data, error } = await supabase
        .from('financeiro')
        .select(`
          *,
          tutores (nome),
          atendimentos (
            pets (name)
          )
        `)
        .gte('created_at', dataInicio)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFinanceiro(data || []);

      // Calcular estatísticas
      const receitas = data?.filter(item => item.status === 'pago') || [];
      const receitaTotal = receitas.reduce((sum, item) => sum + item.valor_total, 0);
      
      const pendentes = data?.filter(item => item.status === 'pendente') || [];
      const contasReceber = pendentes.reduce((sum, item) => sum + item.valor_total, 0);
      
      const vencidas = data?.filter(item => {
        if (item.status !== 'pendente') return false;
        const vencimento = new Date(item.created_at);
        vencimento.setDate(vencimento.getDate() + 30); // 30 dias para vencer
        return vencimento < hoje;
      }) || [];
      const contasVencidas = vencidas.reduce((sum, item) => sum + item.valor_total, 0);

      const despesasMensais = receitaTotal * 0.4; // Estimativa de 40% de despesas
      const lucroLiquido = receitaTotal - despesasMensais;
      const margemLucro = receitaTotal > 0 ? (lucroLiquido / receitaTotal) * 100 : 0;

      setStats({
        receitaMensal: receitaTotal,
        despesasMensais,
        lucroLiquido,
        margemLucro,
        contasReceber,
        contasVencidas
      });

    } catch (error) {
      console.error('Erro ao carregar financeiro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados financeiros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'parcial': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormaPagamentoColor = (forma?: string) => {
    switch (forma) {
      case 'dinheiro': return 'bg-green-100 text-green-800';
      case 'cartao': return 'bg-blue-100 text-blue-800';
      case 'pix': return 'bg-purple-100 text-purple-800';
      case 'transferencia': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFinanceiro = financeiro.filter(item => {
    const matchesSearch = item.tutores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.atendimentos?.pets?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <PageLayout title="Financeiro">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados financeiros...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Financeiro">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(stats.receitaMensal)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Despesas</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(stats.despesasMensais)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lucro Líquido</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.lucroLiquido)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Margem</p>
                  <p className="text-xl font-bold">{stats.margemLucro.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Contas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Contas a Receber</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.contasReceber)}</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Contas Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.contasVencidas)}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Recebido</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.receitaMensal)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Movimentação Financeira</CardTitle>
                <CardDescription>Gerencie cobranças e pagamentos</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Em desenvolvimento",
                      description: "Funcionalidade de relatório será implementada em breve.",
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Em desenvolvimento",
                      description: "Funcionalidade de nova cobrança será implementada em breve.",
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Cobrança
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, paciente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredFinanceiro.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma movimentação encontrada</p>
                  <p className="text-sm mt-2">
                    {searchTerm || statusFilter !== 'todos' ? 'Tente ajustar os filtros' : 'Não há movimentações no período'}
                  </p>
                </div>
              ) : (
                filteredFinanceiro.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">#{item.id.slice(0, 8)}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                            {item.forma_pagamento && (
                              <Badge className={getFormaPagamentoColor(item.forma_pagamento)}>
                                {item.forma_pagamento}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Cliente: <span className="font-medium">{item.tutores?.nome || 'Não informado'}</span></p>
                            <div className="flex gap-4 mt-1">
                              <span>Valor: {formatCurrency(item.valor_total)}</span>
                              <span>Data: {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                              {item.parcelas && item.parcelas > 1 && (
                                <span>Parcelas: {item.parcelas}x</span>
                              )}
                              {item.data_pagamento && (
                                <span>Pago em: {new Date(item.data_pagamento).toLocaleDateString('pt-BR')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Em desenvolvimento",
                              description: "Funcionalidade de detalhes será implementada em breve.",
                            });
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detalhes
                        </Button>
                        {item.status === 'pendente' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Em desenvolvimento",
                                description: "Funcionalidade de recebimento será implementada em breve.",
                              });
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Receber
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
    </PageLayout>
  );
};

export default Financeiro;

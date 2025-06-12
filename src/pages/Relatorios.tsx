
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, BarChart3, DollarSign, Users, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RelatorioConfig {
  tipo: string;
  periodo: string;
  dataInicial: string;
  dataFinal: string;
  veterinario: string;
  formato: string;
}

const Relatorios = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  const [stats, setStats] = useState({
    consultasHoje: 0,
    faturamentoMes: 0,
    pacientesAtivos: 0,
    consultasMes: 0
  });

  const [config, setConfig] = useState<RelatorioConfig>({
    tipo: '',
    periodo: '',
    dataInicial: '',
    dataFinal: '',
    veterinario: '',
    formato: 'pdf'
  });

  useEffect(() => {
    loadVeterinarios();
    loadStats();
  }, []);

  const loadVeterinarios = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name')
        .eq('role', 'veterinarian')
        .eq('is_active', true);

      if (error) throw error;
      setVeterinarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar veterinários:', error);
    }
  };

  const loadStats = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [appointmentsToday, appointmentsMonth, pets, financial] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact' }).gte('appointment_date', hoje),
        supabase.from('appointments').select('id', { count: 'exact' }).gte('created_at', mesAtual),
        supabase.from('pets').select('id', { count: 'exact' }),
        supabase.from('financeiro').select('valor_total').eq('status', 'pago').gte('created_at', mesAtual)
      ]);

      const faturamento = financial.data?.reduce((sum, item) => sum + (item.valor_total || 0), 0) || 0;

      setStats({
        consultasHoje: appointmentsToday.count || 0,
        consultasMes: appointmentsMonth.count || 0,
        pacientesAtivos: pets.count || 0,
        faturamentoMes: faturamento
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const gerarRelatorio = async () => {
    if (!config.tipo) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de relatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Relatório gerado!",
        description: `Relatório de ${config.tipo} foi gerado e está sendo baixado.`,
      });

      // Aqui você implementaria a lógica real de geração de relatório
      // Por exemplo, chamar uma edge function do Supabase
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const relatoriosDisponiveis = [
    {
      id: 'financeiro',
      titulo: 'Relatório Financeiro',
      descricao: 'Faturamento, receitas e despesas',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'atendimentos',
      titulo: 'Relatório de Atendimentos',
      descricao: 'Consultas realizadas por período',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 'pacientes',
      titulo: 'Relatório de Pacientes',
      descricao: 'Lista de pacientes e histórico',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'vacinacao',
      titulo: 'Controle de Vacinação',
      descricao: 'Status vacinal dos pacientes',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      id: 'estoque',
      titulo: 'Relatório de Estoque',
      descricao: 'Produtos em estoque e movimentação',
      icon: BarChart3,
      color: 'text-indigo-600'
    },
    {
      id: 'comissoes',
      titulo: 'Comissões de Veterinários',
      descricao: 'Cálculo de comissões por profissional',
      icon: TrendingUp,
      color: 'text-teal-600'
    }
  ];

  return (
    <PageLayout title="Relatórios">
      <div className="space-y-6">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultas Hoje</p>
                  <p className="text-2xl font-bold">{stats.consultasHoje}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultas/Mês</p>
                  <p className="text-2xl font-bold">{stats.consultasMes}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes Ativos</p>
                  <p className="text-2xl font-bold">{stats.pacientesAtivos}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faturamento/Mês</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.faturamentoMes)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relatórios Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Selecione o tipo de relatório que deseja gerar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatoriosDisponiveis.map((relatorio) => (
                <Button 
                  key={relatorio.id}
                  variant={config.tipo === relatorio.id ? "default" : "outline"}
                  className="justify-start h-auto p-4 w-full"
                  onClick={() => setConfig({...config, tipo: relatorio.id})}
                >
                  <relatorio.icon className={`w-5 h-5 mr-3 ${relatorio.color}`} />
                  <div className="text-left">
                    <h3 className="font-medium">{relatorio.titulo}</h3>
                    <p className="text-sm text-gray-600">{relatorio.descricao}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Configurações do Relatório */}
          <Card>
            <CardHeader>
              <CardTitle>Configurar Relatório</CardTitle>
              <CardDescription>Personalize os parâmetros do relatório</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Período</Label>
                <Select value={config.periodo} onValueChange={(value) => setConfig({...config, periodo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mês</SelectItem>
                    <SelectItem value="trimestre">Este trimestre</SelectItem>
                    <SelectItem value="ano">Este ano</SelectItem>
                    <SelectItem value="personalizado">Período personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {config.periodo === 'personalizado' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data Inicial</Label>
                    <Input 
                      type="date" 
                      value={config.dataInicial}
                      onChange={(e) => setConfig({...config, dataInicial: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Data Final</Label>
                    <Input 
                      type="date" 
                      value={config.dataFinal}
                      onChange={(e) => setConfig({...config, dataFinal: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label>Veterinário</Label>
                <Select value={config.veterinario} onValueChange={(value) => setConfig({...config, veterinario: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os veterinários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {veterinarios.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>{vet.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Formato</Label>
                <Select value={config.formato} onValueChange={(value) => setConfig({...config, formato: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={gerarRelatorio}
                disabled={loading || !config.tipo}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </div>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Relatorios;

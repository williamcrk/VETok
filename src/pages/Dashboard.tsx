import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/dashboard/KPICard';
import GraficoOcupacao from '@/components/dashboard/GraficoOcupacao';
import GraficoFaturamento from '@/components/dashboard/GraficoFaturamento';
import { Calendar, Heart, DollarSign, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, Activity, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalPacientes: number;
  consultasHoje: number;
  faturamentoMes: number;
  tutoresAtivos: number;
  consultasPendentes: number;
  internados: number;
  ocupacaoAtual: number;
  faturamentoDia: number;
}

interface ConsultaProxima {
  id: string;
  appointment_date: string;
  service_type: string;
  pets?: {
    name: string;
    especie: string;
  };
  tutores?: {
    nome: string;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    consultasHoje: 0,
    faturamentoMes: 0,
    tutoresAtivos: 0,
    consultasPendentes: 0,
    internados: 0,
    ocupacaoAtual: 0,
    faturamentoDia: 0
  });
  const [proximasConsultas, setProximasConsultas] = useState<ConsultaProxima[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas principais
      const [
        petsResult,
        appointmentsResult,
        financialResult,
        tutoresResult,
        pendingResult,
        internmentsResult
      ] = await Promise.all([
        supabase.from('pets').select('id', { count: 'exact' }),
        supabase.from('appointments').select('id', { count: 'exact' }).gte('appointment_date', new Date().toISOString().split('T')[0]),
        supabase.from('financeiro').select('valor_total').eq('status', 'pago').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('tutores').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'scheduled'),
        supabase.from('internamentos').select('id', { count: 'exact' }).eq('status', 'Internado')
      ]);

      // Buscar próximas consultas
      const { data: proximasData } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          service_type,
          pets!appointments_pet_id_fkey (name, especie),
          tutores (nome)
        `)
        .eq('status', 'scheduled')
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date')
        .limit(5);

      // Calcular faturamento do mês
      const faturamentoTotal = financialResult.data?.reduce((sum, item) => sum + (item.valor_total || 0), 0) || 0;
      
      // Simular dados dinâmicos
      const ocupacaoAtual = 75 + Math.floor(Math.random() * 20); // Simula variação de 75-95%
      const faturamentoDia = 800 + Math.floor(Math.random() * 1200); // Simula R$ 800-2000

      setStats({
        totalPacientes: petsResult.count || 0,
        consultasHoje: appointmentsResult.count || 0,
        faturamentoMes: faturamentoTotal,
        tutoresAtivos: tutoresResult.count || 0,
        consultasPendentes: pendingResult.count || 0,
        internados: internmentsResult.count || 0,
        ocupacaoAtual,
        faturamentoDia
      });

      setProximasConsultas(proximasData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'Emergência':
        return 'bg-red-100 text-red-800';
      case 'Cirurgia':
        return 'bg-purple-100 text-purple-800';
      case 'Vacinação':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard">
      <div className="space-y-4 md:space-y-6">
        {/* Saudação */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">{getGreeting()}! 👋</h2>
          <p className="text-sm md:text-base text-blue-100">
            Hoje você tem {stats.consultasHoje} consultas agendadas e {stats.internados} pacientes internados.
            Taxa de ocupação atual: {stats.ocupacaoAtual}%
          </p>
        </div>

        {/* KPIs Dinâmicos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3 md:gap-4">
          <KPICard
            title="Pacientes"
            value={stats.totalPacientes}
            icon={Heart}
            color="text-red-500"
            trend={{ value: 5.2, isPositive: true }}
          />
          
          <KPICard
            title="Consultas Hoje"
            value={stats.consultasHoje}
            icon={Calendar}
            color="text-blue-500"
            trend={{ value: 12.5, isPositive: true }}
          />
          
          <KPICard
            title="Faturamento Dia"
            value={formatCurrency(stats.faturamentoDia)}
            icon={DollarSign}
            color="text-green-500"
            trend={{ value: 8.3, isPositive: true }}
          />
          
          <KPICard
            title="Tutores"
            value={stats.tutoresAtivos}
            icon={Users}
            color="text-purple-500"
            trend={{ value: 3.1, isPositive: true }}
          />
          
          <KPICard
            title="Pendentes"
            value={stats.consultasPendentes}
            icon={Clock}
            color="text-orange-500"
            trend={{ value: 2.8, isPositive: false }}
          />
          
          <KPICard
            title="Internados"
            value={stats.internados}
            icon={AlertTriangle}
            color="text-red-500"
          />
          
          <KPICard
            title="Ocupação"
            value={`${stats.ocupacaoAtual}%`}
            icon={Activity}
            color="text-indigo-500"
            trend={{ value: 4.7, isPositive: true }}
          />
          
          <KPICard
            title="Faturamento Mês"
            value={formatCurrency(stats.faturamentoMes)}
            subtitle="Meta: R$ 25.000"
            icon={TrendingUp}
            color="text-green-500"
            trend={{ value: 15.2, isPositive: true }}
          />
        </div>

        {/* Gráficos e Próximas Consultas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <GraficoOcupacao />
          <GraficoFaturamento />
          
          {/* Próximas consultas */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Clock className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />
                Próximas Consultas
              </CardTitle>
              <CardDescription>Agendamentos para hoje</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {proximasConsultas.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Nenhuma consulta agendada</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {proximasConsultas.map((consulta) => (
                    <div key={consulta.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{consulta.pets?.name}</span>
                          <span className="text-xs text-gray-500">({consulta.pets?.especie})</span>
                        </div>
                        <p className="text-xs text-gray-600">{consulta.tutores?.nome}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(consulta.appointment_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getServiceTypeColor(consulta.service_type)}`}>
                        {consulta.service_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Stethoscope className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>Acesso rápido às funções principais</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Nova Consulta</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm">Novo Paciente</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Novo Tutor</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-sm">Gestão Fiscal</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
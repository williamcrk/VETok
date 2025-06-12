
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Settings,
  CreditCard,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  cnpj: string;
  status: 'ativa' | 'suspensa' | 'inadimplente';
  plano: 'basico' | 'premium' | 'enterprise';
  usuarios_ativos: number;
  limite_usuarios: number;
  faturamento_mes: number;
  ultimo_pagamento: string;
  proxima_cobranca: string;
}

const MultiClinicasAdmin = () => {
  const { toast } = useToast();
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [selectedClinica, setSelectedClinica] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClinicas();
  }, []);

  const loadClinicas = async () => {
    try {
      setLoading(true);
      
      // Dados simulados para demonstração
      const clinicasSimuladas: Clinica[] = [
        {
          id: '1',
          nome: 'Clínica Veterinária Central',
          endereco: 'Rua Principal, 123 - Centro',
          telefone: '(11) 99999-9999',
          email: 'contato@clinicacentral.com',
          cnpj: '12.345.678/0001-90',
          status: 'ativa',
          plano: 'premium',
          usuarios_ativos: 8,
          limite_usuarios: 15,
          faturamento_mes: 45000,
          ultimo_pagamento: '2024-01-01',
          proxima_cobranca: '2024-02-01'
        },
        {
          id: '2',
          nome: 'Pet Care Norte',
          endereco: 'Av. Norte, 456 - Zona Norte',
          telefone: '(11) 88888-8888',
          email: 'admin@petcarenorte.com',
          cnpj: '98.765.432/0001-10',
          status: 'ativa',
          plano: 'basico',
          usuarios_ativos: 3,
          limite_usuarios: 5,
          faturamento_mes: 18000,
          ultimo_pagamento: '2024-01-15',
          proxima_cobranca: '2024-02-15'
        },
        {
          id: '3',
          nome: 'Veterinária Animal Plus',
          endereco: 'Rua das Flores, 789 - Jardim',
          telefone: '(11) 77777-7777',
          email: 'contato@animalplus.com',
          cnpj: '11.222.333/0001-44',
          status: 'inadimplente',
          plano: 'enterprise',
          usuarios_ativos: 0,
          limite_usuarios: 25,
          faturamento_mes: 0,
          ultimo_pagamento: '2023-11-01',
          proxima_cobranca: '2024-01-01'
        }
      ];

      setClinicas(clinicasSimuladas);
      if (clinicasSimuladas.length > 0) {
        setSelectedClinica(clinicasSimuladas[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar clínicas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as clínicas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'ativa': 'bg-green-100 text-green-800',
      'suspensa': 'bg-yellow-100 text-yellow-800',
      'inadimplente': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPlanoColor = (plano: string) => {
    const colors = {
      'basico': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-orange-100 text-orange-800'
    };
    return colors[plano as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularReceita = () => {
    return clinicas.reduce((total, clinica) => {
      const precoPlano = {
        'basico': 299,
        'premium': 599,
        'enterprise': 999
      };
      return total + (precoPlano[clinica.plano] * clinica.usuarios_ativos);
    }, 0);
  };

  const statsGerais = {
    totalClinicas: clinicas.length,
    clinicasAtivas: clinicas.filter(c => c.status === 'ativa').length,
    clinicasInadimplentes: clinicas.filter(c => c.status === 'inadimplente').length,
    receitaMensal: calcularReceita(),
    totalUsuarios: clinicas.reduce((total, c) => total + c.usuarios_ativos, 0)
  };

  const selectedClinicaData = clinicas.find(c => c.id === selectedClinica);

  if (loading) {
    return (
      <PageLayout title="Multi-Clínicas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Gestão Multi-Clínicas">
      <div className="space-y-6">
        {/* Dashboard Geral */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statsGerais.totalClinicas}</p>
                  <p className="text-sm text-gray-600">Clínicas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statsGerais.clinicasAtivas}</p>
                  <p className="text-sm text-gray-600">Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{statsGerais.clinicasInadimplentes}</p>
                  <p className="text-sm text-gray-600">Inadimplentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{statsGerais.totalUsuarios}</p>
                  <p className="text-sm text-gray-600">Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-lg font-bold">{formatCurrency(statsGerais.receitaMensal)}</p>
                  <p className="text-sm text-gray-600">Receita/Mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clinicas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clinicas">Clínicas</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="clinicas" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lista de Clínicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Clínicas Cadastradas</CardTitle>
                  <CardDescription>Gerencie todas as unidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {clinicas.map((clinica) => (
                      <div
                        key={clinica.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedClinica === clinica.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedClinica(clinica.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{clinica.nome}</h3>
                            <p className="text-sm text-gray-600">{clinica.endereco}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getStatusColor(clinica.status)}>
                                {clinica.status}
                              </Badge>
                              <Badge className={getPlanoColor(clinica.plano)}>
                                {clinica.plano}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">{clinica.usuarios_ativos}/{clinica.limite_usuarios}</p>
                            <p className="text-gray-600">usuários</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detalhes da Clínica Selecionada */}
              {selectedClinicaData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedClinicaData.nome}</span>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Gerenciar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">CNPJ</p>
                          <p className="text-gray-600">{selectedClinicaData.cnpj}</p>
                        </div>
                        <div>
                          <p className="font-medium">Telefone</p>
                          <p className="text-gray-600">{selectedClinicaData.telefone}</p>
                        </div>
                        <div>
                          <p className="font-medium">E-mail</p>
                          <p className="text-gray-600">{selectedClinicaData.email}</p>
                        </div>
                        <div>
                          <p className="font-medium">Plano</p>
                          <Badge className={getPlanoColor(selectedClinicaData.plano)}>
                            {selectedClinicaData.plano}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Uso de Licenças</span>
                          <span>{selectedClinicaData.usuarios_ativos}/{selectedClinicaData.limite_usuarios}</span>
                        </div>
                        <Progress 
                          value={(selectedClinicaData.usuarios_ativos / selectedClinicaData.limite_usuarios) * 100} 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-sm">Faturamento/Mês</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(selectedClinicaData.faturamento_mes)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Próxima Cobrança</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedClinicaData.proxima_cobranca).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Relatórios
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Cobrança
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="financeiro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Controle Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(statsGerais.receitaMensal)}
                        </p>
                        <p className="text-sm text-gray-600">Receita Mensal</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(statsGerais.receitaMensal * 12)}
                        </p>
                        <p className="text-sm text-gray-600">Projeção Anual</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(statsGerais.receitaMensal / statsGerais.totalUsuarios)}
                        </p>
                        <p className="text-sm text-gray-600">ARPU</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Consolidados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Relatórios em desenvolvimento</p>
                  <p className="text-sm">Dashboard de métricas por clínica</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Painel de configurações</p>
                  <p className="text-sm">Limite de usuários, planos e integrações</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MultiClinicasAdmin;

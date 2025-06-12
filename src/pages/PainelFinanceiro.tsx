import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, Calendar, Filter, Search, Plus,
  CreditCard, AlertTriangle, CheckCircle, Clock, Calculator,
  Award, Percent
} from 'lucide-react';
import RevenueChart from '@/components/charts/RevenueChart';
import ServiceChart from '@/components/charts/ServiceChart';

const PainelFinanceiro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const veterinarians = [
    { 
      name: 'Dr. João Silva', 
      revenue: 28500, 
      commission: 5700, 
      services: 45, 
      rank: 1,
      commissionRate: 20,
      bonus: 500,
      specialty: 'Cirurgia'
    },
    { 
      name: 'Dra. Maria Santos', 
      revenue: 24300, 
      commission: 4860, 
      services: 38, 
      rank: 2,
      commissionRate: 20,
      bonus: 300,
      specialty: 'Clínica Geral'
    },
    { 
      name: 'Dr. Pedro Costa', 
      revenue: 19800, 
      commission: 3960, 
      services: 32, 
      rank: 3,
      commissionRate: 20,
      bonus: 0,
      specialty: 'Dermatologia'
    },
  ];

  const serviceCommissions = [
    { service: 'Vacinas', percentage: 10, revenue: 12500, newClients: 45 },
    { service: 'Cirurgias', percentage: 20, revenue: 35000, newClients: 12 },
    { service: 'Consultas', percentage: 15, revenue: 18500, newClients: 89 },
    { service: 'Exames', percentage: 12, revenue: 8900, newClients: 23 },
  ];

  const commissionRules = [
    { rule: 'Meta Mensal > R$ 25.000', bonus: 'R$ 500 extra', active: true },
    { rule: 'Novos Clientes > 20', bonus: '2% adicional', active: true },
    { rule: 'Avaliação > 4.8', bonus: 'R$ 200 extra', active: true },
    { rule: 'Cirurgias > 10', bonus: '5% adicional', active: false },
  ];

  return (
    <PageLayout title="Painel Financeiro Avançado">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Sistema Avançado de Comissões</h2>
            <p className="text-gray-600">Cálculo automático com regras personalizadas</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
              size="sm"
            >
              Semana
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
              size="sm"
            >
              Mês
            </Button>
            <Button 
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('year')}
              size="sm"
            >
              Ano
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">R$ 72.600</p>
                  <p className="text-sm text-gray-600">Receita Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">R$ 14.520</p>
                  <p className="text-sm text-gray-600">Comissões Pagas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">R$ 800</p>
                  <p className="text-sm text-gray-600">Bônus do Mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">20%</p>
                  <p className="text-sm text-gray-600">Taxa Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="veterinarians" className="space-y-4">
          <TabsList>
            <TabsTrigger value="veterinarians">Veterinários</TabsTrigger>
            <TabsTrigger value="services">Por Serviço</TabsTrigger>
            <TabsTrigger value="rules">Regras de Comissão</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          </TabsList>

          <TabsContent value="veterinarians">
            <Card>
              <CardHeader>
                <CardTitle>Comissões por Veterinário</CardTitle>
                <CardDescription>Ranking mensal com cálculo automático e bônus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {veterinarians.map((vet) => (
                    <div key={vet.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">#{vet.rank}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{vet.name}</h3>
                          <p className="text-sm text-gray-600">{vet.specialty}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span>{vet.services} atendimentos</span>
                            <span>{vet.commissionRate}% comissão</span>
                            {vet.bonus > 0 && (
                              <Badge className="bg-purple-100 text-purple-800">
                                +R$ {vet.bonus} bônus
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          R$ {(vet.commission + vet.bonus).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Base: R$ {vet.commission.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          de R$ {vet.revenue.toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Comissões por Serviço</CardTitle>
                <CardDescription>Configuração e resultados por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceCommissions.map((item) => (
                    <div key={item.service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{item.service}</h3>
                        <p className="text-sm text-gray-600">
                          Comissão: {item.percentage}% | {item.newClients} novos clientes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">R$ {item.revenue.toLocaleString()}</p>
                        <p className="text-sm text-green-600">
                          Comissão: R$ {(item.revenue * item.percentage / 100).toLocaleString()}
                        </p>
                        {item.newClients > 20 && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            +2% bônus novos clientes
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Calculator className="w-4 h-4 mr-2" />
                  Configurar Comissões
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Regras de Comissão Automática</CardTitle>
                <CardDescription>Configure bônus e incentivos personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commissionRules.map((rule, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 border rounded-lg ${rule.active ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      <div>
                        <h3 className="font-medium">{rule.rule}</h3>
                        <p className="text-sm text-gray-600">Bônus: {rule.bonus}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {rule.active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Regra
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calculadora de Comissão</CardTitle>
                  <CardDescription>Simule comissões para diferentes cenários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor do Serviço</label>
                    <input type="number" placeholder="Ex: 1500" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Taxa de Comissão (%)</label>
                    <input type="number" placeholder="Ex: 20" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bônus Adicional</label>
                    <input type="number" placeholder="Ex: 200" className="w-full p-2 border rounded-lg" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular
                  </Button>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Resultado da Simulação</h3>
                    <p className="text-2xl font-bold text-blue-600">R$ 500,00</p>
                    <p className="text-sm text-blue-600">Comissão total estimada</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>Últimas comissões pagas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Dr. João Silva', amount: 5700, date: '15/11/2024', status: 'Pago' },
                      { name: 'Dra. Maria Santos', amount: 4860, date: '15/11/2024', status: 'Pago' },
                      { name: 'Dr. Pedro Costa', amount: 3960, date: '15/11/2024', status: 'Pendente' },
                    ].map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.name}</p>
                          <p className="text-sm text-gray-600">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {payment.amount.toLocaleString()}</p>
                          <Badge className={payment.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default PainelFinanceiro;


import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, DollarSign, Receipt, Calculator, Download, Plus } from 'lucide-react';

interface NotaFiscal {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  status: string;
  data_emissao: string;
}

interface Comissao {
  id: string;
  veterinario: string;
  procedimento: string;
  valor_procedimento: number;
  percentual: number;
  valor_comissao: number;
  data: string;
}

const GestaoFiscal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  
  const [novaComissao, setNovaComissao] = useState({
    veterinario_id: '',
    tipo_procedimento: '',
    percentual: '',
    valor_minimo: ''
  });

  useEffect(() => {
    loadDados();
  }, []);

  const loadDados = async () => {
    try {
      setLoading(true);
      
      // Carregar veterinários
      const { data: vetsData } = await supabase
        .from('veterinarios')
        .select('id, nome, crmv')
        .eq('is_active', true);

      setVeterinarios(vetsData || []);

      // Simular dados de notas fiscais
      setNotas([
        {
          id: '1',
          numero: 'NF-001',
          cliente: 'João Silva',
          valor: 150.00,
          status: 'Emitida',
          data_emissao: '2024-01-15'
        },
        {
          id: '2',
          numero: 'NF-002',
          cliente: 'Maria Santos',
          valor: 280.00,
          status: 'Pendente',
          data_emissao: '2024-01-16'
        }
      ]);

      // Simular dados de comissões
      setComissoes([
        {
          id: '1',
          veterinario: 'Dr. Carlos',
          procedimento: 'Consulta',
          valor_procedimento: 100.00,
          percentual: 15,
          valor_comissao: 15.00,
          data: '2024-01-15'
        },
        {
          id: '2',
          veterinario: 'Dra. Ana',
          procedimento: 'Cirurgia',
          valor_procedimento: 500.00,
          percentual: 20,
          valor_comissao: 100.00,
          data: '2024-01-16'
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const emitirNFe = async (clienteId: string, valor: number) => {
    try {
      setLoading(true);
      
      // Simular integração com API de NF-e
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "NF-e Emitida!",
        description: `Nota fiscal emitida com sucesso no valor de R$ ${valor.toFixed(2)}`,
      });

      loadDados(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao emitir NF-e:', error);
      toast({
        title: "Erro",
        description: "Não foi possível emitir a NF-e",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarComissao = async () => {
    if (!novaComissao.veterinario_id || !novaComissao.tipo_procedimento || !novaComissao.percentual) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Aqui você salvaria no banco de dados
      console.log('Nova regra de comissão:', novaComissao);

      toast({
        title: "Sucesso!",
        description: "Regra de comissão configurada com sucesso",
      });

      // Reset form
      setNovaComissao({
        veterinario_id: '',
        tipo_procedimento: '',
        percentual: '',
        valor_minimo: ''
      });

    } catch (error) {
      console.error('Erro ao salvar comissão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a regra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Emitida':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <PageLayout title="Gestão Fiscal">
      <div className="space-y-6">
        {/* Resumo Fiscal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">NF-e Emitidas</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold">R$ 3.420</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comissões</p>
                  <p className="text-2xl font-bold">R$ 684</p>
                </div>
                <Calculator className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Receipt className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notas Fiscais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Notas Fiscais Eletrônicas
              </CardTitle>
              <CardDescription>Emissão e controle de NF-e</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notas.map((nota) => (
                  <div key={nota.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{nota.numero}</span>
                        <Badge className={`text-xs ${getStatusColor(nota.status)}`}>
                          {nota.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{nota.cliente}</p>
                      <p className="text-sm font-medium">{formatCurrency(nota.valor)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => emitirNFe('cliente-1', 150)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Emitir Nova NF-e
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Comissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                Configuração de Comissões
              </CardTitle>
              <CardDescription>Defina regras de comissão por profissional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Veterinário</Label>
                <Select value={novaComissao.veterinario_id} onValueChange={(value) => setNovaComissao(prev => ({ ...prev, veterinario_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.nome} - {vet.crmv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Procedimento</Label>
                <Select value={novaComissao.tipo_procedimento} onValueChange={(value) => setNovaComissao(prev => ({ ...prev, tipo_procedimento: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="cirurgia">Cirurgia</SelectItem>
                    <SelectItem value="vacinacao">Vacinação</SelectItem>
                    <SelectItem value="exames">Exames</SelectItem>
                    <SelectItem value="emergencia">Emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Percentual (%)</Label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={novaComissao.percentual}
                    onChange={(e) => setNovaComissao(prev => ({ ...prev, percentual: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Valor Mínimo (R$)</Label>
                  <Input
                    type="number"
                    placeholder="50.00"
                    value={novaComissao.valor_minimo}
                    onChange={(e) => setNovaComissao(prev => ({ ...prev, valor_minimo: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={salvarComissao} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Regra
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Comissões */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
            <CardDescription>Comissões calculadas automaticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comissoes.map((comissao) => (
                <div key={comissao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{comissao.veterinario}</p>
                        <p className="text-sm text-gray-600">{comissao.procedimento}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Valor Proc.</p>
                        <p className="font-medium">{formatCurrency(comissao.valor_procedimento)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">% Comissão</p>
                        <p className="font-medium">{comissao.percentual}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Valor Comissão</p>
                        <p className="font-medium text-green-600">{formatCurrency(comissao.valor_comissao)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Data</p>
                        <p className="text-sm">{new Date(comissao.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GestaoFiscal;

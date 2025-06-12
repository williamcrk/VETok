
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Users, Bell, Building2, Percent, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Clinica {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  cep: string;
}

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  clinic_id: string;
}

interface ComissaoConfig {
  id: string;
  user_id: string;
  percentual: number;
  nome_usuario: string;
}

const Configuracoes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('clinica');
  
  // Estados para configurações
  const [clinica, setClinica] = useState<Clinica>({
    id: '',
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comissoes, setComissoes] = useState<ComissaoConfig[]>([]);
  
  const [notificacoes, setNotificacoes] = useState({
    novasConsultas: true,
    lembreteVacinacao: true,
    resultadosExames: true,
    pagamentosPendentes: false,
    internamentosCriticos: true,
    estoqueMinimo: true
  });

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = async () => {
    try {
      setLoading(true);
      
      // Carregar dados da clínica
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .limit(1)
        .single();

      if (clinicData) {
        setClinica(clinicData);
      }

      // Carregar usuários
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name');

      setUsuarios(usersData || []);

      // Carregar configurações de comissão
      const { data: comissoesData } = await supabase
        .from('veterinarios')
        .select(`
          id,
          user_id,
          comissao_percentual,
          nome
        `);

      const comissoesFormatadas = (comissoesData || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        percentual: item.comissao_percentual || 0,
        nome_usuario: item.nome
      }));

      setComissoes(comissoesFormatadas);

    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarClinica = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('clinics')
        .upsert({
          ...clinica,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "Dados da clínica foram atualizados com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao salvar clínica:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações da clínica.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarComissao = async (userId: string, percentual: number) => {
    try {
      const { error } = await supabase
        .from('veterinarios')
        .update({ comissao_percentual: percentual })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Comissão atualizada!",
        description: "Percentual de comissão foi salvo com sucesso.",
      });

      loadConfiguracoes();

    } catch (error) {
      console.error('Erro ao salvar comissão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a comissão.",
        variant: "destructive",
      });
    }
  };

  const toggleUsuarioStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: isActive ? "Usuário ativado!" : "Usuário desativado!",
        description: `Status do usuário foi atualizado.`,
      });

      loadConfiguracoes();

    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'clinica', label: 'Dados da Clínica', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'comissoes', label: 'Comissões', icon: Percent },
    { id: 'notificacoes', label: 'Notificações', icon: Bell }
  ];

  return (
    <PageLayout title="Configurações">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'clinica' && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Clínica</CardTitle>
              <CardDescription>Configure as informações básicas da sua clínica veterinária</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Clínica</Label>
                  <Input
                    id="name"
                    value={clinica.name}
                    onChange={(e) => setClinica({...clinica, name: e.target.value})}
                    placeholder="Nome da clínica"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={clinica.cnpj}
                    onChange={(e) => setClinica({...clinica, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clinica.email}
                    onChange={(e) => setClinica({...clinica, email: e.target.value})}
                    placeholder="contato@clinica.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={clinica.phone}
                    onChange={(e) => setClinica({...clinica, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={clinica.address}
                  onChange={(e) => setClinica({...clinica, address: e.target.value})}
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={clinica.city}
                    onChange={(e) => setClinica({...clinica, city: e.target.value})}
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select value={clinica.state} onValueChange={(value) => setClinica({...clinica, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      {/* Adicionar outros estados */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={clinica.cep}
                    onChange={(e) => setClinica({...clinica, cep: e.target.value})}
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <Button onClick={salvarClinica} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'usuarios' && (
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Controle os usuários e suas permissões no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{usuario.name}</h3>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{usuario.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={usuario.is_active}
                        onCheckedChange={(checked) => toggleUsuarioStatus(usuario.id, checked)}
                      />
                      <span className="text-sm">{usuario.is_active ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'comissoes' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Comissões</CardTitle>
              <CardDescription>Defina os percentuais de comissão por veterinário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comissoes.map((comissao) => (
                  <div key={comissao.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{comissao.nome_usuario}</h3>
                      <p className="text-sm text-gray-600">Veterinário</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={comissao.percentual}
                        onChange={(e) => {
                          const newComissoes = comissoes.map(c => 
                            c.id === comissao.id 
                              ? {...c, percentual: parseFloat(e.target.value) || 0}
                              : c
                          );
                          setComissoes(newComissoes);
                        }}
                        className="w-20"
                      />
                      <span className="text-sm">%</span>
                      <Button
                        size="sm"
                        onClick={() => salvarComissao(comissao.user_id, comissao.percentual)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notificacoes' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Notificações</CardTitle>
              <CardDescription>Configure quais notificações você deseja receber</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries({
                  novasConsultas: { label: 'Novas consultas agendadas', desc: 'Receber alertas de novos agendamentos' },
                  lembreteVacinacao: { label: 'Lembrete de vacinação', desc: 'Alertas de vacinas vencendo' },
                  resultadosExames: { label: 'Resultados de exames', desc: 'Quando exames ficarem prontos' },
                  pagamentosPendentes: { label: 'Pagamentos pendentes', desc: 'Cobranças em atraso' },
                  internamentosCriticos: { label: 'Internamentos críticos', desc: 'Pacientes em estado crítico' },
                  estoqueMinimo: { label: 'Estoque mínimo', desc: 'Produtos com estoque baixo' }
                }).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{config.label}</h3>
                      <p className="text-sm text-gray-600">{config.desc}</p>
                    </div>
                    <Switch
                      checked={notificacoes[key as keyof typeof notificacoes]}
                      onCheckedChange={(checked) => setNotificacoes({...notificacoes, [key]: checked})}
                    />
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Preferências de Notificação
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Configuracoes;

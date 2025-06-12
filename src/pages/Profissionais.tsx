
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserCheck, Plus, Phone, Mail, Calendar, 
  Edit, Trash2, MessageCircle, Activity
} from 'lucide-react';

const Profissionais = () => {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProfessional, setNewProfessional] = useState({
    nome: '',
    crmv: '',
    especialidade: '',
    telefone: '',
    email: '',
    is_active: true,
    comissao_percentual: 0
  });

  const [isNewProfessionalOpen, setIsNewProfessionalOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<any>(null);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('veterinarios')
        .select('*')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfessional = async () => {
    if (!newProfessional.nome || !newProfessional.crmv) {
      toast({
        title: "Erro",
        description: "Nome e CRMV são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingProfessional) {
        const { error } = await supabase
          .from('veterinarios')
          .update(newProfessional)
          .eq('id', editingProfessional.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Profissional atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('veterinarios')
          .insert([newProfessional]);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Novo profissional cadastrado",
        });
      }

      setNewProfessional({
        nome: '',
        crmv: '',
        especialidade: '',
        telefone: '',
        email: '',
        is_active: true,
        comissao_percentual: 0
      });
      setIsNewProfessionalOpen(false);
      setEditingProfessional(null);
      loadProfessionals();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o profissional",
        variant: "destructive",
      });
    }
  };

  const handleEditProfessional = (professional: any) => {
    setNewProfessional(professional);
    setEditingProfessional(professional);
    setIsNewProfessionalOpen(true);
  };

  const handleDeleteProfessional = async (professionalId: string) => {
    try {
      const { error } = await supabase
        .from('veterinarios')
        .update({ is_active: false })
        .eq('id', professionalId);

      if (error) throw error;

      toast({
        title: "Profissional removido",
        description: "O profissional foi removido da equipe",
      });
      loadProfessionals();
    } catch (error) {
      console.error('Erro ao remover profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o profissional",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    if (phone) {
      const message = `Olá ${name}! Como posso ajudar?`;
      window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <PageLayout title="Profissionais">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando profissionais...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Profissionais">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Equipe VetPrime</h2>
            <p className="text-gray-600">Gerencie sua equipe de profissionais</p>
          </div>
          
          <Dialog open={isNewProfessionalOpen} onOpenChange={setIsNewProfessionalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
                </DialogTitle>
                <DialogDescription>
                  {editingProfessional ? 'Atualize os dados do profissional' : 'Adicione um novo membro à equipe'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo *</Label>
                    <Input
                      value={newProfessional.nome}
                      onChange={(e) => setNewProfessional({...newProfessional, nome: e.target.value})}
                      placeholder="Ex: Dr. João Silva"
                    />
                  </div>
                  <div>
                    <Label>CRMV *</Label>
                    <Input
                      value={newProfessional.crmv}
                      onChange={(e) => setNewProfessional({...newProfessional, crmv: e.target.value})}
                      placeholder="Ex: 12345-SP"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Especialidade</Label>
                  <Input
                    value={newProfessional.especialidade || ''}
                    onChange={(e) => setNewProfessional({...newProfessional, especialidade: e.target.value})}
                    placeholder="Ex: Cirurgia Geral"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <Input
                      value={newProfessional.telefone || ''}
                      onChange={(e) => setNewProfessional({...newProfessional, telefone: e.target.value})}
                      placeholder="Ex: 11999999999"
                    />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={newProfessional.email || ''}
                      onChange={(e) => setNewProfessional({...newProfessional, email: e.target.value})}
                      placeholder="Ex: joao@vetprime.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Comissão (%)</Label>
                  <Input
                    type="number"
                    value={newProfessional.comissao_percentual}
                    onChange={(e) => setNewProfessional({...newProfessional, comissao_percentual: parseFloat(e.target.value) || 0})}
                    placeholder="Ex: 10"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsNewProfessionalOpen(false);
                      setEditingProfessional(null);
                      setNewProfessional({
                        nome: '',
                        crmv: '',
                        especialidade: '',
                        telefone: '',
                        email: '',
                        is_active: true,
                        comissao_percentual: 0
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfessional} className="bg-blue-600 hover:bg-blue-700">
                    {editingProfessional ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{professionals.length}</p>
                  <p className="text-sm text-gray-600">Profissionais Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{professionals.filter(p => p.crmv).length}</p>
                  <p className="text-sm text-gray-600">Veterinários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{professionals.filter(p => p.especialidade).length}</p>
                  <p className="text-sm text-gray-600">Com Especialidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Profissionais</CardTitle>
            <CardDescription>Gerencie sua equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {professionals.map((professional) => (
                <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{professional.nome}</h3>
                        <Badge className={getStatusColor(professional.is_active)}>
                          {professional.is_active ? 'ATIVO' : 'INATIVO'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        CRMV: {professional.crmv} 
                        {professional.especialidade && ` - ${professional.especialidade}`}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {professional.comissao_percentual > 0 && (
                          <span>Comissão: {professional.comissao_percentual}%</span>
                        )}
                        {professional.telefone && (
                          <button 
                            onClick={() => handleWhatsApp(professional.telefone, professional.nome)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                          >
                            <Phone className="w-3 h-3" />
                            {professional.telefone}
                          </button>
                        )}
                        {professional.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {professional.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {professional.telefone && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWhatsApp(professional.telefone, professional.nome)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditProfessional(professional)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteProfessional(professional.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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

export default Profissionais;

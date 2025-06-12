
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Bell, MessageCircle, Phone, AlertTriangle, Plus, Edit, Settings, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Tutor {
  id: string;
  nome: string;
  telefone: string;
}

interface Pet {
  id: string;
  name: string;
  especie: string;
  tutor_id: string;
}

interface Alert {
  id: number;
  type: string;
  pet_id: string;
  pet_name: string;
  tutor_id: string;
  tutor_name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

const Lembretes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [newAlert, setNewAlert] = useState({
    type: '',
    tutor_id: '',
    pet_id: '',
    service: '',
    date: '',
    time: '',
    status: 'pendente'
  });

  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  
  const [templates, setTemplates] = useState({
    vacina: "Olá {cliente}! 🐾\n\nLembramos que a vacina {servico} do {pet} está agendada para {data} às {hora}.\n\nConfirme sua presença!\n\nVetPrime - Cuidando com amor 💙",
    retorno: "Olá {cliente}! 🐾\n\nLembramos que o retorno do {pet} está agendado para {data} às {hora}.\n\nAguardamos vocês!\n\nVetPrime - Cuidando com amor 💙",
    consulta: "Olá {cliente}! 🐾\n\nLembramos que a consulta do {pet} está agendada para {data} às {hora}.\n\nConfirme sua presença!\n\nVetPrime - Cuidando com amor 💙",
    medicacao: "Olá {cliente}! 🐾\n\nLembramos que está na hora da medicação do {pet}: {servico}.\n\nNão se esqueça!\n\nVetPrime - Cuidando com amor 💙",
    cirurgia: "Olá {cliente}! 🐾\n\nLembramos que a cirurgia do {pet} está agendada para {data} às {hora}.\n\nLembretes importantes: jejum de 12h.\n\nVetPrime - Cuidando com amor 💙"
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (newAlert.tutor_id) {
      const tutorPets = pets.filter(pet => pet.tutor_id === newAlert.tutor_id);
      setFilteredPets(tutorPets);
      if (newAlert.pet_id && !tutorPets.find(p => p.id === newAlert.pet_id)) {
        setNewAlert(prev => ({ ...prev, pet_id: '' }));
      }
    } else {
      setFilteredPets([]);
    }
  }, [newAlert.tutor_id, pets]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar tutores
      const { data: tutoresData, error: tutoresError } = await supabase
        .from('tutores')
        .select('id, nome, telefone')
        .eq('is_active', true)
        .order('nome');

      if (tutoresError) throw tutoresError;

      // Buscar pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('id, name, especie, tutor_id')
        .order('name');

      if (petsError) throw petsError;

      setTutores(tutoresData || []);
      setPets(petsData || []);
      
      // Simulando alguns lembretes para demonstração
      setAlerts([
        {
          id: 1,
          type: 'vacina',
          pet_id: petsData?.[0]?.id || '',
          pet_name: petsData?.[0]?.name || 'Rex',
          tutor_id: tutoresData?.[0]?.id || '',
          tutor_name: tutoresData?.[0]?.nome || 'Maria Silva',
          phone: tutoresData?.[0]?.telefone || '11999999999',
          service: 'Vacina V10',
          date: '2024-11-20',
          time: '14:00',
          status: 'pendente'
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = (alert: Alert) => {
    const template = templates[alert.type as keyof typeof templates] || templates.consulta;
    return template
      .replace(/{cliente}/g, alert.tutor_name)
      .replace(/{pet}/g, alert.pet_name)
      .replace(/{servico}/g, alert.service)
      .replace(/{data}/g, new Date(alert.date).toLocaleDateString('pt-BR'))
      .replace(/{hora}/g, alert.time);
  };

  const openWhatsApp = (alert: Alert) => {
    const message = generateWhatsAppMessage(alert);
    const url = `https://wa.me/55${alert.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const markAsSent = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Lembrete removido",
      description: "O lembrete foi marcado como enviado e removido da lista",
    });
  };

  const deleteAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Lembrete excluído",
      description: "O lembrete foi removido da lista",
    });
  };

  const handleNewAlert = () => {
    if (!newAlert.tutor_id || !newAlert.pet_id || !newAlert.date || !newAlert.time) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const selectedTutor = tutores.find(t => t.id === newAlert.tutor_id);
    const selectedPet = pets.find(p => p.id === newAlert.pet_id);

    if (!selectedTutor || !selectedPet) {
      toast({
        title: "Erro",
        description: "Tutor ou pet não encontrado",
        variant: "destructive",
      });
      return;
    }

    const alert: Alert = {
      id: Date.now(),
      type: newAlert.type,
      pet_id: newAlert.pet_id,
      pet_name: selectedPet.name,
      tutor_id: newAlert.tutor_id,
      tutor_name: selectedTutor.nome,
      phone: selectedTutor.telefone,
      service: newAlert.service,
      date: newAlert.date,
      time: newAlert.time,
      status: 'pendente'
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      type: '',
      tutor_id: '',
      pet_id: '',
      service: '',
      date: '',
      time: '',
      status: 'pendente'
    });
    setIsNewAlertOpen(false);

    toast({
      title: "Lembrete criado!",
      description: `Lembrete para ${selectedPet.name} foi agendado`,
    });
  };

  const handleSaveTemplates = () => {
    toast({
      title: "Configurações salvas",
      description: "Os templates de mensagem foram atualizados",
    });
    setConfigOpen(false);
  };

  const handleAddNewTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast({
        title: "Erro",
        description: "Nome e mensagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setTemplates({
      ...templates,
      [newTemplate.name.toLowerCase()]: newTemplate.message
    });

    setNewTemplate({ name: '', message: '' });
    setNewTemplateOpen(false);

    toast({
      title: "Template adicionado!",
      description: `Template "${newTemplate.name}" foi criado com sucesso`,
    });
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'vacina': return 'bg-green-100 text-green-800';
      case 'retorno': return 'bg-blue-100 text-blue-800';
      case 'consulta': return 'bg-purple-100 text-purple-800';
      case 'medicacao': return 'bg-orange-100 text-orange-800';
      case 'cirurgia': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Lembretes Automáticos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando lembretes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Lembretes Automáticos">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h2 className="text-base md:text-lg font-semibold">Lembretes Automáticos</h2>
            <p className="text-sm text-gray-600">Sistema inteligente de notificações por WhatsApp</p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Dialog open={isNewAlertOpen} onOpenChange={setIsNewAlertOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Novo Lembrete</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Novo Lembrete</DialogTitle>
                  <DialogDescription>
                    Crie um novo lembrete automático
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tutor-select">Cliente/Tutor *</Label>
                    <Select value={newAlert.tutor_id} onValueChange={(value) => setNewAlert({...newAlert, tutor_id: value})}>
                      <SelectTrigger id="tutor-select">
                        <SelectValue placeholder="Selecione o cliente primeiro" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutores.map((tutor) => (
                          <SelectItem key={tutor.id} value={tutor.id}>
                            {tutor.nome} {tutor.telefone && `- ${tutor.telefone}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pet-select">Animal/Paciente *</Label>
                    <Select 
                      value={newAlert.pet_id} 
                      onValueChange={(value) => setNewAlert({...newAlert, pet_id: value})}
                      disabled={!newAlert.tutor_id}
                    >
                      <SelectTrigger id="pet-select">
                        <SelectValue placeholder={newAlert.tutor_id ? "Selecione o animal" : "Selecione um cliente primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name} ({pet.especie})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type-select">Tipo de Lembrete *</Label>
                    <Select value={newAlert.type} onValueChange={(value) => setNewAlert({...newAlert, type: value})}>
                      <SelectTrigger id="type-select">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(templates).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service-input">Serviço/Procedimento</Label>
                    <Input
                      id="service-input"
                      name="service"
                      value={newAlert.service}
                      onChange={(e) => setNewAlert({...newAlert, service: e.target.value})}
                      placeholder="Ex: Vacina V10, Retorno cirurgia..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-input">Data *</Label>
                      <Input
                        id="date-input"
                        name="date"
                        type="date"
                        value={newAlert.date}
                        onChange={(e) => setNewAlert({...newAlert, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time-input">Horário *</Label>
                      <Input
                        id="time-input"
                        name="time"
                        type="time"
                        value={newAlert.time}
                        onChange={(e) => setNewAlert({...newAlert, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewAlertOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleNewAlert} className="bg-blue-600 hover:bg-blue-700">
                      Criar Lembrete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={configOpen} onOpenChange={setConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Configurar Mensagens</span>
                  <span className="sm:hidden">Config</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configurações de Mensagens Automáticas</DialogTitle>
                  <DialogDescription>
                    Personalize as mensagens automáticas. Use as variáveis: {'{cliente}'}, {'{pet}'}, {'{servico}'}, {'{data}'}, {'{hora}'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Templates Existentes</h3>
                    <Dialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Novo Template de Mensagem</DialogTitle>
                          <DialogDescription>
                            Crie um novo template personalizado
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="template-name">Nome do Template</Label>
                            <Input
                              id="template-name"
                              value={newTemplate.name}
                              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                              placeholder="Ex: Banho e Tosa"
                            />
                          </div>
                          <div>
                            <Label htmlFor="template-message">Mensagem</Label>
                            <Textarea
                              id="template-message"
                              value={newTemplate.message}
                              onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                              placeholder="Use {cliente}, {pet}, {servico}, {data}, {hora}"
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setNewTemplateOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleAddNewTemplate}>
                              Adicionar Template
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {Object.entries(templates).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={`template-${key}`}>
                        Mensagem para {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Textarea 
                        id={`template-${key}`}
                        name={`template-${key}`}
                        value={value}
                        onChange={(e) => setTemplates({...templates, [key]: e.target.value})}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  ))}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setConfigOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveTemplates} className="bg-blue-600 hover:bg-blue-700">
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Alertas</span>
              <span className="sm:hidden">🔔</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 md:w-5 h-4 md:h-5 text-orange-500" />
                <div>
                  <p className="text-lg md:text-2xl font-bold">{alerts.filter(a => a.status === 'pendente').length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Alertas Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
                <div>
                  <p className="text-lg md:text-2xl font-bold">{alerts.filter(a => a.status === 'enviado').length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Mensagens Enviadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />
                <div>
                  <p className="text-lg md:text-2xl font-bold">{alerts.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</p>
                  <p className="text-xs md:text-sm text-gray-600">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Lembretes Programados</CardTitle>
            <CardDescription className="text-sm">Lista de lembretes automáticos</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum lembrete programado</p>
                  <p className="text-sm mt-2">
                    Crie lembretes automáticos para seus clientes
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 space-y-3 md:space-y-0">
                    <div className="flex items-start md:items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm md:text-base truncate">{alert.pet_name} - {alert.tutor_name}</h3>
                          <Badge className={`${getAlertColor(alert.type)} text-xs`}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(alert.status)} text-xs`}>
                            {alert.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{alert.service}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(alert.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </span>
                          {alert.phone && (
                            <button 
                              onClick={() => window.open(`https://wa.me/55${alert.phone.replace(/\D/g, '')}`, '_blank')}
                              className="flex items-center gap-1 text-green-600 hover:text-green-800"
                            >
                              <Phone className="w-3 h-3" />
                              <span className="hidden sm:inline">{alert.phone}</span>
                              <span className="sm:hidden">Tel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                        onClick={() => openWhatsApp(alert)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">💬</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => markAsSent(alert.id)}
                      >
                        <span className="hidden sm:inline">Enviado</span>
                        <span className="sm:hidden">✓</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full sm:w-auto text-red-600 hover:text-red-700"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
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

export default Lembretes;

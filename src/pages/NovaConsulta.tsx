import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Heart, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Pet {
  id: string;
  name: string;
  especie: string;
  raca: string;
  tutor_id: string;
  tutores?: {
    nome: string;
    telefone: string;
  };
}

interface Tutor {
  id: string;
  nome: string;
  telefone: string;
}

const NovaConsulta = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  
  const [formData, setFormData] = useState({
    tutor_id: '',
    pet_id: '',
    appointment_date: '',
    service_type: '',
    notes: '',
    create_prontuario: false
  });

  const [prontuarioData, setProntuarioData] = useState({
    anamnese: '',
    diagnostico: '',
    tratamento: '',
    observacoes: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.tutor_id) {
      const tutorPets = pets.filter(pet => pet.tutor_id === formData.tutor_id);
      setFilteredPets(tutorPets);
      if (formData.pet_id && !tutorPets.find(p => p.id === formData.pet_id)) {
        setFormData(prev => ({ ...prev, pet_id: '' }));
      }
    } else {
      setFilteredPets(pets);
    }
  }, [formData.tutor_id, pets]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select(`
          id,
          name,
          especie,
          raca,
          tutor_id,
          tutores (
            nome,
            telefone
          )
        `)
        .order('name');

      if (petsError) throw petsError;

      const { data: tutoresData, error: tutoresError } = await supabase
        .from('tutores')
        .select('id, nome, telefone')
        .eq('is_active', true)
        .order('nome');

      if (tutoresError) throw tutoresError;

      setPets(petsData || []);
      setTutores(tutoresData || []);
      setFilteredPets(petsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pet_id || !formData.appointment_date || !formData.service_type) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (formData.create_prontuario && !prontuarioData.diagnostico) {
      toast({
        title: "Erro",
        description: "Para criar prontuário, o diagnóstico é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Criar consulta sem RLS - inserindo dados básicos
      const appointmentData = {
        pet_id: formData.pet_id,
        tutor_id: formData.tutor_id,
        appointment_date: new Date(formData.appointment_date).toISOString(),
        service_type: formData.service_type,
        notes: formData.notes || null,
        status: 'scheduled'
      };

      // Usando uma abordagem mais simples para evitar RLS
      const { data: appointmentResult, error: appointmentError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (appointmentError) {
        console.error('Erro detalhado:', appointmentError);
        throw appointmentError;
      }

      // Se deve criar prontuário também
      if (formData.create_prontuario && appointmentResult) {
        const atendimentoData = {
          pet_id: formData.pet_id,
          data_hora: new Date(formData.appointment_date).toISOString(),
          anamnese: prontuarioData.anamnese || null,
          diagnostico: prontuarioData.diagnostico,
          tratamento: prontuarioData.tratamento || null,
          observacoes: prontuarioData.observacoes || null,
          status: 'em_andamento'
        };

        const { error: atendimentoError } = await supabase
          .from('atendimentos')
          .insert([atendimentoData]);

        if (atendimentoError) throw atendimentoError;
      }
      
      toast({
        title: "Sucesso!",
        description: `Consulta agendada para ${new Date(formData.appointment_date).toLocaleDateString('pt-BR')}${formData.create_prontuario ? ' e prontuário criado' : ''}`,
      });

      // Reset form
      setFormData({
        tutor_id: '',
        pet_id: '',
        appointment_date: '',
        service_type: '',
        notes: '',
        create_prontuario: false
      });

      setProntuarioData({
        anamnese: '',
        diagnostico: '',
        tratamento: '',
        observacoes: ''
      });

      // Navegar para agenda
      navigate('/agenda');
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível agendar a consulta. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <PageLayout title="Nova Consulta">
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
    <PageLayout title="Nova Consulta">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Agendar Nova Consulta
            </CardTitle>
            <CardDescription>Preencha os dados para agendar uma nova consulta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tutor-select">Tutor *</Label>
                  <Select value={formData.tutor_id} onValueChange={(value) => setFormData({...formData, tutor_id: value})}>
                    <SelectTrigger id="tutor-select">
                      <SelectValue placeholder="Selecione o tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {tutores.map((tutor) => (
                        <SelectItem key={tutor.id} value={tutor.id}>
                          {tutor.nome}
                          {tutor.telefone && ` - ${tutor.telefone}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pet-select">Paciente *</Label>
                  <Select 
                    value={formData.pet_id} 
                    onValueChange={(value) => {
                      const selectedPet = pets.find(p => p.id === value);
                      setFormData({
                        ...formData, 
                        pet_id: value,
                        tutor_id: selectedPet?.tutor_id || formData.tutor_id
                      });
                    }}
                    disabled={!filteredPets.length}
                  >
                    <SelectTrigger id="pet-select">
                      <SelectValue placeholder={filteredPets.length ? "Selecione o paciente" : "Selecione um tutor primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.especie} - {pet.raca})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Data e Hora *</Label>
                  <Input 
                    type="datetime-local" 
                    id="appointment-date"
                    name="appointment-date"
                    value={formData.appointment_date}
                    min={`${getMinDate()}T08:00`}
                    max={`${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T17:30`}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Tipo de Consulta *</Label>
                  <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                    <SelectTrigger id="service-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta de Rotina">Consulta de Rotina</SelectItem>
                      <SelectItem value="Vacinação">Vacinação</SelectItem>
                      <SelectItem value="Emergência">Emergência</SelectItem>
                      <SelectItem value="Retorno">Retorno</SelectItem>
                      <SelectItem value="Cirurgia">Pré/Pós Cirúrgico</SelectItem>
                      <SelectItem value="Exames">Exames</SelectItem>
                      <SelectItem value="Castração">Castração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation-notes">Observações/Motivo da Consulta</Label>
                <Textarea 
                  id="consultation-notes"
                  name="consultation-notes"
                  placeholder="Descreva os sintomas, motivo da consulta ou observações importantes..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-prontuario"
                    name="create-prontuario"
                    checked={formData.create_prontuario}
                    onChange={(e) => setFormData({...formData, create_prontuario: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="create-prontuario">Criar prontuário junto com a consulta</Label>
                </div>
              </div>

              {formData.create_prontuario && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dados do Prontuário</CardTitle>
                    <CardDescription>Preencha os dados do atendimento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="anamnese">Anamnese</Label>
                      <Textarea
                        id="anamnese"
                        name="anamnese"
                        value={prontuarioData.anamnese}
                        onChange={(e) => setProntuarioData({...prontuarioData, anamnese: e.target.value})}
                        placeholder="História clínica, sintomas relatados..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diagnostico">Diagnóstico *</Label>
                      <Textarea
                        id="diagnostico"
                        name="diagnostico"
                        value={prontuarioData.diagnostico}
                        onChange={(e) => setProntuarioData({...prontuarioData, diagnostico: e.target.value})}
                        placeholder="Diagnóstico médico veterinário..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tratamento">Tratamento</Label>
                      <Textarea
                        id="tratamento"
                        name="tratamento"
                        value={prontuarioData.tratamento}
                        onChange={(e) => setProntuarioData({...prontuarioData, tratamento: e.target.value})}
                        placeholder="Tratamento prescrito..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes-prontuario">Observações</Label>
                      <Textarea
                        id="observacoes-prontuario"
                        name="observacoes-prontuario"
                        value={prontuarioData.observacoes}
                        onChange={(e) => setProntuarioData({...prontuarioData, observacoes: e.target.value})}
                        placeholder="Observações adicionais..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  disabled={loading || !formData.pet_id || !formData.appointment_date || !formData.service_type}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {loading ? 'Agendando...' : 'Agendar Consulta'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/agenda')}
                >
                  Ver Agenda
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{pets.length}</div>
              <p className="text-xs text-gray-500">Cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tutores Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{tutores.length}</div>
              <p className="text-xs text-gray-500">Clientes cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Horário Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default NovaConsulta;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AgendaItem {
  id: string;
  appointment_date: string;
  service_type: string;
  status: string;
  pets?: { 
    name: string; 
    especie: string;
    tutores?: {
      nome: string; 
      telefone: string 
    }
  };
}

interface Pet {
  id: string;
  name: string;
  especie: string;
  tutor_id: string;
  tutores?: {
    nome: string;
  };
}

interface TimeSlot {
  time: string;
  appointment?: AgendaItem;
}

const AgendaDragDrop = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  
  const [newAppointment, setNewAppointment] = useState({
    pet_id: '',
    appointment_date: '',
    service_type: '',
    notes: ''
  });

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time });
      }
    }
    return slots;
  };

  useEffect(() => {
    loadAppointments();
    loadPets();
  }, [selectedDate]);

  const loadPets = async () => {
    try {
      const { data: petsData, error } = await supabase
        .from('pets')
        .select(`
          *,
          tutores(*)
        `)
        .order('name');
      
      if (error) throw error;
      setPets(petsData || []);
    } catch (error) {
       console.error('Erro ao carregar pets:', error);
       toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de pets.",
        variant: "destructive",
      });
    }
  }

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (
            *,
            tutores (*)
          )
        `)
        .gte('appointment_date', `${dateStr}T00:00:00`)
        .lt('appointment_date', `${dateStr}T23:59:59`)
        .order('appointment_date');

      if (error) {
        console.error('Erro ao carregar agenda:', error);
        throw error;
      }

      const slots = generateTimeSlots();
      const slotsWithAppointments = slots.map(slot => {
        const appointment = data?.find(apt => {
          const aptTime = new Date(apt.appointment_date).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          return aptTime === slot.time;
        });
        
        return { ...slot, appointment };
      });

      setTimeSlots(slotsWithAppointments);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a agenda",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewAppointment = async () => {
    if (!newAppointment.pet_id || !newAppointment.appointment_date || !newAppointment.service_type) {
      toast({
        title: "Erro de Validação",
        description: "Paciente, Data/Hora e Tipo de Serviço são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const selectedPet = pets.find(p => p.id === newAppointment.pet_id);
      if (!selectedPet) throw new Error("Pet não encontrado");

      const appointmentData = {
        pet_id: newAppointment.pet_id,
        tutor_id: selectedPet.tutor_id,
        appointment_date: new Date(newAppointment.appointment_date).toISOString(),
        service_type: newAppointment.service_type,
        notes: newAppointment.notes || null,
        status: 'scheduled'
      };

      const { error } = await supabase.from('appointments').insert([appointmentData]);
      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `Nova consulta para ${selectedPet.name} agendada.`,
      });

      setNewAppointment({ pet_id: '', appointment_date: '', service_type: '', notes: '' });
      setIsNewAppointmentOpen(false);
      loadAppointments(); // Recarrega a agenda
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, appointment: AgendaItem) => {
    setDraggedItem(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetTime: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    try {
      const newDate = new Date(selectedDate);
      const [hours, minutes] = targetTime.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: newDate.toISOString() })
        .eq('id', draggedItem.id);

      if (error) throw error;

      toast({
        title: "Horário Alterado",
        description: `Consulta movida para ${targetTime}`,
      });

      loadAppointments();
    } catch (error) {
      console.error('Erro ao mover consulta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível mover a consulta",
        variant: "destructive",
      });
    } finally {
      setDraggedItem(null);
    }
  };

  const getServiceColor = (serviceType: string) => {
    const colors: { [key: string]: string } = {
      'Consulta': 'bg-blue-100 border-blue-200',
      'Cirurgia': 'bg-purple-100 border-purple-200',
      'Vacinação': 'bg-green-100 border-green-200',
      'Emergência': 'bg-red-100 border-red-200',
      'Retorno': 'bg-gray-200 border-gray-300',
    };
    return colors[serviceType] || 'bg-gray-100 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'border-l-blue-500',
      'in_progress': 'border-l-yellow-500',
      'completed': 'border-l-green-500',
      'cancelled': 'border-l-red-500',
    };
    return colors[status as keyof typeof colors] || 'border-l-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pet-select" className="text-right">
                Paciente
              </Label>
              <Select value={newAppointment.pet_id} onValueChange={(value) => setNewAppointment({...newAppointment, pet_id: value})}>
                <SelectTrigger id="pet-select" className="col-span-3">
                  <SelectValue placeholder="Selecione o pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.especie}) - {pet.tutores?.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="datetime" className="text-right">
                Data e Hora
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                className="col-span-3"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-type" className="text-right">
                Serviço
              </Label>
               <Select value={newAppointment.service_type} onValueChange={(value) => setNewAppointment({...newAppointment, service_type: value})}>
                <SelectTrigger id="service-type" className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Vacinação">Vacinação</SelectItem>
                  <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="Emergência">Emergência</SelectItem>
                  <SelectItem value="Retorno">Retorno</SelectItem>
                  <SelectItem value="Exames">Exames</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <Textarea
                id="notes"
                className="col-span-3"
                placeholder="Observações sobre a consulta..."
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleNewAppointment} disabled={submitting}>
            {submitting ? 'Agendando...' : 'Agendar Consulta'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Controles de Data */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda Interativa
            </CardTitle>
            <div className="flex items-center gap-4">
               <Button onClick={() => setIsNewAppointmentOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                >
                  ← Dia Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                >
                  Próximo Dia →
                </Button>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            {selectedDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </CardHeader>
      </Card>

      {/* Grid de Horários */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className={`min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg p-3 transition-colors ${
                  !slot.appointment && 'hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot.time)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {slot.time}
                  </span>
                  {!slot.appointment && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        const [h, m] = slot.time.split(':');
                        const newDate = new Date(selectedDate);
                        newDate.setHours(parseInt(h), parseInt(m));
                        
                        const formattedDateTime = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;

                        setNewAppointment({...newAppointment, appointment_date: formattedDateTime });
                        setIsNewAppointmentOpen(true)
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {slot.appointment ? (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, slot.appointment!)}
                    className={`cursor-move rounded-md p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 ${getStatusColor(slot.appointment.status)} ${getServiceColor(slot.appointment.service_type)}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{slot.appointment.pets?.name}</span>
                        <Badge variant="outline" className="text-xs border-gray-500/30 bg-white/50">
                          {slot.appointment.service_type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          <span>{slot.appointment.pets?.tutores?.nome}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          <span>{slot.appointment.pets?.tutores?.telefone || 'Não informado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-blue-500"></div>
              <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-yellow-500"></div>
              <span>Em Andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-green-500"></div>
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-red-500"></div>
              <span>Cancelado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaDragDrop;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface NovaVacinacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovaVacinacaoModal = ({ open, onOpenChange, onSuccess }: NovaVacinacaoModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    petName: '',
    owner: '',
    phone: '',
    vaccine: '',
    date: '',
    time: '',
    veterinarian: '',
    observations: ''
  });

  const vaccines = [
    { name: 'V8 (Óctupla)', interval: 12 },
    { name: 'V10 (Déctupla)', interval: 12 },
    { name: 'Antirrábica', interval: 12 },
    { name: 'Giardia', interval: 12 },
    { name: 'Gripe Canina', interval: 6 },
    { name: 'Leishmaniose', interval: 12 }
  ];

  const calculateNextDose = (vaccineType: string) => {
    const vaccine = vaccines.find(v => v.name === vaccineType);
    if (vaccine) {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + vaccine.interval);
      return nextDate.toLocaleDateString();
    }
    return '';
  };

  const handleSubmit = () => {
    if (!formData.petName || !formData.owner || !formData.vaccine || !formData.date) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const nextDose = calculateNextDose(formData.vaccine);
    
    toast({
      title: "Vacinação Agendada!",
      description: `${formData.vaccine} agendada para ${formData.petName} em ${formData.date}${nextDose ? `. Próxima dose: ${nextDose}` : ''}`,
    });

    // Enviar WhatsApp automático apenas se houver telefone
    if (formData.phone) {
      const message = `Olá ${formData.owner}! 🐾\n\nVacinação agendada para ${formData.petName}:\n📅 Data: ${formData.date}\n⏰ Horário: ${formData.time}\n💉 Vacina: ${formData.vaccine}\n\n${nextDose ? `🗓️ Próxima dose: ${nextDose}\n\n` : ''}VetPrime - Cuidando com amor 💙`;
      
      window.open(`https://wa.me/55${formData.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }

    // Reset form
    setFormData({
      petName: '',
      owner: '',
      phone: '',
      vaccine: '',
      date: '',
      time: '',
      veterinarian: '',
      observations: ''
    });

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Vacinação</DialogTitle>
          <DialogDescription>
            Agende uma nova vacinação
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome do Pet *</Label>
              <Input
                value={formData.petName}
                onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                placeholder="Ex: Rex"
              />
            </div>
            <div>
              <Label>Tutor *</Label>
              <Input
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="Ex: Maria Silva"
              />
            </div>
          </div>

          <div>
            <Label>WhatsApp</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="11999999999"
            />
          </div>

          <div>
            <Label>Vacina *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vaccine: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a vacina" />
              </SelectTrigger>
              <SelectContent>
                {vaccines.map((vaccine) => (
                  <SelectItem key={vaccine.name} value={vaccine.name}>
                    {vaccine.name} - Reforço a cada {vaccine.interval} meses
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Veterinário</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarian: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                <SelectItem value="Dr. Pedro Costa">Dr. Pedro Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.vaccine && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Próxima dose:</strong> {calculateNextDose(formData.vaccine)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Agendar Vacinação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovaVacinacaoModal;

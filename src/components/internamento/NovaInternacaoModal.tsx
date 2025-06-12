import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Pet {
  id: string;
  name: string;
}

interface Veterinario {
  id: string;
  nome: string;
}

interface NovaInternacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovaInternacaoModal = ({ open, onOpenChange, onSuccess }: NovaInternacaoModalProps) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedVet, setSelectedVet] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPetsAndVets();
    }
  }, [open]);

  const fetchPetsAndVets = async () => {
    const { data: petsData, error: petsError } = await supabase.from('pets').select('id, name');
    if (petsError) console.error('Error fetching pets:', petsError);
    else setPets(petsData);

    const { data: vetsData, error: vetsError } = await supabase.from('veterinarios').select('id, nome');
    if (vetsError) console.error('Error fetching vets:', vetsError);
    else setVeterinarios(vetsData);
  };

  const handleSubmit = async () => {
    if (!selectedPet || !motivo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione um paciente e descreva o motivo da internação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const dataToInsert = {
      pet_id: selectedPet,
      veterinario_id: selectedVet ? selectedVet : null,
      motivo: motivo,
      status: 'ativa',
      data_entrada: new Date().toISOString(),
    };

    const { error } = await supabase.from('internacoes').insert(dataToInsert);

    if (error) {
      toast({
        title: "Erro ao criar internação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "A internação foi registrada.",
      });
      onSuccess();
      handleClose();
    }
    setIsSubmitting(false);
  };
  
  const handleClose = () => {
      setSelectedPet('');
      setSelectedVet('');
      setMotivo('');
      onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nova Internação</DialogTitle>
          <DialogDescription>Preencha os dados para admitir um novo paciente.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="pet">Paciente</Label>
            <Select onValueChange={setSelectedPet} value={selectedPet}>
              <SelectTrigger id="pet">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="veterinario">Veterinário Responsável (Opcional)</Label>
            <Select onValueChange={setSelectedVet} value={selectedVet}>
              <SelectTrigger id="veterinario">
                <SelectValue placeholder="Selecione um veterinário" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map(vet => (
                  <SelectItem key={vet.id} value={vet.id}>{vet.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="motivo">Motivo da Internação</Label>
            <Textarea 
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o quadro clínico e o motivo..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Internação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaInternacaoModal; 
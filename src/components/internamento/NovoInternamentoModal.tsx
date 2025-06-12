
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NovoInternamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovoInternamentoModal = ({ open, onOpenChange, onSuccess }: NovoInternamentoModalProps) => {
  const { toast } = useToast();
  const [tutores, setTutores] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tutor_id: '',
    pet_id: '',
    veterinario_id: '',
    motivo: '',
    diagnostico: '',
    observacoes: ''
  });

  useEffect(() => {
    if (open) {
      loadTutores();
      loadVeterinarios();
    }
  }, [open]);

  useEffect(() => {
    if (formData.tutor_id) {
      loadPetsByTutor(formData.tutor_id);
    } else {
      setPets([]);
      setFormData(prev => ({ ...prev, pet_id: '' }));
    }
  }, [formData.tutor_id]);

  const loadTutores = async () => {
    try {
      const { data, error } = await supabase
        .from('tutores')
        .select('id, nome, telefone')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;
      setTutores(data || []);
    } catch (error) {
      console.error('Erro ao carregar tutores:', error);
    }
  };

  const loadPetsByTutor = async (tutorId: string) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, especie, raca')
        .eq('tutor_id', tutorId)
        .order('name');

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    }
  };

  const loadVeterinarios = async () => {
    try {
      const { data, error } = await supabase
        .from('veterinarios')
        .select('id, nome, crmv')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;
      setVeterinarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar veterinários:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.tutor_id || !formData.pet_id || !formData.motivo) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('internamentos')
        .insert({
          paciente_id: formData.pet_id,
          veterinario_id: formData.veterinario_id || null,
          motivo: formData.motivo,
          diagnostico: formData.diagnostico,
          observacoes: formData.observacoes,
          data_entrada: new Date().toISOString(),
          status: 'Internado'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Paciente internado com sucesso",
      });

      setFormData({
        tutor_id: '',
        pet_id: '',
        veterinario_id: '',
        motivo: '',
        diagnostico: '',
        observacoes: ''
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao internar paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o internamento",
        variant: "destructive",
      });
    }
  };

  const selectedTutor = tutores.find(t => t.id === formData.tutor_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Internamento</DialogTitle>
          <DialogDescription>
            Registre um novo paciente para internamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Cliente/Tutor *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, tutor_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {tutores.map((tutor) => (
                  <SelectItem key={tutor.id} value={tutor.id}>
                    {tutor.nome} - {tutor.telefone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTutor && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm"><strong>Cliente:</strong> {selectedTutor.nome}</p>
              <p className="text-sm"><strong>Telefone:</strong> {selectedTutor.telefone}</p>
            </div>
          )}

          <div>
            <Label>Pet *</Label>
            <Select 
              value={formData.pet_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pet_id: value }))}
              disabled={!formData.tutor_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.tutor_id ? "Selecione o pet" : "Selecione primeiro o cliente"} />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} - {pet.especie} ({pet.raca})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Veterinário Responsável</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, veterinario_id: value }))}>
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
            <Label>Motivo do Internamento *</Label>
            <Input
              value={formData.motivo}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              placeholder="Ex: Cirurgia ortopédica, Intoxicação..."
            />
          </div>

          <div>
            <Label>Diagnóstico</Label>
            <Input
              value={formData.diagnostico}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnostico: e.target.value }))}
              placeholder="Diagnóstico inicial..."
            />
          </div>

          <div>
            <Label>Observações Iniciais</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações sobre o estado do animal..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Internar Paciente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoInternamentoModal;

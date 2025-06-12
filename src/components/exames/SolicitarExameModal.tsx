
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SolicitarExameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SolicitarExameModal = ({ open, onOpenChange, onSuccess }: SolicitarExameModalProps) => {
  const { toast } = useToast();
  const [tutores, setTutores] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    tutor_id: '',
    pet_id: '',
    veterinario_id: '',
    exams: [] as string[],
    urgencia: '',
    observacoes: '',
    jejum: false,
    preparacao: ''
  });

  const examTypes = [
    { id: 'hemograma', name: 'Hemograma Completo' },
    { id: 'bioquimica', name: 'Bioquímica Sérica' },
    { id: 'urina', name: 'Exame de Urina' },
    { id: 'fezes', name: 'Exame de Fezes' },
    { id: 'raio-x', name: 'Raio-X' },
    { id: 'ultrassom', name: 'Ultrassom' },
    { id: 'ecocardiograma', name: 'Ecocardiograma' },
    { id: 'eletrocardiograma', name: 'Eletrocardiograma' },
    { id: 'citologia', name: 'Citologia' },
    { id: 'histopatologico', name: 'Histopatológico' }
  ];

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

  const handleExamChange = (examId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      exams: checked 
        ? [...prev.exams, examId]
        : prev.exams.filter(id => id !== examId)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.tutor_id || !formData.pet_id || formData.exams.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione o cliente, pet e pelo menos um exame",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const examType of formData.exams) {
        const exameName = examTypes.find(e => e.id === examType)?.name || examType;
        
        const { error } = await supabase
          .from('exames_solicitados')
          .insert({
            pet_id: formData.pet_id,
            tutor_id: formData.tutor_id,
            veterinario_id: formData.veterinario_id || null,
            tipo_exame: exameName,
            urgencia: formData.urgencia || 'rotina',
            observacoes: formData.observacoes,
            preparacao: formData.preparacao,
            jejum: formData.jejum,
            status: 'pendente'
          });

        if (error) throw error;
      }

      toast({
        title: "Exames Solicitados!",
        description: `${formData.exams.length} exame(s) solicitado(s) com sucesso`,
      });

      // Reset form
      setFormData({
        tutor_id: '',
        pet_id: '',
        veterinario_id: '',
        exams: [],
        urgencia: '',
        observacoes: '',
        jejum: false,
        preparacao: ''
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao solicitar exames:', error);
      toast({
        title: "Erro",
        description: "Não foi possível solicitar os exames",
        variant: "destructive",
      });
    }
  };

  const selectedTutor = tutores.find(t => t.id === formData.tutor_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Exame</DialogTitle>
          <DialogDescription>
            Solicite exames complementares para o diagnóstico
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Veterinário Solicitante</Label>
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
              <Label>Urgência</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, urgencia: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rotina">Rotina</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Exames Solicitados *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {examTypes.map((exam) => (
                <div key={exam.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={exam.id}
                    checked={formData.exams.includes(exam.id)}
                    onCheckedChange={(checked) => handleExamChange(exam.id, checked as boolean)}
                  />
                  <label htmlFor={exam.id} className="text-sm cursor-pointer">
                    {exam.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="fasting"
              checked={formData.jejum}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, jejum: checked as boolean }))}
            />
            <label htmlFor="fasting" className="text-sm cursor-pointer">
              Exame requer jejum
            </label>
          </div>

          <div>
            <Label>Preparação Especial</Label>
            <Textarea
              value={formData.preparacao}
              onChange={(e) => setFormData(prev => ({ ...prev, preparacao: e.target.value }))}
              placeholder="Instruções especiais de preparação para o exame..."
              rows={2}
            />
          </div>

          <div>
            <Label>Observações Clínicas</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Sintomas, suspeitas diagnósticas, histórico relevante..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Solicitar Exame
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SolicitarExameModal;

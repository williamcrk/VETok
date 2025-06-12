import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NovaEvolucaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  internacaoId: string | null;
  petId: string | null;
}

const NovaEvolucaoModal = ({ open, onOpenChange, onSuccess, internacaoId, petId }: NovaEvolucaoModalProps) => {
  const { toast } = useToast();
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    veterinario_id: '',
    temperatura: '',
    peso_atual: '',
    frequencia_cardiaca: '',
    frequencia_respiratoria: '',
    evolucao: '',
    observacoes: ''
  });

  useEffect(() => {
    if (open) {
      loadVeterinarios();
    }
  }, [open]);

  const loadVeterinarios = async () => {
    const { data, error } = await supabase.from('veterinarios').select('id, nome').eq('is_active', true).order('nome');
    if (error) console.error('Erro ao carregar veterinários:', error);
    else setVeterinarios(data || []);
  };

  const handleSubmit = async () => {
    if (!internacaoId || !petId || !formData.evolucao) {
      toast({
        title: "Erro de Dados",
        description: "Não foi possível identificar o paciente ou a internação. A evolução também é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('evolucoes')
        .insert({
          pet_id: petId,
          internacao_id: internacaoId,
          veterinario_id: formData.veterinario_id || null,
          evolucao: formData.evolucao,
          observacoes: formData.observacoes,
          temperatura: formData.temperatura ? parseFloat(formData.temperatura) : null,
          peso_atual: formData.peso_atual ? parseFloat(formData.peso_atual) : null,
          frequencia_cardiaca: formData.frequencia_cardiaca ? parseInt(formData.frequencia_cardiaca) : null,
          frequencia_respiratoria: formData.frequencia_respiratoria ? parseInt(formData.frequencia_respiratoria) : null,
          data_evolucao: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Evolução Registrada!",
        description: "A evolução foi salva com sucesso.",
      });

      // Reset form
      setFormData({
        veterinario_id: '',
        temperatura: '',
        peso_atual: '',
        frequencia_cardiaca: '',
        frequencia_respiratoria: '',
        evolucao: '',
        observacoes: ''
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao registrar evolução:', error);
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Não foi possível registrar a evolução.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Evolução Clínica</DialogTitle>
          <DialogDescription>
            Registre os sinais vitais e a evolução do paciente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <div>
              <Label>Veterinário Responsável</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, veterinario_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veterinário" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarios.map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>{vet.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <Label htmlFor="temperatura">Temperatura (°C)</Label>
                    <Input id="temperatura" value={formData.temperatura} onChange={(e) => setFormData(prev => ({...prev, temperatura: e.target.value}))} />
                </div>
                <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input id="peso" value={formData.peso_atual} onChange={(e) => setFormData(prev => ({...prev, peso_atual: e.target.value}))} />
                </div>
                <div>
                    <Label htmlFor="fc">FC (bpm)</Label>
                    <Input id="fc" value={formData.frequencia_cardiaca} onChange={(e) => setFormData(prev => ({...prev, frequencia_cardiaca: e.target.value}))} />
                </div>
                <div>
                    <Label htmlFor="fr">FR (rpm)</Label>
                    <Input id="fr" value={formData.frequencia_respiratoria} onChange={(e) => setFormData(prev => ({...prev, frequencia_respiratoria: e.target.value}))} />
                </div>
            </div>
            <div>
              <Label htmlFor="evolucao">Evolução Clínica *</Label>
              <Textarea id="evolucao" value={formData.evolucao} onChange={(e) => setFormData(prev => ({...prev, evolucao: e.target.value}))} placeholder="Descreva aqui a evolução do paciente..." rows={5} />
            </div>
             <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" value={formData.observacoes} onChange={(e) => setFormData(prev => ({...prev, observacoes: e.target.value}))} placeholder="Observações adicionais, se houver..." rows={3}/>
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar Evolução</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaEvolucaoModal;

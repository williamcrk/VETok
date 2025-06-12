import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface NovaReceitaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  receitaParaEditar?: any;
  petId?: string;
  tutorId?: string;
}

const NovaReceitaModal = ({ open, onOpenChange, onSuccess, receitaParaEditar, petId, tutorId }: NovaReceitaModalProps) => {
  const { toast } = useToast();
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  const [formData, setFormData] = useState({ veterinario_id: '', observacoes: '' });
  const [medicamentos, setMedicamentos] = useState([{ medicamento: '', dosagem: '', frequencia: '', duracao: '', instrucoes: '' }]);

  const isEditMode = Boolean(receitaParaEditar);

  useEffect(() => {
    if (open) {
      loadVeterinarios();
      if (isEditMode && receitaParaEditar) {
        // MODO EDIÇÃO
        setFormData({
          veterinario_id: receitaParaEditar.veterinario_id || '',
          observacoes: receitaParaEditar.observacoes || '',
        });
        const itens = receitaParaEditar.itens_receita_digital || [];
        if (itens.length > 0) {
          setMedicamentos(itens.map((item: any) => ({
            medicamento: item.medicamento || '', dosagem: item.dosagem || '', frequencia: item.frequencia || '',
            duracao: item.duracao || '', instrucoes: item.instrucoes || ''
          })));
        } else {
          setMedicamentos([{ medicamento: '', dosagem: '', frequencia: '', duracao: '', instrucoes: '' }]);
        }
      } else {
        // MODO CRIAÇÃO
        setFormData({ veterinario_id: '', observacoes: '' });
        setMedicamentos([{ medicamento: '', dosagem: '', frequencia: '', duracao: '', instrucoes: '' }]);
      }
    }
  }, [open, receitaParaEditar, isEditMode]);

  const loadVeterinarios = async () => {
    const { data, error } = await supabase.from('veterinarios').select('id, nome, crmv').eq('is_active', true).order('nome');
    if (error) console.error('Erro ao carregar veterinários:', error);
    else setVeterinarios(data || []);
  };

  const addMedicamento = () => setMedicamentos([...medicamentos, { medicamento: '', dosagem: '', frequencia: '', duracao: '', instrucoes: '' }]);
  const removeMedicamento = (index: number) => {
    if (medicamentos.length > 1) setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };
  const updateMedicamento = (index: number, field: string, value: string) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index] = { ...newMedicamentos[index], [field]: value };
    setMedicamentos(newMedicamentos);
  };

  const handleSubmit = async () => {
    if (!petId) {
      toast({ title: "Erro", description: "Paciente não selecionado.", variant: "destructive" });
      return;
    }
    
    const receitaData = {
      pet_id: petId,
      tutor_id: tutorId,
      veterinario_id: formData.veterinario_id || null,
      observacoes: formData.observacoes,
      status: 'ativa',
    };

    try {
      let receita;
      if (isEditMode) {
        // Lógica de Edição
        const { data, error } = await supabase.from('receitas_digitais').update(receitaData).eq('id', receitaParaEditar.id).select().single();
        if (error) throw error;
        receita = data;
        await supabase.from('itens_receita_digital').delete().eq('receita_id', receita.id);
        toast({ title: "Sucesso!", description: "Receita atualizada." });
      } else {
        // Lógica de Criação
        const { data, error } = await supabase.from('receitas_digitais').insert(receitaData).select().single();
        if (error) throw error;
        receita = data;
        toast({ title: "Sucesso!", description: "Receita criada." });
      }
      
      const medicamentosValidos = medicamentos.filter(med => med.medicamento.trim());
      if (medicamentosValidos.length > 0) {
        const itensData = medicamentosValidos.map(med => ({ receita_id: receita.id, ...med }));
        const { error: itemError } = await supabase.from('itens_receita_digital').insert(itensData);
        if (itemError) throw itemError;
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao salvar receita:', error);
      toast({ title: "Erro", description: error.message || "Não foi possível salvar a receita.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Receita Digital' : 'Nova Receita Digital'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Altere os dados da receita abaixo.' : 'Crie uma nova receita para o paciente.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Veterinário Responsável</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, veterinario_id: value }))} value={formData.veterinario_id}>
              <SelectTrigger><SelectValue placeholder="Selecione o veterinário" /></SelectTrigger>
              <SelectContent>
                {veterinarios.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>{vet.nome} - {vet.crmv}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Medicamentos</Label>
            {medicamentos.map((med, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2 relative">
                {medicamentos.length > 1 && (
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeMedicamento(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Input placeholder="Medicamento" value={med.medicamento} onChange={(e) => updateMedicamento(index, 'medicamento', e.target.value)} />
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Dosagem (ex: 50mg)" value={med.dosagem} onChange={(e) => updateMedicamento(index, 'dosagem', e.target.value)} />
                  <Input placeholder="Frequência (ex: 12h)" value={med.frequencia} onChange={(e) => updateMedicamento(index, 'frequencia', e.target.value)} />
                  <Input placeholder="Duração (ex: 7 dias)" value={med.duracao} onChange={(e) => updateMedicamento(index, 'duracao', e.target.value)} />
                </div>
                <Textarea placeholder="Instruções adicionais" value={med.instrucoes} onChange={(e) => updateMedicamento(index, 'instrucoes', e.target.value)} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addMedicamento}>Adicionar Medicamento</Button>
          </div>

          <div>
            <Label>Observações Gerais</Label>
            <Textarea placeholder="Observações e recomendações adicionais..." value={formData.observacoes} onChange={(e) => setFormData(prev => ({...prev, observacoes: e.target.value}))} />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Salvar Alterações' : 'Criar Receita'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaReceitaModal;

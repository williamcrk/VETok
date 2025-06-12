
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ConcluirCirurgiaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cirurgia: any;
  onSuccess: () => void;
}

const ConcluirCirurgiaModal = ({ open, onOpenChange, cirurgia, onSuccess }: ConcluirCirurgiaModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    resultado: '',
    complicacoes: '',
    observacoes: '',
    prescricoes: '',
    cuidados: '',
    retorno: ''
  });

  const handleSubmit = () => {
    if (!formData.resultado) {
      toast({
        title: "Erro",
        description: "Descreva o resultado da cirurgia",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cirurgia Concluída!",
      description: `Cirurgia de ${cirurgia?.petName} finalizada com sucesso`,
    });

    // Reset form
    setFormData({
      resultado: '',
      complicacoes: '',
      observacoes: '',
      prescricoes: '',
      cuidados: '',
      retorno: ''
    });

    onSuccess();
    onOpenChange(false);
  };

  if (!cirurgia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concluir Cirurgia</DialogTitle>
          <DialogDescription>
            Finalize a cirurgia de {cirurgia.petName} com as informações pós-operatórias
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-medium">Informações da Cirurgia</h3>
            <p className="text-sm text-gray-600">Paciente: {cirurgia.petName}</p>
            <p className="text-sm text-gray-600">Procedimento: {cirurgia.procedure}</p>
            <p className="text-sm text-gray-600">Veterinário: {cirurgia.veterinarian}</p>
          </div>

          <div>
            <Label>Resultado da Cirurgia *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, resultado: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sucesso completo">Sucesso completo</SelectItem>
                <SelectItem value="Sucesso com observações">Sucesso com observações</SelectItem>
                <SelectItem value="Complicações menores">Complicações menores</SelectItem>
                <SelectItem value="Complicações maiores">Complicações maiores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Complicações (se houver)</Label>
            <Textarea
              value={formData.complicacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, complicacoes: e.target.value }))}
              placeholder="Descreva quaisquer complicações durante o procedimento..."
              rows={3}
            />
          </div>

          <div>
            <Label>Observações Pós-Operatórias</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Estado geral do paciente, tempo de recuperação estimado..."
              rows={3}
            />
          </div>

          <div>
            <Label>Prescrições Pós-Cirúrgicas</Label>
            <Textarea
              value={formData.prescricoes}
              onChange={(e) => setFormData(prev => ({ ...prev, prescricoes: e.target.value }))}
              placeholder="Medicações, anti-inflamatórios, antibióticos..."
              rows={3}
            />
          </div>

          <div>
            <Label>Cuidados Especiais</Label>
            <Textarea
              value={formData.cuidados}
              onChange={(e) => setFormData(prev => ({ ...prev, cuidados: e.target.value }))}
              placeholder="Instruções para o tutor sobre cuidados em casa..."
              rows={3}
            />
          </div>

          <div>
            <Label>Data de Retorno Recomendada</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, retorno: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3 dias">3 dias</SelectItem>
                <SelectItem value="7 dias">7 dias</SelectItem>
                <SelectItem value="15 dias">15 dias</SelectItem>
                <SelectItem value="30 dias">30 dias</SelectItem>
                <SelectItem value="Não necessário">Não necessário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Finalizar Cirurgia
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConcluirCirurgiaModal;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Produto {
  id: string;
  nome: string;
}

interface NovaPrescricaoModalProps {
  internacaoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovaPrescricaoModal = ({ internacaoId, open, onOpenChange, onSuccess }: NovaPrescricaoModalProps) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [dose, setDose] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Buscar apenas produtos categorizados como 'medicamento' ou similar.
    // Adicionar um campo 'categoria' na tabela 'produtos' seria ideal.
    // Por enquanto, buscamos todos.
    const fetchProdutos = async () => {
      const { data, error } = await supabase.from('produtos').select('id, nome').order('nome');
      if (error) console.error('Error fetching produtos:', error);
      else setProdutos(data);
    };

    if (open) {
      fetchProdutos();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedProduto || !dose || !frequencia) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um medicamento, dose e frequência.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('prescricoes_internacao').insert({
      internacao_id: internacaoId,
      produto_id: selectedProduto,
      dose,
      frequencia_horas: parseInt(frequencia),
      instrucoes,
      status: 'Ativa',
    });

    if (error) {
      toast({ title: "Erro ao adicionar prescrição", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Nova prescrição adicionada." });
      onSuccess();
      handleClose();
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSelectedProduto('');
    setDose('');
    setFrequencia('');
    setInstrucoes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Prescrição</DialogTitle>
          <DialogDescription>Detalhe o medicamento e o plano de aplicação para este paciente.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="produto">Medicamento</Label>
            <Select onValueChange={setSelectedProduto} value={selectedProduto}>
              <SelectTrigger id="produto"><SelectValue placeholder="Selecione um medicamento do estoque" /></SelectTrigger>
              <SelectContent>{produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dose">Dose</Label>
            <Input id="dose" value={dose} onChange={e => setDose(e.target.value)} placeholder="Ex: 1 comprimido, 10 ml" />
          </div>
          <div>
            <Label htmlFor="frequencia">Frequência (a cada X horas)</Label>
            <Input id="frequencia" type="number" value={frequencia} onChange={e => setFrequencia(e.target.value)} placeholder="Ex: 8" />
          </div>
          <div>
            <Label htmlFor="instrucoes">Instruções (Opcional)</Label>
            <Textarea id="instrucoes" value={instrucoes} onChange={e => setInstrucoes(e.target.value)} placeholder="Ex: Aplicar com comida" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Adicionar Prescrição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaPrescricaoModal; 
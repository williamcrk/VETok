import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NovoClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovoClienteModal = ({ open, onOpenChange, onSuccess }: NovoClienteModalProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!nome || !telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são necessários.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('tutores').insert({
      nome,
      email,
      telefone,
    });

    if (error) {
      toast({ title: "Erro ao cadastrar cliente", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Novo cliente cadastrado." });
      onSuccess();
      handleClose();
    }
    setIsSubmitting(false);
  };
  
  const handleClose = () => {
      setNome('');
      setEmail('');
      setTelefone('');
      onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>Preencha os dados do tutor.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone / WhatsApp</Label>
            <Input id="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoClienteModal; 
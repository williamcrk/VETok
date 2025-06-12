import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DarAltaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  internacaoId: string;
  onSuccess: () => void;
}

const DarAltaModal = ({ isOpen, onOpenChange, internacaoId, onSuccess }: DarAltaModalProps) => {
  const [motivoAlta, setMotivoAlta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirmarAlta = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('internacoes')
        .update({
          data_alta: new Date().toISOString(),
          status: 'concluida',
          motivo_alta: motivoAlta,
        })
        .eq('id', internacaoId);

      if (error) {
        throw error;
      }

      onSuccess();
      setMotivoAlta(''); // Reset state
    } catch (error: any) {
      toast({
        title: 'Erro ao dar alta',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Alta do Paciente</DialogTitle>
          <DialogDescription>
            Descreva o motivo da alta ou as observações finais para o tratamento. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Ex: Animal recuperado, tratamento finalizado com sucesso."
            value={motivoAlta}
            onChange={(e) => setMotivoAlta(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarAlta} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar Alta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DarAltaModal; 
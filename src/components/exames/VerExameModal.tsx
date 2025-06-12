
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerExameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exame: any;
}

const VerExameModal = ({ open, onOpenChange, exame }: VerExameModalProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: "Resultado do exame está sendo baixado",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Resultado do Exame - ${exame?.petName}`,
        text: `Resultado do exame ${exame?.type} do paciente ${exame?.petName}`,
      });
    } else {
      toast({
        title: "Compartilhamento",
        description: "Use o botão de download para compartilhar",
      });
    }
  };

  if (!exame) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultado do Exame</DialogTitle>
          <DialogDescription>
            Visualizar resultado completo do exame
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Informações do Paciente</h3>
                <p className="text-sm text-gray-600">Paciente: {exame.petName}</p>
                <p className="text-sm text-gray-600">Tutor: {exame.owner}</p>
                <p className="text-sm text-gray-600">Data: {exame.date}</p>
              </div>
              <div>
                <h3 className="font-medium">Informações do Exame</h3>
                <p className="text-sm text-gray-600">Tipo: {exame.type}</p>
                <p className="text-sm text-gray-600">Veterinário: {exame.veterinarian}</p>
                <Badge className={exame.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {exame.status}
                </Badge>
              </div>
            </div>
          </div>

          {exame.status === 'Concluído' && exame.results ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Resultados</h3>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm whitespace-pre-line">
                    {exame.results}
                  </p>
                </div>
              </div>

              {exame.interpretation && (
                <div>
                  <h3 className="font-medium mb-2">Interpretação</h3>
                  <div className="bg-green-50 p-3 rounded border">
                    <p className="text-sm">
                      {exame.interpretation}
                    </p>
                  </div>
                </div>
              )}

              {exame.recommendations && (
                <div>
                  <h3 className="font-medium mb-2">Recomendações</h3>
                  <div className="bg-blue-50 p-3 rounded border">
                    <p className="text-sm">{exame.recommendations}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-yellow-800">
                {exame.status === 'Pendente' 
                  ? 'Exame ainda em processamento. Resultados disponíveis em breve.'
                  : 'Aguardando resultados do laboratório.'
                }
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </div>
            
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerExameModal;

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Stethoscope } from 'lucide-react';

// Reutilizando a interface de Prontuario da página principal
interface Prontuario {
  id: string;
  data_hora: string;
  conteudo?: string | null;
  status: string;
  pets?: {
    name: string;
    especie: string;
    raca: string;
    tutores?: {
      nome: string;
    };
  };
  veterinarios?: {
    nome: string;
  };
}

interface DetalhesProntuarioModalProps {
  prontuario: Prontuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'pendente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const DetalhesProntuarioModal = ({ prontuario, open, onOpenChange }: DetalhesProntuarioModalProps) => {
  if (!prontuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Atendimento</DialogTitle>
          <DialogDescription>
            Atendimento de {prontuario.pets?.name} em {new Date(prontuario.data_hora).toLocaleDateString('pt-BR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(prontuario.data_hora).toLocaleString('pt-BR')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Tutor: {prontuario.pets?.tutores?.nome}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        <span>Vet.: {prontuario.veterinarios?.nome}</span>
                    </div>
                </div>
                <Badge className={getStatusColor(prontuario.status)}>{prontuario.status}</Badge>
            </div>

            <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: prontuario.conteudo || 'Nenhum conteúdo detalhado fornecido.' }}
            />
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesProntuarioModal; 
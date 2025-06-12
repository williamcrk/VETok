
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scissors, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import ConcluirCirurgiaModal from '@/components/cirurgias/ConcluirCirurgiaModal';
import { useToast } from '@/hooks/use-toast';

const Cirurgias = () => {
  const { toast } = useToast();
  const [isConcluirOpen, setIsConcluirOpen] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState(null);

  const cirurgias = [
    {
      id: '1',
      petName: 'Max',
      owner: 'Ana Costa',
      procedure: 'Castração',
      veterinarian: 'Dr. João Silva',
      date: '16/11/2024',
      time: '09:00',
      status: 'agendada',
      room: 'Centro Cirúrgico 1'
    },
    {
      id: '2',
      petName: 'Bella',
      owner: 'Carlos Lima',
      procedure: 'Cirurgia Ortopédica',
      veterinarian: 'Dra. Maria Santos',
      date: '16/11/2024',
      time: '14:00',
      status: 'em_andamento',
      room: 'Centro Cirúrgico 2'
    },
    {
      id: '3',
      petName: 'Thor',
      owner: 'Sandra Oliveira',
      procedure: 'Remoção de Tumor',
      veterinarian: 'Dr. Pedro Costa',
      date: '15/11/2024',
      time: '10:30',
      status: 'concluida',
      room: 'Centro Cirúrgico 1'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return <Clock className="w-4 h-4" />;
      case 'em_andamento': return <AlertTriangle className="w-4 h-4" />;
      case 'concluida': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleConcluirCirurgia = (cirurgia: any) => {
    setSelectedSurgery(cirurgia);
    setIsConcluirOpen(true);
  };

  const handleIniciarCirurgia = (cirurgia: any) => {
    toast({
      title: "Cirurgia Iniciada",
      description: `Cirurgia de ${cirurgia.petName} foi iniciada`,
    });
  };

  return (
    <PageLayout title="Cirurgias">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Controle de Cirurgias</h2>
            <p className="text-gray-600">Gerencie procedimentos cirúrgicos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{cirurgias.length}</p>
                  <p className="text-sm text-gray-600">Total de Cirurgias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{cirurgias.filter(c => c.status === 'agendada').length}</p>
                  <p className="text-sm text-gray-600">Agendadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{cirurgias.filter(c => c.status === 'em_andamento').length}</p>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{cirurgias.filter(c => c.status === 'concluida').length}</p>
                  <p className="text-sm text-gray-600">Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cirurgias</CardTitle>
            <CardDescription>Procedimentos cirúrgicos agendados e realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cirurgias.map((cirurgia) => (
                <div key={cirurgia.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(cirurgia.status)}
                        <div>
                          <h3 className="font-medium text-lg">{cirurgia.petName}</h3>
                          <p className="text-sm text-gray-600">{cirurgia.owner}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium">{cirurgia.procedure}</p>
                        <p className="text-sm text-gray-600">{cirurgia.room}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium">{cirurgia.veterinarian}</p>
                        <p className="text-sm text-gray-600">{cirurgia.date} - {cirurgia.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(cirurgia.status)}>
                        {cirurgia.status === 'agendada' ? 'Agendada' : 
                         cirurgia.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {cirurgia.status === 'agendada' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleIniciarCirurgia(cirurgia)}
                          >
                            Iniciar
                          </Button>
                        )}
                        {cirurgia.status === 'em_andamento' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleConcluirCirurgia(cirurgia)}
                          >
                            Concluir
                          </Button>
                        )}
                        {cirurgia.status === 'concluida' && (
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ConcluirCirurgiaModal
          open={isConcluirOpen}
          onOpenChange={setIsConcluirOpen}
          cirurgia={selectedSurgery}
          onSuccess={() => {
            // Refresh data
          }}
        />
      </div>
    </PageLayout>
  );
};

export default Cirurgias;

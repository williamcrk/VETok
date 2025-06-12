
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Search, Filter, Clock, Heart, AlertTriangle, 
  FileText, Activity, Thermometer, Droplets
} from 'lucide-react';

interface ProtocoloAnestesia {
  id: string;
  paciente: string;
  cliente: string;
  veterinario: string;
  dataHora: string;
  procedimento: string;
  pesoAnimal: number;
  medicacaoPre: string;
  medicacaoInducao: string;
  medicacaoManutencao: string;
  monitoramento: {
    frequenciaCardiaca: number[];
    frequenciaRespiratoria: number[];
    temperatura: number[];
    pressaoArterial: string[];
    saturacaoO2: number[];
    horarios: string[];
  };
  complicacoes: string;
  recuperacao: {
    inicio: string;
    completa: string;
    observacoes: string;
  };
  status: 'planejado' | 'em_andamento' | 'completado' | 'complicacao';
}

const Anestesia = () => {
  const [protocolos, setProtocolos] = useState<ProtocoloAnestesia[]>([
    {
      id: '1',
      paciente: 'Rex',
      cliente: 'Maria Silva',
      veterinario: 'Dr. João',
      dataHora: '2024-01-15 09:00',
      procedimento: 'Castração',
      pesoAnimal: 15.5,
      medicacaoPre: 'Acepromazina 0.03mg/kg',
      medicacaoInducao: 'Propofol 5mg/kg',
      medicacaoManutencao: 'Isoflurano 1.5%',
      monitoramento: {
        frequenciaCardiaca: [80, 85, 90, 88],
        frequenciaRespiratoria: [16, 18, 20, 19],
        temperatura: [38.2, 37.8, 37.5, 37.7],
        pressaoArterial: ['120/80', '115/75', '118/78', '120/80'],
        saturacaoO2: [98, 97, 98, 99],
        horarios: ['09:15', '09:30', '09:45', '10:00']
      },
      complicacoes: '',
      recuperacao: {
        inicio: '10:15',
        completa: '11:30',
        observacoes: 'Recuperação tranquila, sem intercorrências'
      },
      status: 'completado'
    }
  ]);

  const [novoProtocolo, setNovoProtocolo] = useState<Partial<ProtocoloAnestesia>>({});
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<ProtocoloAnestesia | null>(null);

  const protocolosFiltrados = protocolos.filter(protocolo => {
    const matchBusca = protocolo.paciente.toLowerCase().includes(busca.toLowerCase()) ||
                      protocolo.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      protocolo.procedimento.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || protocolo.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const criarProtocolo = () => {
    const protocolo: ProtocoloAnestesia = {
      id: Date.now().toString(),
      paciente: novoProtocolo.paciente || '',
      cliente: novoProtocolo.cliente || '',
      veterinario: novoProtocolo.veterinario || '',
      dataHora: novoProtocolo.dataHora || '',
      procedimento: novoProtocolo.procedimento || '',
      pesoAnimal: novoProtocolo.pesoAnimal || 0,
      medicacaoPre: novoProtocolo.medicacaoPre || '',
      medicacaoInducao: novoProtocolo.medicacaoInducao || '',
      medicacaoManutencao: novoProtocolo.medicacaoManutencao || '',
      monitoramento: {
        frequenciaCardiaca: [],
        frequenciaRespiratoria: [],
        temperatura: [],
        pressaoArterial: [],
        saturacaoO2: [],
        horarios: []
      },
      complicacoes: '',
      recuperacao: {
        inicio: '',
        completa: '',
        observacoes: ''
      },
      status: 'planejado'
    };

    setProtocolos([...protocolos, protocolo]);
    setNovoProtocolo({});
    setDialogAberto(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'complicacao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planejado': return 'Planejado';
      case 'em_andamento': return 'Em Andamento';
      case 'completado': return 'Completado';
      case 'complicacao': return 'Complicação';
      default: return status;
    }
  };

  return (
    <PageLayout title="Módulo de Anestesia">
      <div className="space-y-6">
        {/* Header com indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Procedimentos Hoje</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-green-600">15</p>
                </div>
                <Heart className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Complicações</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e busca */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Protocolos Anestésicos</CardTitle>
                <CardDescription>Gestão completa de procedimentos anestésicos</CardDescription>
              </div>
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Protocolo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Protocolo Anestésico</DialogTitle>
                    <DialogDescription>
                      Crie um novo protocolo para procedimento anestésico
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Paciente</Label>
                      <Input
                        value={novoProtocolo.paciente || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, paciente: e.target.value})}
                        placeholder="Nome do animal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <Input
                        value={novoProtocolo.cliente || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, cliente: e.target.value})}
                        placeholder="Nome do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Veterinário</Label>
                      <Select onValueChange={(value) => setNovoProtocolo({...novoProtocolo, veterinario: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o veterinário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. João">Dr. João</SelectItem>
                          <SelectItem value="Dra. Ana">Dra. Ana</SelectItem>
                          <SelectItem value="Dr. Carlos">Dr. Carlos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data e Hora</Label>
                      <Input
                        type="datetime-local"
                        value={novoProtocolo.dataHora || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, dataHora: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Procedimento</Label>
                      <Input
                        value={novoProtocolo.procedimento || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, procedimento: e.target.value})}
                        placeholder="Tipo de procedimento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Peso do Animal (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={novoProtocolo.pesoAnimal || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, pesoAnimal: parseFloat(e.target.value)})}
                        placeholder="Peso em kg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medicação Pré-anestésica</Label>
                      <Textarea
                        value={novoProtocolo.medicacaoPre || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, medicacaoPre: e.target.value})}
                        placeholder="Medicações e dosagens"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medicação de Indução</Label>
                      <Textarea
                        value={novoProtocolo.medicacaoInducao || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, medicacaoInducao: e.target.value})}
                        placeholder="Medicações e dosagens"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Medicação de Manutenção</Label>
                      <Textarea
                        value={novoProtocolo.medicacaoManutencao || ''}
                        onChange={(e) => setNovoProtocolo({...novoProtocolo, medicacaoManutencao: e.target.value})}
                        placeholder="Medicações e concentrações"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setDialogAberto(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={criarProtocolo}>
                      Criar Protocolo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por paciente, cliente ou procedimento..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="planejado">Planejado</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="complicacao">Complicação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Veterinário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocolosFiltrados.map((protocolo) => (
                  <TableRow key={protocolo.id}>
                    <TableCell className="font-medium">{protocolo.paciente}</TableCell>
                    <TableCell>{protocolo.cliente}</TableCell>
                    <TableCell>{protocolo.procedimento}</TableCell>
                    <TableCell>{new Date(protocolo.dataHora).toLocaleString()}</TableCell>
                    <TableCell>{protocolo.veterinario}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(protocolo.status)}>
                        {getStatusLabel(protocolo.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setProtocoloSelecionado(protocolo)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detalhes do protocolo selecionado */}
        {protocoloSelecionado && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Protocolo - {protocoloSelecionado.paciente}</CardTitle>
              <CardDescription>Monitoramento e informações completas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Medicações</h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Pré-anestésica:</Label>
                      <p className="text-sm text-gray-600">{protocoloSelecionado.medicacaoPre}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Indução:</Label>
                      <p className="text-sm text-gray-600">{protocoloSelecionado.medicacaoInducao}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Manutenção:</Label>
                      <p className="text-sm text-gray-600">{protocoloSelecionado.medicacaoManutencao}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Monitoramento</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>FC: {protocoloSelecionado.monitoramento.frequenciaCardiaca.slice(-1)[0] || 'N/A'} bpm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>FR: {protocoloSelecionado.monitoramento.frequenciaRespiratoria.slice(-1)[0] || 'N/A'} rpm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span>Temp: {protocoloSelecionado.monitoramento.temperatura.slice(-1)[0] || 'N/A'}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-green-500" />
                      <span>SpO2: {protocoloSelecionado.monitoramento.saturacaoO2.slice(-1)[0] || 'N/A'}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {protocoloSelecionado.recuperacao.observacoes && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recuperação</h4>
                  <p className="text-sm text-gray-600">{protocoloSelecionado.recuperacao.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Anestesia;


import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, QrCode, AlertTriangle, Calendar, Pill, DollarSign, Calculator } from 'lucide-react';

const EstoqueAvancado = () => {
  const [medications] = useState([
    {
      name: 'Antibiótico Amoxicilina',
      totalML: 1000,
      usedML: 300,
      availableML: 700,
      pricePerML: 0.10,
      minStock: 200,
      expiryDate: '2025-06-15',
      status: 'Normal'
    },
    {
      name: 'Anti-inflamatório',
      totalML: 500,
      usedML: 450,
      availableML: 50,
      pricePerML: 0.20,
      minStock: 100,
      expiryDate: '2024-12-20',
      status: 'Crítico'
    },
    {
      name: 'Vacina V10',
      totalML: 300,
      usedML: 100,
      availableML: 200,
      pricePerML: 1.50,
      minStock: 50,
      expiryDate: '2025-03-10',
      status: 'Normal'
    }
  ]);

  const calculateDoseCost = (medication: any, mlUsed: number) => {
    return (medication.pricePerML * mlUsed).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Baixo': return 'bg-yellow-100 text-yellow-800';
      case 'Crítico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const [doseCalculator, setDoseCalculator] = useState({
    selectedMedication: '',
    mlToUse: 0
  });

  return (
    <PageLayout title="Estoque Avançado com Controle ML">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Controle Inteligente por ML</h2>
            <p className="text-gray-600">Gestão precisa de medicamentos com cálculo automático de custos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <QrCode className="w-4 h-4 mr-2" />
            Ler QR Code da Nota
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{medications.length}</p>
                  <p className="text-sm text-gray-600">Medicamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{medications.filter(m => m.status === 'Crítico').length}</p>
                  <p className="text-sm text-gray-600">Estoque Crítico</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-600">Próximo ao Vencimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">R$ 485</p>
                  <p className="text-sm text-gray-600">Valor Total Estoque</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Dose</CardTitle>
              <CardDescription>Calcule o custo exato por aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Selecionar Medicamento</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={doseCalculator.selectedMedication}
                  onChange={(e) => setDoseCalculator({...doseCalculator, selectedMedication: e.target.value})}
                >
                  <option value="">Escolher medicamento...</option>
                  {medications.map((med, index) => (
                    <option key={index} value={med.name}>{med.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ML a Aplicar</label>
                <Input 
                  type="number" 
                  placeholder="Ex: 100"
                  value={doseCalculator.mlToUse || ''}
                  onChange={(e) => setDoseCalculator({...doseCalculator, mlToUse: parseFloat(e.target.value) || 0})}
                />
              </div>

              {doseCalculator.selectedMedication && doseCalculator.mlToUse > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selectedMed = medications.find(m => m.name === doseCalculator.selectedMedication);
                    if (!selectedMed) return null;
                    const cost = calculateDoseCost(selectedMed, doseCalculator.mlToUse);
                    return (
                      <div>
                        <h3 className="font-medium text-blue-800">Cálculo da Dose</h3>
                        <p className="text-sm text-blue-600">
                          {doseCalculator.mlToUse}ML × R$ {selectedMed.pricePerML.toFixed(2)}/ML = R$ {cost}
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          Estoque restante: {selectedMed.availableML - doseCalculator.mlToUse}ML
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Calculator className="w-4 h-4 mr-2" />
                Adicionar ao Orçamento
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entrada por QR Code</CardTitle>
              <CardDescription>Adicione produtos automaticamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Escaneie o QR Code da nota fiscal</p>
                <Button className="mt-4" variant="outline">
                  Abrir Scanner
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Último Escaneamento:</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">Nota Fiscal: 12345</p>
                  <p className="text-sm">5 produtos adicionados</p>
                  <p className="text-xs text-gray-500">15/11/2024 - 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medicamentos em Estoque</CardTitle>
            <CardDescription>Controle detalhado por ML com alertas inteligentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{medication.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>R$ {medication.pricePerML.toFixed(2)}/ML</span>
                        <span>Vence: {medication.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-right">
                        <p className="text-lg font-bold">{medication.availableML}ML</p>
                        <p className="text-xs text-gray-500">de {medication.totalML}ML</p>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={medication.status === 'Crítico' ? '#ef4444' : medication.status === 'Baixo' ? '#f59e0b' : '#10b981'}
                            strokeWidth="3"
                            strokeDasharray={`${(medication.availableML / medication.totalML) * 100}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {Math.round((medication.availableML / medication.totalML) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getStatusColor(medication.status)}>
                      {medication.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      R$ {(medication.availableML * medication.pricePerML).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Valor disponível</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Usar
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Repor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default EstoqueAvancado;


import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Package, DollarSign, Plus, Settings, BarChart3 } from 'lucide-react';

const MultiClinicas = () => {
  const [selectedClinic, setSelectedClinic] = useState('veterinaria-x');

  const clinicas = [
    {
      id: 'veterinaria-x',
      name: 'Veterinária X',
      location: 'São Paulo - SP',
      users: 12,
      pets: 1247,
      monthlyRevenue: 85420,
      status: 'Ativa'
    },
    {
      id: 'veterinaria-y',
      name: 'Veterinária Y',
      location: 'Rio de Janeiro - RJ',
      users: 8,
      pets: 834,
      monthlyRevenue: 64380,
      status: 'Ativa'
    }
  ];

  return (
    <PageLayout title="Multi-Clínicas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Gestão Multi-Tenant</h2>
            <p className="text-gray-600">Controle todas as clínicas em um só lugar</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Clínica
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clinicas.map((clinica) => (
            <Card key={clinica.id} className={`cursor-pointer transition-all ${
              selectedClinic === clinica.id ? 'ring-2 ring-blue-500' : ''
            }`} onClick={() => setSelectedClinic(clinica.id)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{clinica.name}</CardTitle>
                      <CardDescription>{clinica.location}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{clinica.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold">{clinica.users}</p>
                    <p className="text-xs text-gray-600">Usuários</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-2xl font-bold">{clinica.pets}</p>
                    <p className="text-xs text-gray-600">Pets</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Receita Mensal</span>
                    <span className="text-lg font-bold text-blue-600">
                      R$ {clinica.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-3 h-3 mr-1" />
                    Configurar
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Relatórios
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default MultiClinicas;

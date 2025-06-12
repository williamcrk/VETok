import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, Phone, Mail, MapPin, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import NovoFornecedorModal from '@/components/fornecedores/NovoFornecedorModal';
import NovoPedidoModal from '@/components/fornecedores/NovoPedidoModal';

const Fornecedores = () => {
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const [suppliers] = useState([
    {
      id: 1,
      name: 'MedVet Distribuidora',
      email: 'contato@medvet.com',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      status: 'Ativo',
      productsCount: 45,
      lastOrder: '2024-11-10',
      rating: 4.8,
      specialties: ['Medicamentos', 'Equipamentos']
    },
    {
      id: 2,
      name: 'Agro Pet Suprimentos',
      email: 'vendas@agropet.com',
      phone: '(11) 91234-5678',
      address: 'Av. Principal, 456 - São Paulo/SP',
      status: 'Ativo',
      productsCount: 32,
      lastOrder: '2024-11-08',
      rating: 4.5,
      specialties: ['Ração', 'Acessórios']
    },
    {
      id: 3,
      name: 'TechVet Equipamentos',
      email: 'suporte@techvet.com',
      phone: '(11) 95555-1234',
      address: 'Rua da Tecnologia, 789 - São Paulo/SP',
      status: 'Pendente',
      productsCount: 18,
      lastOrder: '2024-10-25',
      rating: 4.2,
      specialties: ['Equipamentos', 'Tecnologia']
    }
  ]);

  const [orders] = useState([
    {
      id: 'PED001',
      supplier: 'MedVet Distribuidora',
      date: '2024-11-15',
      items: 8,
      total: 2450.00,
      status: 'Entregue'
    },
    {
      id: 'PED002',
      supplier: 'Agro Pet Suprimentos',
      date: '2024-11-12',
      items: 12,
      total: 1850.00,
      status: 'A Caminho'
    },
    {
      id: 'PED003',
      supplier: 'TechVet Equipamentos',
      date: '2024-11-10',
      items: 3,
      total: 5200.00,
      status: 'Processando'
    }
  ]);

  const [criticalStock] = useState([
    { product: 'Amoxicilina 500mg', supplier: 'MedVet Distribuidora', currentStock: 45, minStock: 100, status: 'Crítico' },
    { product: 'Seringas 10ml', supplier: 'Agro Pet Suprimentos', currentStock: 23, minStock: 50, status: 'Baixo' },
    { product: 'Anti-inflamatório', supplier: 'MedVet Distribuidora', currentStock: 12, minStock: 30, status: 'Crítico' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Inativo': return 'bg-red-100 text-red-800';
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'A Caminho': return 'bg-blue-100 text-blue-800';
      case 'Processando': return 'bg-yellow-100 text-yellow-800';
      case 'Crítico': return 'bg-red-100 text-red-800';
      case 'Baixo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewOrder = (supplierName?: string) => {
    setSelectedSupplier(supplierName || '');
    setIsNewOrderOpen(true);
  };

  return (
    <PageLayout title="Gestão de Fornecedores">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Sistema Completo de Fornecedores</h2>
            <p className="text-gray-600">Gerencie fornecedores, pedidos e estoque crítico</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsNewSupplierOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                  <p className="text-sm text-gray-600">Fornecedores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-gray-600">Pedidos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">95</p>
                  <p className="text-sm text-gray-600">Produtos Cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{criticalStock.length}</p>
                  <p className="text-sm text-gray-600">Estoque Crítico</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="critical">Estoque Crítico</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Fornecedores</CardTitle>
                <CardDescription>Gerencie seus parceiros comerciais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Buscar fornecedor..." className="flex-1" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {suppliers.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{supplier.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {supplier.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {supplier.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {supplier.address}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getStatusColor(supplier.status)}>
                            {supplier.status}
                          </Badge>
                          <div className="mt-2 text-sm">
                            <p className="font-medium">{supplier.productsCount} produtos</p>
                            <p className="text-gray-500">★ {supplier.rating}</p>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {supplier.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleNewOrder(supplier.name)}
                          >
                            Novo Pedido
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos em Andamento</CardTitle>
                <CardDescription>Acompanhe todos os pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">#{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.supplier}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{order.items} itens</p>
                        <p className="text-sm text-gray-600">R$ {order.total.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Rastrear
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical">
            <Card>
              <CardHeader>
                <CardTitle>Estoque Crítico - Reposição Automática</CardTitle>
                <CardDescription>Produtos que precisam de reposição urgente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalStock.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product}</h3>
                          <p className="text-sm text-gray-600">{item.supplier}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Estoque: {item.currentStock}</span>
                            <span>Mínimo: {item.minStock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Ignorar
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Pedir Agora
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-800">Pedido Automático Sugerido</h3>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">
                    Sistema detectou 3 produtos críticos. Deseja criar um pedido automático?
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Criar Pedido Automático
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <NovoFornecedorModal
          open={isNewSupplierOpen}
          onOpenChange={setIsNewSupplierOpen}
          onSuccess={() => {
            // Refresh data
          }}
        />

        <NovoPedidoModal
          open={isNewOrderOpen}
          onOpenChange={setIsNewOrderOpen}
          supplierName={selectedSupplier}
          onSuccess={() => {
            // Refresh data
          }}
        />
      </div>
    </PageLayout>
  );
};

export default Fornecedores;

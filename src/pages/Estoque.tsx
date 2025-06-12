
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, AlertTriangle, TrendingDown, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Produto {
  id: string;
  nome: string;
  codigo?: string;
  categoria: string;
  estoque_atual: number;
  estoque_minimo: number;
  preco_custo: number;
  preco_venda: number;
  unidade?: string;
  fabricante?: string;
  descricao?: string;
}

const Estoque = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [stockFilter, setStockFilter] = useState('todos');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showNovoProduto, setShowNovoProduto] = useState(false);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    estoqueNegativo: 0,
    estoqueMinimo: 0,
    valorTotal: 0
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');

      if (error) throw error;

      setProdutos(data || []);

      // Calcular estatísticas
      const total = data?.length || 0;
      const negativo = data?.filter(p => p.estoque_atual < 0).length || 0;
      const minimo = data?.filter(p => p.estoque_atual <= p.estoque_minimo && p.estoque_atual >= 0).length || 0;
      const valor = data?.reduce((sum, p) => sum + (p.estoque_atual * p.preco_custo), 0) || 0;

      setStats({
        totalProdutos: total,
        estoqueNegativo: negativo,
        estoqueMinimo: minimo,
        valorTotal: valor
      });

    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (produto: Produto) => {
    if (produto.estoque_atual < 0) return { label: 'Negativo', color: 'bg-red-100 text-red-800' };
    if (produto.estoque_atual <= produto.estoque_minimo) return { label: 'Mínimo', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.fabricante?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'todos' || produto.categoria === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'negativo') matchesStock = produto.estoque_atual < 0;
    else if (stockFilter === 'minimo') matchesStock = produto.estoque_atual <= produto.estoque_minimo && produto.estoque_atual >= 0;
    else if (stockFilter === 'normal') matchesStock = produto.estoque_atual > produto.estoque_minimo;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <PageLayout title="Estoque">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando estoque...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Estoque">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold">{stats.totalProdutos}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estoque Negativo</p>
                  <p className="text-2xl font-bold text-red-600">{stats.estoqueNegativo}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estoque Mínimo</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.estoqueMinimo}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.valorTotal)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Produtos em Estoque</CardTitle>
                <CardDescription>Gerencie seu inventário de medicamentos e produtos</CardDescription>
              </div>
              <Button 
                onClick={() => setShowNovoProduto(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, código ou fabricante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  <SelectItem value="Medicamento">Medicamento</SelectItem>
                  <SelectItem value="Vacina">Vacina</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Ração">Ração</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status do Estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="normal">Estoque Normal</SelectItem>
                  <SelectItem value="minimo">Estoque Mínimo</SelectItem>
                  <SelectItem value="negativo">Estoque Negativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredProdutos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum produto encontrado</p>
                  <p className="text-sm mt-2">
                    {searchTerm || categoryFilter !== 'todos' ? 'Tente ajustar os filtros' : 'Cadastre o primeiro produto'}
                  </p>
                </div>
              ) : (
                filteredProdutos.map((produto) => {
                  const status = getStockStatus(produto);
                  return (
                    <div key={produto.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{produto.nome}</h3>
                              {produto.codigo && (
                                <Badge variant="outline">#{produto.codigo}</Badge>
                              )}
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="flex gap-4">
                                <span>Categoria: {produto.categoria}</span>
                                <span>Estoque: {produto.estoque_atual} {produto.unidade}</span>
                                <span>Mínimo: {produto.estoque_minimo}</span>
                              </div>
                              <div className="flex gap-4 mt-1">
                                <span>Custo: {formatCurrency(produto.preco_custo)}</span>
                                <span>Venda: {formatCurrency(produto.preco_venda)}</span>
                                {produto.fabricante && <span>Fabricante: {produto.fabricante}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Em desenvolvimento",
                                description: "Funcionalidade de movimentação será implementada em breve.",
                              });
                            }}
                          >
                            Movimentar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Em desenvolvimento",
                                description: "Funcionalidade de edição será implementada em breve.",
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Em desenvolvimento",
                                description: "Funcionalidade de exclusão será implementada em breve.",
                              });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Estoque;

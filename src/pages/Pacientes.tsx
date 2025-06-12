
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Heart, Users, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePetsManagement } from '@/hooks/usePetsManagement';
import { calculateAge } from '@/utils/dateUtils';
import NovoPacienteModal from '@/components/modals/NovoPacienteModal';
import EditarPacienteModal from '@/components/modals/EditarPacienteModal';

interface Pet {
  id: string;
  name: string;
  especie: string;
  raca: string;
  data_nascimento: string;
  peso: number;
  sexo: string;
  cor: string;
  microchip?: string;
  tutor_id: string;
  observacoes?: string;
  tutores?: {
    nome: string;
  };
}

interface Stats {
  totalPacientes: number;
  novosMes: number;
  proxConsultas: number;
}

const Pacientes = () => {
  const { toast } = useToast();
  const { deletePet } = usePetsManagement();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPacientes: 0,
    novosMes: 0,
    proxConsultas: 0
  });

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          tutores (nome)
        `)
        .not('name', 'like', '%(INATIVO)%')
        .order('name');

      if (error) throw error;

      const petsWithName = (data || []).map(pet => ({
        ...pet,
        name: pet.name || 'Nome não informado'
      }));

      setPets(petsWithName);

      // Calcular estatísticas
      const thisMonth = new Date();
      thisMonth.setDate(1);
      
      const novosDoMes = petsWithName.filter(pet => 
        pet.created_at && new Date(pet.created_at) >= thisMonth
      ).length;

      setStats({
        totalPacientes: petsWithName.length,
        novosMes: novosDoMes,
        proxConsultas: 0
      });

    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pacientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setShowEditarModal(true);
  };

  const handleDelete = async (pet: Pet) => {
    const success = await deletePet(pet);
    if (success) {
      loadPacientes();
    }
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.tutores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpeciesIcon = (especie: string) => {
    switch (especie) {
      case 'Cão': return '🐕';
      case 'Gato': return '🐱';
      case 'Ave': return '🐦';
      case 'Roedor': return '🐹';
      case 'Réptil': return '🦎';
      default: return '🐾';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Pacientes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pacientes...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Pacientes">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Pacientes</p>
                  <p className="text-2xl font-bold">{stats.totalPacientes}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Novos este Mês</p>
                  <p className="text-2xl font-bold">{stats.novosMes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Próximas Consultas</p>
                  <p className="text-2xl font-bold">{stats.proxConsultas}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Pacientes</CardTitle>
                <CardDescription>Gerencie todos os pacientes cadastrados</CardDescription>
              </div>
              <Button onClick={() => setShowNovoModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, tutor ou raça..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredPets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum paciente encontrado</p>
                  <p className="text-sm mt-2">
                    {searchTerm ? 'Tente ajustar os filtros de busca' : 'Cadastre o primeiro paciente'}
                  </p>
                </div>
              ) : (
                filteredPets.map((pet) => (
                  <div key={pet.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getSpeciesIcon(pet.especie)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{pet.name}</h3>
                            <Badge variant="outline">{pet.especie}</Badge>
                            {pet.sexo && (
                              <Badge variant={pet.sexo === 'Macho' ? 'default' : 'secondary'}>
                                {pet.sexo}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Tutor: <span className="font-medium">{pet.tutores?.nome}</span></p>
                            <div className="flex gap-4 mt-1">
                              {pet.raca && <span>Raça: {pet.raca}</span>}
                              {pet.data_nascimento && <span>Idade: {calculateAge(pet.data_nascimento)}</span>}
                              {pet.peso && <span>Peso: {pet.peso}kg</span>}
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
                              description: "Funcionalidade de prontuário será implementada em breve.",
                            });
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Ver Prontuário
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pet)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pet)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <NovoPacienteModal
        open={showNovoModal}
        onOpenChange={setShowNovoModal}
        onSuccess={loadPacientes}
      />

      <EditarPacienteModal
        open={showEditarModal}
        onOpenChange={setShowEditarModal}
        pet={selectedPet}
        onSuccess={loadPacientes}
      />
    </PageLayout>
  );
};

export default Pacientes;

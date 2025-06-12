import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, Phone, Mail, User, Dog } from 'lucide-react';
import NovoClienteModal from '@/components/clientes/NovoClienteModal';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id: string;
  name: string;
}

interface Tutor {
  id: string;
  nome: string;
  pets: Pet[];
}

const Clientes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTutoresComPets();
  }, []);

  const fetchTutoresComPets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tutores')
      .select(`
        id,
        nome,
        pets (id, name)
      `)
      .order('nome', { ascending: true });

    if (error) {
      console.error("Erro ao buscar clientes:", error);
    } else if (data) {
      setTutores(data);
    }
    setLoading(false);
  };

  const handlePetClick = (petId: string) => {
    navigate(`/paciente/${petId}/historico`);
  };
  
  const filteredTutores = tutores.filter(tutor => 
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.pets.some(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClient = () => {
    fetchTutoresComPets();
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando clientes...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Clientes e Pacientes</h1>
            <p className="text-gray-600">Gerencie os tutores e seus pets.</p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Buscar por nome do tutor ou pet..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTutores.map(tutor => (
          <div key={tutor.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              {tutor.nome}
            </h2>
            <div className="pl-8 mt-2 space-y-2">
              {tutor.pets.length > 0 ? tutor.pets.map(pet => (
                <div key={pet.id} onClick={() => handlePetClick(pet.id)} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer w-fit">
                  <Dog className="w-4 h-4" />
                  <span>{pet.name}</span>
                </div>
              )) : <p className="text-sm text-gray-500">Nenhum pet cadastrado.</p>}
            </div>
          </div>
        ))}
      </div>

      {filteredTutores.length === 0 && !loading && (
        <div className="text-center py-10">
          <p>Nenhum cliente encontrado.</p>
        </div>
      )}

      <NovoClienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleAddClient}
      />
    </PageLayout>
  );
};

export default Clientes; 

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id: string;
  name: string;
  especie: string;
  raca: string;
  tutores?: {
    nome: string;
    telefone: string;
  };
}

interface BuscaPacienteInteligenteProps {
  onSelect: (pet: Pet) => void;
  placeholder?: string;
  className?: string;
}

const BuscaPacienteInteligente = ({ onSelect, placeholder = "Buscar paciente...", className = "" }: BuscaPacienteInteligenteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.tutores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.raca.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPets(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, pets]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select(`
          id,
          name,
          especie,
          raca,
          tutores (
            nome,
            telefone
          )
        `)
        .order('name');

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (pet: Pet) => {
    setSearchTerm(pet.name);
    setShowResults(false);
    onSelect(pet);
  };

  const getSpeciesIcon = (especie: string) => {
    return especie.toLowerCase() === 'cão' ? '🐕' : 
           especie.toLowerCase() === 'gato' ? '🐱' : '🐾';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10"
        />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm">Buscando...</p>
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Heart className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum paciente encontrado</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredPets.slice(0, 8).map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => handleSelect(pet)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    <span className="text-lg">{getSpeciesIcon(pet.especie)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{pet.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {pet.raca}
                        </Badge>
                      </div>
                      {pet.tutores?.nome && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 truncate">{pet.tutores.nome}</p>
                          {pet.tutores.telefone && (
                            <span className="text-xs text-gray-400">• {pet.tutores.telefone}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredPets.length > 8 && (
                  <div className="text-center py-2 text-xs text-gray-500">
                    E mais {filteredPets.length - 8} resultados...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuscaPacienteInteligente;

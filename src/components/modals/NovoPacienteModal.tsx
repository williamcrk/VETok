import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NovoPacienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Tutor {
  id: string;
  nome: string;
}

const NovoPacienteModal = ({ open, onOpenChange, onSuccess }: NovoPacienteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    especie: '',
    raca: '',
    data_nascimento: '',
    tutor_id: '',
    peso: '',
    sexo: '',
    cor: '',
    microchip: '',
    observacoes: ''
  });

  // Buscar tutores do Supabase
  useEffect(() => {
    if (open) {
      fetchTutores();
    }
  }, [open]);

  const fetchTutores = async () => {
    try {
      const { data, error } = await supabase
        .from('tutores')
        .select('id, nome')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;
      setTutores(data || []);
    } catch (error) {
      console.error('Erro ao buscar tutores:', error);
      toast({
        title: "Aviso",
        description: "Não foi possível carregar os tutores. Você pode criar o paciente mesmo assim.",
        variant: "default",
      });
    }
  };

  // Raças predefinidas por espécie
  const racasPorEspecie = {
    'Cão': [
      'Golden Retriever', 'Labrador', 'Pastor Alemão', 'Bulldog Francês', 
      'Poodle', 'Yorkshire', 'Shih Tzu', 'Border Collie', 'Rottweiler',
      'Husky Siberiano', 'Beagle', 'Dachshund', 'Boxer', 'SRD (Sem Raça Definida)'
    ],
    'Gato': [
      'Siamês', 'Persa', 'Maine Coon', 'British Shorthair', 'Ragdoll',
      'Bengal', 'Sphynx', 'Angorá', 'SRD (Sem Raça Definida)'
    ],
    'Ave': [
      'Canário', 'Periquito', 'Calopsita', 'Papagaio', 'Agapornis',
      'Diamante Gould', 'Mandarim'
    ],
    'Roedor': [
      'Hamster', 'Porquinho da Índia', 'Chinchila', 'Coelho', 'Gerbil'
    ],
    'Réptil': [
      'Iguana', 'Gecko', 'Jabuti', 'Cobra do Milho', 'Pogona'
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do animal é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.especie) {
      toast({
        title: "Erro",
        description: "Espécie é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const petData = {
        name: formData.name.trim(),
        especie: formData.especie,
        raca: formData.raca || 'SRD',
        data_nascimento: formData.data_nascimento || null,
        tutor_id: formData.tutor_id || null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        sexo: formData.sexo || null,
        cor: formData.cor || null,
        microchip: formData.microchip || null,
        observacoes: formData.observacoes || null
      };

      const { error } = await supabase
        .from('pets')
        .insert([petData]);

      if (error) throw error;

      toast({
        title: "Paciente cadastrado!",
        description: `${formData.name} foi cadastrado com sucesso.`,
      });

      // Reset form
      setFormData({
        name: '',
        especie: '',
        raca: '',
        data_nascimento: '',
        tutor_id: '',
        peso: '',
        sexo: '',
        cor: '',
        microchip: '',
        observacoes: ''
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Animal *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nome do pet"
              required
            />
          </div>

          <div>
            <Label htmlFor="tutor">Tutor</Label>
            <Select value={formData.tutor_id} onValueChange={(value) => setFormData({...formData, tutor_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tutor (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {tutores.map((tutor) => (
                  <SelectItem key={tutor.id} value={tutor.id}>
                    {tutor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="especie">Espécie *</Label>
              <Select value={formData.especie} onValueChange={(value) => setFormData({...formData, especie: value, raca: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cão">Cão</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Roedor">Roedor</SelectItem>
                  <SelectItem value="Réptil">Réptil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="raca">Raça</Label>
              <Select value={formData.raca} onValueChange={(value) => setFormData({...formData, raca: value})} disabled={!formData.especie}>
                <SelectTrigger>
                  <SelectValue placeholder={formData.especie ? "Selecione a raça" : "Selecione espécie primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.especie && racasPorEspecie[formData.especie as keyof typeof racasPorEspecie]?.map((raca) => (
                    <SelectItem key={raca} value={raca}>
                      {raca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                placeholder="15.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select value={formData.sexo} onValueChange={(value) => setFormData({...formData, sexo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Fêmea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={formData.cor}
                onChange={(e) => setFormData({...formData, cor: e.target.value})}
                placeholder="Cor do pet"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="microchip">Microchip</Label>
            <Input
              id="microchip"
              value={formData.microchip}
              onChange={(e) => setFormData({...formData, microchip: e.target.value})}
              placeholder="Número do microchip (opcional)"
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações gerais sobre o paciente..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.especie}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPacienteModal;

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilo do editor
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

interface Veterinario {
  id: string;
  nome: string;
  crmv: string;
}

interface ProntuarioTemplate {
    id: string;
    nome: string;
    conteudo: string;
}

interface NovoProntuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovoProntuarioModal = ({ open, onOpenChange, onSuccess }: NovoProntuarioModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [templates, setTemplates] = useState<ProntuarioTemplate[]>([]);
  
  const [formData, setFormData] = useState({
    pet_id: '',
    veterinario_id: '',
    conteudo: '', // Campo unificado para o editor
    status: 'em_andamento'
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [petsRes, vetsRes, templatesRes] = await Promise.all([
        supabase.from('pets').select(`id, name, especie, raca, tutores(nome, telefone)`).order('name'),
        supabase.from('veterinarios').select('id, nome, crmv').order('nome'),
        supabase.from('prontuario_templates').select('*').order('nome')
      ]);

      setPets(petsRes.data || []);
      setVeterinarios(vetsRes.data || []);
      setTemplates(templatesRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados do modal:', error);
      toast({ title: "Erro", description: "Falha ao carregar dados para o formulário.", variant: 'destructive' });
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        setFormData(prev => ({...prev, conteudo: template.conteudo}));
    }
  }

  const handleSubmit = async () => {
    if (!formData.pet_id || !formData.conteudo) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (Pet e o conteúdo do prontuário)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const atendimentoData = {
        pet_id: formData.pet_id,
        veterinario_id: formData.veterinario_id || null,
        data_hora: new Date().toISOString(),
        conteudo: formData.conteudo, // Salva o HTML do editor
        status: formData.status,
        // Os campos antigos (anamnese, diagnostico, etc.) não são mais preenchidos aqui
      };

      const { error } = await supabase
        .from('atendimentos')
        .insert([atendimentoData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Prontuário criado com sucesso",
      });

      setFormData({
        pet_id: '',
        veterinario_id: '',
        conteudo: '',
        status: 'em_andamento'
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar prontuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o prontuário: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Novo Prontuário de Atendimento</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Paciente *</Label>
              <Select value={formData.pet_id} onValueChange={(value) => setFormData(prev => ({ ...prev, pet_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.especie}) - {pet.tutores?.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Veterinário</Label>
              <Select value={formData.veterinario_id} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinario_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veterinário" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarios.map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>
                      {vet.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Usar Template</Label>
              <Select onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>

        <div className="flex-grow min-h-[300px]">
             <ReactQuill
                theme="snow"
                value={formData.conteudo}
                onChange={(content) => setFormData(prev => ({ ...prev, conteudo: content }))}
                modules={quillModules}
                className="h-full"
              />
        </div>

        <div className="flex justify-between items-center pt-4">
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Salvando...' : 'Salvar Prontuário'}
              </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoProntuarioModal;

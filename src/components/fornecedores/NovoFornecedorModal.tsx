
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NovoFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const NovoFornecedorModal = ({ open, onOpenChange, onSuccess }: NovoFornecedorModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    cnpj: '',
    contact: '',
    specialties: [],
    paymentTerms: '',
    deliveryTime: '',
    observations: ''
  });

  const specialtyOptions = [
    'Medicamentos',
    'Equipamentos',
    'Ração',
    'Acessórios',
    'Material Cirúrgico',
    'Tecnologia',
    'Limpeza'
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: `Fornecedor ${formData.name} cadastrado com sucesso`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      cnpj: '',
      contact: '',
      specialties: [],
      paymentTerms: '',
      deliveryTime: '',
      observations: ''
    });

    onSuccess();
    onOpenChange(false);
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Fornecedor</DialogTitle>
          <DialogDescription>
            Cadastre um novo fornecedor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome da Empresa *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: MedVet Distribuidora"
              />
            </div>
            <div>
              <Label>CNPJ</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <Label>Contato Responsável</Label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="João Silva"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Telefone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 9999-9999"
              />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="11999999999"
              />
            </div>
          </div>

          <div>
            <Label>Endereço</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div>
            <Label>Especialidades</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {specialtyOptions.map((specialty) => (
                <label key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prazo de Pagamento</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="À vista">À vista</SelectItem>
                  <SelectItem value="15 dias">15 dias</SelectItem>
                  <SelectItem value="30 dias">30 dias</SelectItem>
                  <SelectItem value="45 dias">45 dias</SelectItem>
                  <SelectItem value="60 dias">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prazo de Entrega</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTime: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="48h">48 horas</SelectItem>
                  <SelectItem value="3-5 dias">3-5 dias úteis</SelectItem>
                  <SelectItem value="1 semana">1 semana</SelectItem>
                  <SelectItem value="2 semanas">2 semanas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Informações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Cadastrar Fornecedor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoFornecedorModal;

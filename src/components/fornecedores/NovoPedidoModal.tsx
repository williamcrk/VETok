
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Mail } from 'lucide-react';

interface NovoPedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierName?: string;
  onSuccess: () => void;
}

const NovoPedidoModal = ({ open, onOpenChange, supplierName, onSuccess }: NovoPedidoModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    supplier: supplierName || '',
    items: [{ product: '', quantity: '', unit: 'unidade' }],
    urgency: 'normal',
    deliveryDate: '',
    observations: '',
    customMessage: ''
  });

  const suppliers = [
    'MedVet Distribuidora',
    'Agro Pet Suprimentos', 
    'TechVet Equipamentos'
  ];

  const urgencyLevels = [
    { value: 'baixa', label: 'Baixa', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'alta', label: 'Alta', color: 'text-orange-600' },
    { value: 'urgente', label: 'Urgente', color: 'text-red-600' }
  ];

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: '', unit: 'unidade' }]
    }));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const generateMessage = () => {
    const urgencyEmoji = {
      baixa: '🟢',
      normal: '🔵', 
      alta: '🟠',
      urgente: '🔴'
    };

    const itemsList = formData.items
      .filter(item => item.product && item.quantity)
      .map(item => `• ${item.product} - ${item.quantity} ${item.unit}`)
      .join('\n');

    return `Olá! 👋

Gostaria de fazer um pedido:

📦 *ITENS SOLICITADOS:*
${itemsList}

${urgencyEmoji[formData.urgency]} *Urgência:* ${urgencyLevels.find(u => u.value === formData.urgency)?.label}

${formData.deliveryDate ? `📅 *Entrega desejada:* ${new Date(formData.deliveryDate).toLocaleDateString()}\n` : ''}
${formData.observations ? `📝 *Observações:* ${formData.observations}\n` : ''}
${formData.customMessage ? `\n${formData.customMessage}\n` : ''}
Aguardo retorno com prazo e valores.

*VetPrime* 🐾`;
  };

  const sendViaWhatsApp = () => {
    if (!formData.supplier) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor",
        variant: "destructive",
      });
      return;
    }

    const message = generateMessage();
    // Simular número do fornecedor
    const phone = '11999999999';
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
    
    toast({
      title: "Pedido Enviado!",
      description: `Pedido enviado via WhatsApp para ${formData.supplier}`,
    });

    onSuccess();
    onOpenChange(false);
  };

  const sendViaEmail = () => {
    if (!formData.supplier) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor",
        variant: "destructive",
      });
      return;
    }

    const message = generateMessage();
    const subject = `Pedido VetPrime - ${urgencyLevels.find(u => u.value === formData.urgency)?.label}`;
    
    // Simular envio por email
    toast({
      title: "Pedido Enviado!",
      description: `Pedido enviado por e-mail para ${formData.supplier}`,
    });

    // Aqui você pode implementar a lógica real de envio de email
    console.log('Email enviado:', { to: formData.supplier, subject, message });

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Envie um pedido diretamente via WhatsApp ou e-mail
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Fornecedor *</Label>
            <Select 
              value={formData.supplier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Itens do Pedido</Label>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                + Adicionar Item
              </Button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Produto"
                  value={item.product}
                  onChange={(e) => updateItem(index, 'product', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Qtd"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  className="w-20"
                />
                <Select 
                  value={item.unit}
                  onValueChange={(value) => updateItem(index, 'unit', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidade">un</SelectItem>
                    <SelectItem value="caixa">cx</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="litro">L</SelectItem>
                  </SelectContent>
                </Select>
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    variant="outline"
                    size="sm"
                    className="px-2"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Urgência</Label>
              <Select 
                value={formData.urgency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data de Entrega Desejada</Label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Informações adicionais sobre o pedido..."
              rows={2}
            />
          </div>

          <div>
            <Label>Mensagem Personalizada</Label>
            <Textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              placeholder="Adicione uma mensagem personalizada (opcional)..."
              rows={2}
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Prévia da Mensagem:</Label>
            <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
              {generateMessage()}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={sendViaEmail} variant="outline" className="text-blue-600">
              <Mail className="w-4 h-4 mr-2" />
              Enviar E-mail
            </Button>
            <Button onClick={sendViaWhatsApp} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPedidoModal;

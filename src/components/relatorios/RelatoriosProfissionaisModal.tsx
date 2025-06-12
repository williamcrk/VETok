
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Printer, Share } from 'lucide-react';

interface RelatoriosProfissionaisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RelatoriosProfissionaisModal = ({ open, onOpenChange }: RelatoriosProfissionaisModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    veterinario_id: '',
    periodo_inicio: '',
    periodo_fim: '',
    tipo_relatorio: '',
    formato: 'pdf',
    incluir_logo: true,
    incluir_assinatura: true,
    observacoes: ''
  });

  useEffect(() => {
    if (open) {
      loadVeterinarios();
    }
  }, [open]);

  const loadVeterinarios = async () => {
    try {
      const { data, error } = await supabase
        .from('veterinarios')
        .select('id, nome, crmv')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;
      setVeterinarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar veterinários:', error);
    }
  };

  const gerarRelatorio = async () => {
    if (!formData.veterinario_id || !formData.tipo_relatorio) {
      toast({
        title: "Erro",
        description: "Selecione o veterinário e tipo de relatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simular geração de relatório profissional
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Dados do relatório baseados no tipo selecionado
      const relatorioData = {
        veterinario: veterinarios.find(v => v.id === formData.veterinario_id),
        periodo: `${formData.periodo_inicio} a ${formData.periodo_fim}`,
        tipo: formData.tipo_relatorio,
        gerado_em: new Date().toLocaleString('pt-BR'),
        incluir_logo: formData.incluir_logo,
        incluir_assinatura: formData.incluir_assinatura
      };

      console.log('Relatório gerado:', relatorioData);

      toast({
        title: "Relatório Gerado!",
        description: `Relatório ${formData.tipo_relatorio} está sendo preparado para download`,
      });

      // Reset form
      setFormData({
        veterinario_id: '',
        periodo_inicio: '',
        periodo_fim: '',
        tipo_relatorio: '',
        formato: 'pdf',
        incluir_logo: true,
        incluir_assinatura: true,
        observacoes: ''
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Relatórios Profissionais
          </DialogTitle>
          <DialogDescription>
            Gere relatórios profissionais com formatação automática e marca d'água
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Veterinário *</Label>
            <Select value={formData.veterinario_id} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinario_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veterinário" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.nome} - {vet.crmv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Período Inicial</Label>
              <Input
                type="date"
                value={formData.periodo_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, periodo_inicio: e.target.value }))}
              />
            </div>
            <div>
              <Label>Período Final</Label>
              <Input
                type="date"
                value={formData.periodo_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, periodo_fim: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Tipo de Relatório *</Label>
            <Select value={formData.tipo_relatorio} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_relatorio: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atendimentos">Relatório de Atendimentos</SelectItem>
                <SelectItem value="performance">Relatório de Performance</SelectItem>
                <SelectItem value="comissoes">Relatório de Comissões</SelectItem>
                <SelectItem value="procedimentos">Relatório de Procedimentos</SelectItem>
                <SelectItem value="financeiro">Relatório Financeiro Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Formato de Exportação</Label>
              <Select value={formData.formato} onValueChange={(value) => setFormData(prev => ({ ...prev, formato: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 pt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluir-logo"
                  checked={formData.incluir_logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, incluir_logo: e.target.checked }))}
                />
                <Label htmlFor="incluir-logo" className="text-sm">Logo da clínica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluir-assinatura"
                  checked={formData.incluir_assinatura}
                  onChange={(e) => setFormData(prev => ({ ...prev, incluir_assinatura: e.target.checked }))}
                />
                <Label htmlFor="incluir-assinatura" className="text-sm">Assinatura digital</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Observações Adicionais</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações que aparecerão no relatório..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={gerarRelatorio} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatoriosProfissionaisModal;

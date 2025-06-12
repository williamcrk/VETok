
import { supabase } from '@/integrations/supabase/client';

interface AutomationEvent {
  type: 'medicacao_aplicada' | 'alta_internamento' | 'entrada_medicamento' | 'agendamento_consulta';
  data: any;
  petId?: string;
  clienteId?: string;
  produtoId?: string;
}

class AutomationService {
  async processEvent(event: AutomationEvent): Promise<void> {
    console.log('Processando evento de automação:', event);

    try {
      switch (event.type) {
        case 'medicacao_aplicada':
          await this.processarMedicacaoAplicada(event);
          break;
        case 'alta_internamento':
          await this.processarAltaInternamento(event);
          break;
        case 'entrada_medicamento':
          await this.processarEntradaMedicamento(event);
          break;
        case 'agendamento_consulta':
          await this.processarAgendamentoConsulta(event);
          break;
        default:
          console.warn('Tipo de evento não reconhecido:', event.type);
      }
    } catch (error) {
      console.error('Erro ao processar evento de automação:', error);
      throw error;
    }
  }

  private async processarMedicacaoAplicada(event: AutomationEvent): Promise<void> {
    const { produtoId, quantidade, petId, atendimentoId } = event.data;

    // 1. Baixa automática no estoque
    await this.baixarEstoque(produtoId, quantidade);

    // 2. Adiciona ao orçamento do cliente
    await this.adicionarAoOrcamento(petId, produtoId, quantidade, atendimentoId);

    // 3. Registra no prontuário
    await this.registrarNoProntuario(petId, atendimentoId, {
      tipo: 'medicacao',
      descricao: `Medicação aplicada - Produto ID: ${produtoId}, Quantidade: ${quantidade}`
    });

    // 4. Verifica estoque mínimo e notifica se necessário
    await this.verificarEstoqueMinimo(produtoId);
  }

  private async processarAltaInternamento(event: AutomationEvent): Promise<void> {
    const { internamentoId, petId } = event.data;

    // 1. Gera relatório PDF de alta
    await this.gerarRelatorioAlta(internamentoId);

    // 2. Encerra cobranças pendentes
    await this.encerrarCobrancasPendentes(petId);

    // 3. Libera leito/espaço
    await this.liberarLeito(internamentoId);

    // 4. Atualiza prontuário com informações de alta
    await this.registrarNoProntuario(petId, null, {
      tipo: 'alta_internamento',
      descricao: 'Paciente recebeu alta médica'
    });
  }

  private async processarEntradaMedicamento(event: AutomationEvent): Promise<void> {
    const { produtoId, quantidade, precoUnitario } = event.data;

    // 1. Atualiza estoque
    await this.atualizarEstoque(produtoId, quantidade);

    // 2. Atualiza preço de venda baseado no custo
    await this.atualizarPrecoVenda(produtoId, precoUnitario);

    // 3. Remove alertas de estoque baixo se aplicável
    await this.removerAlertesEstoque(produtoId);
  }

  private async processarAgendamentoConsulta(event: AutomationEvent): Promise<void> {
    const { petId, tutorId, dataConsulta, tipoConsulta } = event.data;

    // 1. Envia notificação para o tutor
    await this.enviarNotificacaoTutor(tutorId, {
      tipo: 'agendamento_confirmado',
      mensagem: `Consulta agendada para ${new Date(dataConsulta).toLocaleDateString('pt-BR')}`,
      petId
    });

    // 2. Agenda lembrete automático
    await this.agendarLembrete(tutorId, petId, dataConsulta);
  }

  // Métodos auxiliares
  private async baixarEstoque(produtoId: string, quantidade: number): Promise<void> {
    const { data: produto } = await supabase
      .from('produtos')
      .select('estoque_atual')
      .eq('id', produtoId)
      .single();

    if (produto) {
      const novoEstoque = Math.max(0, produto.estoque_atual - quantidade);
      
      await supabase
        .from('produtos')
        .update({ estoque_atual: novoEstoque })
        .eq('id', produtoId);

      // Registra movimentação
      await supabase
        .from('movimentacao_estoque')
        .insert({
          produto_id: produtoId,
          tipo: 'saida',
          quantidade: quantidade,
          motivo: 'Medicação aplicada - automação',
          data_movimentacao: new Date().toISOString()
        });
    }
  }

  private async adicionarAoOrcamento(petId: string, produtoId: string, quantidade: number, atendimentoId: string | null): Promise<void> {
    // Buscar dados do produto
    const { data: produto } = await supabase
      .from('produtos')
      .select('preco_venda, nome')
      .eq('id', produtoId)
      .single();

    if (produto && atendimentoId) {
      // Buscar dados do atendimento para pegar tutor_id
      const { data: atendimento } = await supabase
        .from('atendimentos')
        .select('pet_id')
        .eq('id', atendimentoId)
        .single();

      if (atendimento) {
        // Buscar tutor_id através do pet
        const { data: pet } = await supabase
          .from('pets')
          .select('tutor_id')
          .eq('id', atendimento.pet_id)
          .single();

        if (pet && pet.tutor_id) {
          const valorTotal = produto.preco_venda * quantidade;

          // Criar ou atualizar registro financeiro
          await supabase
            .from('financeiro')
            .insert({
              atendimento_id: atendimentoId,
              tutor_id: pet.tutor_id,
              valor_total: valorTotal,
              status: 'pendente',
              forma_pagamento: null
            });

          // Adicionar item específico
          await supabase
            .from('itens_financeiro')
            .insert({
              tipo: 'produto',
              produto_id: produtoId,
              quantidade: quantidade,
              valor_unitario: produto.preco_venda,
              valor_total: valorTotal
            });
        }
      }
    }
  }

  private async registrarNoProntuario(petId: string, atendimentoId: string | null, registro: { tipo: string; descricao: string }): Promise<void> {
    // Se há atendimento ativo, adiciona às observações
    if (atendimentoId) {
      const { data: atendimento } = await supabase
        .from('atendimentos')
        .select('observacoes')
        .eq('id', atendimentoId)
        .single();

      const observacoesAtuais = atendimento?.observacoes || '';
      const novaObservacao = `${observacoesAtuais}\n[${new Date().toLocaleString('pt-BR')}] ${registro.descricao}`;

      await supabase
        .from('atendimentos')
        .update({ observacoes: novaObservacao })
        .eq('id', atendimentoId);
    }
  }

  private async verificarEstoqueMinimo(produtoId: string): Promise<void> {
    const { data: produto } = await supabase
      .from('produtos')
      .select('nome, estoque_atual, estoque_minimo')
      .eq('id', produtoId)
      .single();

    if (produto && produto.estoque_atual <= produto.estoque_minimo) {
      console.log(`⚠️ ALERTA: Estoque baixo para ${produto.nome}. Atual: ${produto.estoque_atual}, Mínimo: ${produto.estoque_minimo}`);
      
      // Aqui poderia enviar notificação real via email/WhatsApp
      // Por enquanto, apenas log
    }
  }

  private async gerarRelatorioAlta(internamentoId: string): Promise<void> {
    console.log(`Gerando relatório de alta para internamento ${internamentoId}`);
    // Implementar geração de PDF
  }

  private async encerrarCobrancasPendentes(petId: string): Promise<void> {
    console.log(`Encerrando cobranças pendentes para pet ${petId}`);
    // Implementar lógica de encerramento
  }

  private async liberarLeito(internamentoId: string): Promise<void> {
    await supabase
      .from('internamentos')
      .update({ 
        status: 'Alta',
        data_saida: new Date().toISOString()
      })
      .eq('id', internamentoId);
  }

  private async atualizarEstoque(produtoId: string, quantidade: number): Promise<void> {
    const { data: produto } = await supabase
      .from('produtos')
      .select('estoque_atual')
      .eq('id', produtoId)
      .single();

    if (produto) {
      const novoEstoque = produto.estoque_atual + quantidade;
      
      await supabase
        .from('produtos')
        .update({ estoque_atual: novoEstoque })
        .eq('id', produtoId);

      // Registra movimentação
      await supabase
        .from('movimentacao_estoque')
        .insert({
          produto_id: produtoId,
          tipo: 'entrada',
          quantidade: quantidade,
          motivo: 'Entrada de produto - automação',
          data_movimentacao: new Date().toISOString()
        });
    }
  }

  private async atualizarPrecoVenda(produtoId: string, precoUnitario: number): Promise<void> {
    // Aplica margem de 60% sobre o custo
    const precoVenda = precoUnitario * 1.6;
    
    await supabase
      .from('produtos')
      .update({ 
        preco_custo: precoUnitario,
        preco_venda: precoVenda 
      })
      .eq('id', produtoId);
  }

  private async removerAlertesEstoque(produtoId: string): Promise<void> {
    console.log(`Removendo alertas de estoque para produto ${produtoId}`);
    // Implementar remoção de alertas
  }

  private async enviarNotificacaoTutor(tutorId: string, notificacao: any): Promise<void> {
    console.log(`Enviando notificação para tutor ${tutorId}:`, notificacao);
    // Implementar envio real via WhatsApp/Email
  }

  private async agendarLembrete(tutorId: string, petId: string, dataConsulta: string): Promise<void> {
    // Agenda lembrete para 1 dia antes
    const dataLembrete = new Date(dataConsulta);
    dataLembrete.setDate(dataLembrete.getDate() - 1);

    await supabase
      .from('lembretes')
      .insert({
        tutor_id: tutorId,
        pet_id: petId,
        titulo: 'Lembrete de Consulta',
        mensagem: 'Você tem uma consulta agendada para amanhã!',
        tipo: 'consulta',
        data_envio: dataLembrete.toISOString(),
        status: 'agendado'
      });
  }
}

// Instância singleton
export const automationService = new AutomationService();

// Funções de conveniência para usar nos componentes
export const triggerMedicacaoAplicada = (produtoId: string, quantidade: number, petId: string, atendimentoId: string) => {
  return automationService.processEvent({
    type: 'medicacao_aplicada',
    data: { produtoId, quantidade, petId, atendimentoId }
  });
};

export const triggerAltaInternamento = (internamentoId: string, petId: string) => {
  return automationService.processEvent({
    type: 'alta_internamento',
    data: { internamentoId, petId }
  });
};

export const triggerEntradaMedicamento = (produtoId: string, quantidade: number, precoUnitario: number) => {
  return automationService.processEvent({
    type: 'entrada_medicamento',
    data: { produtoId, quantidade, precoUnitario }
  });
};

export const triggerAgendamentoConsulta = (petId: string, tutorId: string, dataConsulta: string, tipoConsulta: string) => {
  return automationService.processEvent({
    type: 'agendamento_consulta',
    data: { petId, tutorId, dataConsulta, tipoConsulta }
  });
};

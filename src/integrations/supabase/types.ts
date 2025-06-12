export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agenda_eventos: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          id: string
          observacoes: string | null
          pet_id: string | null
          status: string | null
          tipo: string
          titulo: string
          tutor_id: string | null
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tipo: string
          titulo: string
          tutor_id?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tipo?: string
          titulo?: string
          tutor_id?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_eventos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_eventos_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_eventos_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos: {
        Row: {
          criado_em: string | null
          data: string
          hora: string
          id: string
          motivo: string | null
          paciente_id: string
          status: string | null
        }
        Insert: {
          criado_em?: string | null
          data: string
          hora: string
          id?: string
          motivo?: string | null
          paciente_id: string
          status?: string | null
        }
        Update: {
          criado_em?: string | null
          data?: string
          hora?: string
          id?: string
          motivo?: string | null
          paciente_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          is_return: boolean
          notes: string | null
          pet_id: string
          reminder_sent: boolean
          return_date: string | null
          service_type: string
          status: string
          tutor_id: string
          veterinarian_id: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          is_return?: boolean
          notes?: string | null
          pet_id: string
          reminder_sent?: boolean
          return_date?: string | null
          service_type: string
          status?: string
          tutor_id: string
          veterinarian_id?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          is_return?: boolean
          notes?: string | null
          pet_id?: string
          reminder_sent?: boolean
          return_date?: string | null
          service_type?: string
          status?: string
          tutor_id?: string
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_pet_id"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_tutor_id"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      arquivos: {
        Row: {
          criado_em: string | null
          id: string
          nome_arquivo: string
          paciente_id: string
          tipo: string | null
          url: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome_arquivo: string
          paciente_id: string
          tipo?: string | null
          url: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome_arquivo?: string
          paciente_id?: string
          tipo?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      atendimentos: {
        Row: {
          agendamento_id: string | null
          anamnese: string | null
          clinic_id: string | null
          created_at: string | null
          data_hora: string
          diagnostico: string | null
          id: string
          observacoes: string | null
          pet_id: string | null
          status: string | null
          tratamento: string | null
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          agendamento_id?: string | null
          anamnese?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_hora: string
          diagnostico?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tratamento?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          agendamento_id?: string | null
          anamnese?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_hora?: string
          diagnostico?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tratamento?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_items: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          id: string
          patient_id: string
          quantity: number
          service_type: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          patient_id: string
          quantity: number
          service_type: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          patient_id?: string
          quantity?: number
          service_type?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      cirurgias: {
        Row: {
          anestesia_utilizada: string | null
          atendimento_id: string | null
          clinic_id: string | null
          complicacoes: string | null
          created_at: string | null
          data_agendada: string | null
          data_realizada: string | null
          duracao_minutos: number | null
          id: string
          observacoes: string | null
          pet_id: string | null
          procedimento_detalhado: string | null
          status: string | null
          tipo_cirurgia: string
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          anestesia_utilizada?: string | null
          atendimento_id?: string | null
          clinic_id?: string | null
          complicacoes?: string | null
          created_at?: string | null
          data_agendada?: string | null
          data_realizada?: string | null
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          procedimento_detalhado?: string | null
          status?: string | null
          tipo_cirurgia: string
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          anestesia_utilizada?: string | null
          atendimento_id?: string | null
          clinic_id?: string | null
          complicacoes?: string | null
          created_at?: string | null
          data_agendada?: string | null
          data_realizada?: string | null
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          procedimento_detalhado?: string | null
          status?: string | null
          tipo_cirurgia?: string
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cirurgias_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cirurgias_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cirurgias_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cirurgias_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          clinic_id: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          rg: string | null
          telefone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          clinic_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          clinic_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      clinicas: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinics: {
        Row: {
          address: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comissoes: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          financeiro_id: string | null
          id: string
          percentual: number
          status: string | null
          updated_at: string | null
          valor_base: number
          valor_comissao: number
          veterinario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          financeiro_id?: string | null
          id?: string
          percentual: number
          status?: string | null
          updated_at?: string | null
          valor_base: number
          valor_comissao: number
          veterinario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          financeiro_id?: string | null
          id?: string
          percentual?: number
          status?: string | null
          updated_at?: string | null
          valor_base?: number
          valor_comissao?: number
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comissoes_financeiro_id_fkey"
            columns: ["financeiro_id"]
            isOneToOne: false
            referencedRelation: "financeiro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas: {
        Row: {
          criado_em: string | null
          data_consulta: string
          diagnostico: string | null
          hora_consulta: string | null
          id: string
          paciente_id: string
          recomendacoes: string | null
          sintomas: string | null
        }
        Insert: {
          criado_em?: string | null
          data_consulta: string
          diagnostico?: string | null
          hora_consulta?: string | null
          id?: string
          paciente_id: string
          recomendacoes?: string | null
          sintomas?: string | null
        }
        Update: {
          criado_em?: string | null
          data_consulta?: string
          diagnostico?: string | null
          hora_consulta?: string | null
          id?: string
          paciente_id?: string
          recomendacoes?: string | null
          sintomas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      evolucoes: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_evolucao: string | null
          evolucao: string
          frequencia_cardiaca: number | null
          frequencia_respiratoria: number | null
          id: string
          internacao_id: string | null
          observacoes: string | null
          peso_atual: number | null
          pet_id: string | null
          temperatura: number | null
          veterinario_id: string | null
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_evolucao?: string | null
          evolucao: string
          frequencia_cardiaca?: number | null
          frequencia_respiratoria?: number | null
          id?: string
          internacao_id?: string | null
          observacoes?: string | null
          peso_atual?: number | null
          pet_id?: string | null
          temperatura?: number | null
          veterinario_id?: string | null
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_evolucao?: string | null
          evolucao?: string
          frequencia_cardiaca?: number | null
          frequencia_respiratoria?: number | null
          id?: string
          internacao_id?: string | null
          observacoes?: string | null
          peso_atual?: number | null
          pet_id?: string | null
          temperatura?: number | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolucoes_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_internacao_id_fkey"
            columns: ["internacao_id"]
            isOneToOne: false
            referencedRelation: "internacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      exames: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_resultado: string | null
          data_solicitacao: string | null
          id: string
          interpretacao: string | null
          observacoes: string | null
          pet_id: string | null
          resultado: string | null
          status: string | null
          tipo_exame: string
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_resultado?: string | null
          data_solicitacao?: string | null
          id?: string
          interpretacao?: string | null
          observacoes?: string | null
          pet_id?: string | null
          resultado?: string | null
          status?: string | null
          tipo_exame: string
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_resultado?: string | null
          data_solicitacao?: string | null
          id?: string
          interpretacao?: string | null
          observacoes?: string | null
          pet_id?: string | null
          resultado?: string | null
          status?: string | null
          tipo_exame?: string
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exames_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      exames_solicitados: {
        Row: {
          created_at: string | null
          data_resultado: string | null
          data_solicitacao: string | null
          id: string
          jejum: boolean | null
          observacoes: string | null
          pet_id: string | null
          preparacao: string | null
          resultado: string | null
          status: string | null
          tipo_exame: string
          tutor_id: string | null
          updated_at: string | null
          urgencia: string | null
          veterinario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_resultado?: string | null
          data_solicitacao?: string | null
          id?: string
          jejum?: boolean | null
          observacoes?: string | null
          pet_id?: string | null
          preparacao?: string | null
          resultado?: string | null
          status?: string | null
          tipo_exame: string
          tutor_id?: string | null
          updated_at?: string | null
          urgencia?: string | null
          veterinario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_resultado?: string | null
          data_solicitacao?: string | null
          id?: string
          jejum?: boolean | null
          observacoes?: string | null
          pet_id?: string | null
          preparacao?: string | null
          resultado?: string | null
          status?: string | null
          tipo_exame?: string
          tutor_id?: string | null
          updated_at?: string | null
          urgencia?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exames_solicitados_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exames_solicitados_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_pagamento: string | null
          forma_pagamento: string | null
          id: string
          nfse_codigo_verificacao: string | null
          nfse_numero: string | null
          pagseguro_transaction_id: string | null
          parcelas: number | null
          status: string | null
          tutor_id: string | null
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          forma_pagamento?: string | null
          id?: string
          nfse_codigo_verificacao?: string | null
          nfse_numero?: string | null
          pagseguro_transaction_id?: string | null
          parcelas?: number | null
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
          valor_total: number
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          forma_pagamento?: string | null
          id?: string
          nfse_codigo_verificacao?: string | null
          nfse_numero?: string | null
          pagseguro_transaction_id?: string | null
          parcelas?: number | null
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          clinic_id: string | null
          cnpj_cpf: string | null
          contato_principal: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          is_active: boolean | null
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          cnpj_cpf?: string | null
          contato_principal?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          is_active?: boolean | null
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          cnpj_cpf?: string | null
          contato_principal?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          is_active?: boolean | null
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      internacoes: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_entrada: string
          data_saida: string | null
          id: string
          motivo: string
          observacoes: string | null
          pet_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_entrada: string
          data_saida?: string | null
          id?: string
          motivo: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_entrada?: string
          data_saida?: string | null
          id?: string
          motivo?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internacoes_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internacoes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      internamentos: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          data_entrada: string
          data_saida: string | null
          diagnostico: string | null
          id: string
          motivo: string | null
          observacoes: string | null
          paciente_id: string | null
          status: string | null
          tratamento: string | null
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          data_entrada: string
          data_saida?: string | null
          diagnostico?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          status?: string | null
          tratamento?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          data_entrada?: string
          data_saida?: string | null
          diagnostico?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          status?: string | null
          tratamento?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internamentos_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internamentos_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      internments: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          patient_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_financeiro: {
        Row: {
          created_at: string | null
          financeiro_id: string | null
          id: string
          produto_id: string | null
          quantidade: number
          servico_id: string | null
          tipo: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          financeiro_id?: string | null
          id?: string
          produto_id?: string | null
          quantidade?: number
          servico_id?: string | null
          tipo: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string | null
          financeiro_id?: string | null
          id?: string
          produto_id?: string | null
          quantidade?: number
          servico_id?: string | null
          tipo?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_financeiro_financeiro_id_fkey"
            columns: ["financeiro_id"]
            isOneToOne: false
            referencedRelation: "financeiro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_financeiro_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_financeiro_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_prescricao: {
        Row: {
          created_at: string | null
          id: string
          observacoes: string | null
          posologia: string
          prescricao_id: string | null
          produto_id: string | null
          quantidade: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          observacoes?: string | null
          posologia: string
          prescricao_id?: string | null
          produto_id?: string | null
          quantidade: number
        }
        Update: {
          created_at?: string | null
          id?: string
          observacoes?: string | null
          posologia?: string
          prescricao_id?: string | null
          produto_id?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_prescricao_prescricao_id_fkey"
            columns: ["prescricao_id"]
            isOneToOne: false
            referencedRelation: "prescricoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_prescricao_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_receita: {
        Row: {
          created_at: string | null
          dosagem: string
          duracao: string
          frequencia: string
          id: string
          instrucoes: string | null
          medicamento: string
          receita_id: string | null
        }
        Insert: {
          created_at?: string | null
          dosagem: string
          duracao: string
          frequencia: string
          id?: string
          instrucoes?: string | null
          medicamento: string
          receita_id?: string | null
        }
        Update: {
          created_at?: string | null
          dosagem?: string
          duracao?: string
          frequencia?: string
          id?: string
          instrucoes?: string | null
          medicamento?: string
          receita_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_receita_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_receita_digital: {
        Row: {
          created_at: string | null
          dosagem: string
          duracao: string
          frequencia: string
          id: string
          instrucoes: string | null
          medicamento: string
          receita_id: string | null
        }
        Insert: {
          created_at?: string | null
          dosagem: string
          duracao: string
          frequencia: string
          id?: string
          instrucoes?: string | null
          medicamento: string
          receita_id?: string | null
        }
        Update: {
          created_at?: string | null
          dosagem?: string
          duracao?: string
          frequencia?: string
          id?: string
          instrucoes?: string | null
          medicamento?: string
          receita_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_receita_digital_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas_digitais"
            referencedColumns: ["id"]
          },
        ]
      }
      lembretes: {
        Row: {
          canal: string | null
          clinic_id: string | null
          created_at: string | null
          data_envio: string
          id: string
          mensagem: string
          pet_id: string | null
          status: string | null
          tipo: string
          titulo: string
          tutor_id: string | null
          updated_at: string | null
        }
        Insert: {
          canal?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_envio: string
          id?: string
          mensagem: string
          pet_id?: string | null
          status?: string | null
          tipo: string
          titulo: string
          tutor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          canal?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_envio?: string
          id?: string
          mensagem?: string
          pet_id?: string | null
          status?: string | null
          tipo?: string
          titulo?: string
          tutor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lembretes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lembretes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lembretes_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      lembretes_sistema: {
        Row: {
          canal: string | null
          clinic_id: string | null
          created_at: string | null
          data_envio: string
          id: string
          mensagem: string
          pet_id: string | null
          status: string | null
          tipo: string
          titulo: string
          tutor_id: string | null
          updated_at: string | null
        }
        Insert: {
          canal?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_envio: string
          id?: string
          mensagem: string
          pet_id?: string | null
          status?: string | null
          tipo: string
          titulo: string
          tutor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          canal?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_envio?: string
          id?: string
          mensagem?: string
          pet_id?: string | null
          status?: string | null
          tipo?: string
          titulo?: string
          tutor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lembretes_sistema_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lembretes_sistema_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_applications: {
        Row: {
          applied_at: string
          applied_by: string
          created_at: string | null
          dosage: number
          id: string
          internment_id: string
          medication_id: string
          notes: string | null
        }
        Insert: {
          applied_at?: string
          applied_by: string
          created_at?: string | null
          dosage: number
          id?: string
          internment_id: string
          medication_id: string
          notes?: string | null
        }
        Update: {
          applied_at?: string
          applied_by?: string
          created_at?: string | null
          dosage?: number
          id?: string
          internment_id?: string
          medication_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_applications_internment_id_fkey"
            columns: ["internment_id"]
            isOneToOne: false
            referencedRelation: "internments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_applications_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          cost_per_unit: number
          created_at: string | null
          expiry_date: string | null
          id: string
          min_stock_level: number
          name: string
          price_per_unit: number
          stock_quantity: number
          unit: string
          updated_at: string | null
        }
        Insert: {
          cost_per_unit: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          min_stock_level?: number
          name: string
          price_per_unit: number
          stock_quantity?: number
          unit: string
          updated_at?: string | null
        }
        Update: {
          cost_per_unit?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          min_stock_level?: number
          name?: string
          price_per_unit?: number
          stock_quantity?: number
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monitoramento_internacao: {
        Row: {
          created_at: string | null
          data_hora: string
          frequencia_cardiaca: number | null
          frequencia_respiratoria: number | null
          id: string
          internacao_id: string | null
          observacoes: string | null
          pressao_arterial: string | null
          temperatura: number | null
          veterinario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_hora: string
          frequencia_cardiaca?: number | null
          frequencia_respiratoria?: number | null
          id?: string
          internacao_id?: string | null
          observacoes?: string | null
          pressao_arterial?: string | null
          temperatura?: number | null
          veterinario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_hora?: string
          frequencia_cardiaca?: number | null
          frequencia_respiratoria?: number | null
          id?: string
          internacao_id?: string | null
          observacoes?: string | null
          pressao_arterial?: string | null
          temperatura?: number | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitoramento_internacao_internacao_id_fkey"
            columns: ["internacao_id"]
            isOneToOne: false
            referencedRelation: "internacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoramento_internacao_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacao_estoque: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_movimentacao: string | null
          id: string
          motivo: string | null
          prescricao_id: string | null
          produto_id: string | null
          quantidade: number
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          motivo?: string | null
          prescricao_id?: string | null
          produto_id?: string | null
          quantidade: number
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_movimentacao?: string | null
          id?: string
          motivo?: string | null
          prescricao_id?: string | null
          produto_id?: string | null
          quantidade?: number
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacao_estoque_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacao_estoque_prescricao_id_fkey"
            columns: ["prescricao_id"]
            isOneToOne: false
            referencedRelation: "prescricoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacao_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          criado_em: string | null
          especie: string | null
          id: string
          idade: number | null
          nome: string
          observacoes: string | null
          peso: number | null
          raca: string | null
          sexo: string | null
          user_id: string
        }
        Insert: {
          criado_em?: string | null
          especie?: string | null
          id?: string
          idade?: number | null
          nome: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          user_id: string
        }
        Update: {
          criado_em?: string | null
          especie?: string | null
          id?: string
          idade?: number | null
          nome?: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pedidos_fornecedor: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          data_pedido: string | null
          fornecedor_id: string | null
          id: string
          observacoes: string | null
          status: string | null
          updated_at: string | null
          valor_total: number | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          data_pedido?: string | null
          fornecedor_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          valor_total?: number | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          data_pedido?: string | null
          fornecedor_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_fornecedor_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_fornecedor_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          criado_em: string | null
          endereco: string | null
          id: string
          nome: string | null
          telefone: string | null
        }
        Insert: {
          criado_em?: string | null
          endereco?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          criado_em?: string | null
          endereco?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          clinic_id: string | null
          cor: string | null
          created_at: string | null
          data_nascimento: string | null
          especie: string
          foto_url: string | null
          id: string
          microchip: string | null
          name: string
          observacoes: string | null
          peso: number | null
          raca: string | null
          sexo: string | null
          tutor_id: string | null
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          cor?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          especie: string
          foto_url?: string | null
          id?: string
          microchip?: string | null
          name: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          tutor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          cor?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          especie?: string
          foto_url?: string | null
          id?: string
          microchip?: string | null
          name?: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          tutor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pets_tutor_id"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      pets_history: {
        Row: {
          changed_at: string
          id: string
          new_name: string | null
          old_name: string | null
          pet_id: string
        }
        Insert: {
          changed_at?: string
          id?: string
          new_name?: string | null
          old_name?: string | null
          pet_id: string
        }
        Update: {
          changed_at?: string
          id?: string
          new_name?: string | null
          old_name?: string | null
          pet_id?: string
        }
        Relationships: []
      }
      prescricoes: {
        Row: {
          atendimento_id: string | null
          clinic_id: string | null
          created_at: string | null
          data_prescricao: string | null
          id: string
          observacoes: string | null
          updated_at: string | null
        }
        Insert: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Update: {
          atendimento_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescricoes_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string | null
          clinic_id: string | null
          codigo: string | null
          created_at: string | null
          data_validade: string | null
          descricao: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          fabricante: string | null
          fornecedor_id: string | null
          id: string
          lote: string | null
          nome: string
          preco_custo: number
          preco_venda: number
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          clinic_id?: string | null
          codigo?: string | null
          created_at?: string | null
          data_validade?: string | null
          descricao?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fabricante?: string | null
          fornecedor_id?: string | null
          id?: string
          lote?: string | null
          nome: string
          preco_custo: number
          preco_venda: number
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          clinic_id?: string | null
          codigo?: string | null
          created_at?: string | null
          data_validade?: string | null
          descricao?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fabricante?: string | null
          fornecedor_id?: string | null
          id?: string
          lote?: string | null
          nome?: string
          preco_custo?: number
          preco_venda?: number
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          data_prescricao: string | null
          id: string
          observacoes: string | null
          pet_id: string | null
          status: string | null
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receitas_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas_digitais: {
        Row: {
          created_at: string | null
          data_prescricao: string | null
          id: string
          observacoes: string | null
          pet_id: string | null
          status: string | null
          tutor_id: string | null
          updated_at: string | null
          veterinario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_prescricao?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          status?: string | null
          tutor_id?: string | null
          updated_at?: string | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receitas_digitais_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_digitais_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          clinic_id: string | null
          comissao_percentual: number | null
          created_at: string | null
          descricao: string | null
          duracao_minutos: number | null
          id: string
          nome: string
          preco: number
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          nome: string
          preco: number
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          nome?: string
          preco?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tratamentos: {
        Row: {
          consulta_id: string
          criado_em: string | null
          descricao: string
          duracao_dias: number | null
          id: string
        }
        Insert: {
          consulta_id: string
          criado_em?: string | null
          descricao: string
          duracao_dias?: number | null
          id?: string
        }
        Update: {
          consulta_id?: string
          criado_em?: string | null
          descricao?: string
          duracao_dias?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tratamentos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
        ]
      }
      tutores: {
        Row: {
          cep: string | null
          cidade: string | null
          clinic_id: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          is_active: boolean
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          clinic_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          is_active?: boolean
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          clinic_id?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          is_active?: boolean
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          crmv: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          crmv?: string | null
          email: string
          id: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          crmv?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          auth_user_id: string | null
          clinic_id: string | null
          created_at: string | null
          crmv: string | null
          email: string
          id: string
          nome: string
          role: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          auth_user_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          crmv?: string | null
          email: string
          id?: string
          nome: string
          role: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          auth_user_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          crmv?: string | null
          email?: string
          id?: string
          nome?: string
          role?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      vacinacoes: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          data_aplicacao: string | null
          data_vencimento: string | null
          id: string
          lote: string | null
          observacoes: string | null
          paciente_id: string | null
          preco: number | null
          produto_id: string | null
          status: string | null
          updated_at: string | null
          vacina: string
          veterinario_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          data_aplicacao?: string | null
          data_vencimento?: string | null
          id?: string
          lote?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          preco?: number | null
          produto_id?: string | null
          status?: string | null
          updated_at?: string | null
          vacina: string
          veterinario_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          data_aplicacao?: string | null
          data_vencimento?: string | null
          id?: string
          lote?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          preco?: number | null
          produto_id?: string | null
          status?: string | null
          updated_at?: string | null
          vacina?: string
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacinacoes_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacinacoes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacinacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacinacoes_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vacinas: {
        Row: {
          criado_em: string | null
          data_aplicacao: string
          id: string
          nome: string
          observacoes: string | null
          paciente_id: string
          proxima_dose: string | null
        }
        Insert: {
          criado_em?: string | null
          data_aplicacao: string
          id?: string
          nome: string
          observacoes?: string | null
          paciente_id: string
          proxima_dose?: string | null
        }
        Update: {
          criado_em?: string | null
          data_aplicacao?: string
          id?: string
          nome?: string
          observacoes?: string | null
          paciente_id?: string
          proxima_dose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacinas_pet_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarios: {
        Row: {
          clinic_id: string | null
          comissao_percentual: number | null
          created_at: string | null
          crmv: string
          email: string | null
          especialidade: string | null
          foto_url: string | null
          id: string
          is_active: boolean | null
          nome: string
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          clinic_id?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          crmv: string
          email?: string | null
          especialidade?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          clinic_id?: string | null
          comissao_percentual?: number | null
          created_at?: string | null
          crmv?: string
          email?: string | null
          especialidade?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_clinic_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "veterinarian" | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "veterinarian", "receptionist"],
    },
  },
} as const

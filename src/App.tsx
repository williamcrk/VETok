import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgendaDragDropPage from "./pages/AgendaDragDrop";
import AgendaInteligente from "./pages/AgendaInteligente";
import Lembretes from "./pages/Lembretes";
import MultiClinicas from "./pages/MultiClinicas";
import Pacientes from "./pages/Pacientes";
import Clientes from "./pages/Clientes";
import NovaConsulta from "./pages/NovaConsulta";
import Internamentos from "./pages/Internamentos";
import PainelInternamento from "./pages/PainelInternamento";
import Prontuarios from "./pages/Prontuarios";
import PrescricaoDigital from "./pages/PrescricaoDigital";
import Financeiro from "./pages/Financeiro";
import PainelFinanceiro from "./pages/PainelFinanceiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Cirurgias from "./pages/Cirurgias";
import Vacinas from "./pages/Vacinas";
import Estoque from "./pages/Estoque";
import EstoqueAvancado from "./pages/EstoqueAvancado";
import Fornecedores from "./pages/Fornecedores";
import Exames from "./pages/Exames";
import Evolucoes from "./pages/Evolucoes";
import Profissionais from "./pages/Profissionais";
import Anestesia from "./pages/Anestesia";
import Procedimentos from "./pages/Procedimentos";
import NotFound from "./pages/NotFound";
import DetalhesInternacao from './pages/DetalhesInternacao';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<AgendaDragDropPage />} />
          <Route path="/lembretes" element={<Lembretes />} />
          <Route path="/agenda-inteligente" element={<Lembretes />} />
          <Route path="/multi-clinicas" element={<MultiClinicas />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/consulta" element={<NovaConsulta />} />
          <Route path="/internamentos" element={<Internamentos />} />
          <Route path="/painel-internamento" element={<PainelInternamento />} />
          <Route path="/prontuarios" element={<Prontuarios />} />
          <Route path="/prescricao-digital" element={<PrescricaoDigital />} />
          <Route path="/cirurgias" element={<Cirurgias />} />
          <Route path="/vacinas" element={<Vacinas />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/painel-financeiro" element={<PainelFinanceiro />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/estoque-avancado" element={<EstoqueAvancado />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          
          {/* Novas rotas adicionadas */}
          <Route path="/exames" element={<Exames />} />
          <Route path="/evolucoes" element={<Evolucoes />} />
          <Route path="/profissionais" element={<Profissionais />} />
          <Route path="/veterinarios" element={<Profissionais />} />
          <Route path="/anestesia" element={<Anestesia />} />
          <Route path="/procedimentos" element={<Procedimentos />} />
          <Route path="/internamento/:id" element={<DetalhesInternacao />} />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={<Dashboard />} />
          <Route path="/super-admin/clinicas" element={<MultiClinicas />} />
          <Route path="/super-admin/usuarios" element={<Clientes />} />
          <Route path="/super-admin/cobranca" element={<PainelFinanceiro />} />
          <Route path="/super-admin/relatorios" element={<Relatorios />} />
          <Route path="/super-admin/configuracoes" element={<Configuracoes />} />
          
          {/* Professional Routes */}
          <Route path="/atendentes" element={<Profissionais />} />
          <Route path="/escalas" element={<AgendaDragDropPage />} />
          <Route path="/comissoes" element={<PainelFinanceiro />} />
          <Route path="/servicos" element={<Configuracoes />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

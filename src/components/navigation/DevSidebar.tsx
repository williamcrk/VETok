
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Home,
  Calendar,
  PlusCircle,
  Heart,
  Users,
  Pill,
  FileText,
  MessageCircle,
  Scissors,
  Shield,
  TestTube,
  ClipboardList,
  Activity,
  Dog,
  Cat,
  CreditCard,
  TrendingUp,
  Package,
  Settings,
  BarChart3,
  UserCheck,
  Building2,
  Globe,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DevSidebar = () => {
  const navigate = useNavigate();

  const principalItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Agenda",
      url: "/agenda",
      icon: Calendar,
    },
    {
      title: "Agenda Inteligente",
      url: "/agenda-inteligente",
      icon: Calendar,
    },
  ];

  const clinicalItems = [
    {
      title: "Nova Consulta",
      url: "/consulta",
      icon: PlusCircle,
    },
    {
      title: "Pacientes",
      url: "/pacientes",
      icon: Heart,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Internamentos",
      url: "/internamentos",
      icon: Pill,
    },
    {
      title: "Painel Internamento",
      url: "/painel-internamento",
      icon: Eye,
    },
    {
      title: "Prontuários",
      url: "/prontuarios",
      icon: FileText,
    },
    {
      title: "Prescrição Digital",
      url: "/prescricao-digital",
      icon: MessageCircle,
    },
    {
      title: "Vacinas",
      url: "/vacinas",
      icon: Shield,
    },
    {
      title: "Cirurgias",
      url: "/cirurgias",
      icon: Scissors,
    },
    {
      title: "Exames Solicitados",
      url: "/exames",
      icon: TestTube,
    },
    {
      title: "Evoluções",
      url: "/evolucoes",
      icon: Activity,
    },
  ];

  const gestaoItems = [
    {
      title: "Profissionais",
      url: "/veterinarios",
      icon: UserCheck,
    },
    {
      title: "Financeiro",
      url: "/financeiro",
      icon: CreditCard,
    },
    {
      title: "Painel Financeiro",
      url: "/painel-financeiro",
      icon: TrendingUp,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: BarChart3,
    },
    {
      title: "Estoque",
      url: "/estoque",
      icon: Package,
    },
    {
      title: "Estoque Avançado",
      url: "/estoque-avancado",
      icon: Package,
    },
    {
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Building2,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
    },
  ];

  const superAdminItems = [
    {
      title: "Multi-Clínicas",
      url: "/multi-clinicas",
      icon: Globe,
    },
    {
      title: "Super Admin Dashboard",
      url: "/super-admin/dashboard",
      icon: Globe,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
            <Dog className="w-3 h-3 text-white absolute -left-0.5" />
            <Cat className="w-3 h-3 text-white absolute -right-0.5" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VetPrime DEV
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>🏠 Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {principalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>🐾 Clínico</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clinicalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>📦 Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gestaoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>🔒 Super Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500">
          <p>🚀 Desenvolvedor</p>
          <p className="text-xs">Acesso Total - Modo DEV</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DevSidebar;

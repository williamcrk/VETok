
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
  Users,
  Heart,
  CreditCard,
  TrendingUp,
  Package,
  Settings,
  BarChart3,
  UserCheck,
  Building2,
  Dog,
  Cat
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
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
  ];

  const gestaoItems = [
    {
      title: "Profissionais",
      url: "/veterinarios",
      icon: UserCheck,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Pacientes",
      url: "/pacientes",
      icon: Heart,
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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center relative">
            <Dog className="w-3 h-3 text-white absolute -left-0.5" />
            <Cat className="w-3 h-3 text-white absolute -right-0.5" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            VetPrime
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
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500">
          <p>Admin - Carlos Silva</p>
          <p className="text-xs">Clínica VetPrime</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;

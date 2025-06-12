
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
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminSidebar = () => {
  const navigate = useNavigate();

  const superAdminItems = [
    {
      title: "Painel Geral",
      url: "/super-admin/dashboard",
      icon: Globe,
    },
    {
      title: "Clínicas",
      url: "/super-admin/clinicas",
      icon: Building2,
    },
    {
      title: "Gestão de Usuários",
      url: "/super-admin/usuarios",
      icon: Users,
    },
    {
      title: "Cobrança & Planos",
      url: "/super-admin/cobranca",
      icon: CreditCard,
    },
    {
      title: "Relatórios Globais",
      url: "/super-admin/relatorios",
      icon: BarChart3,
    },
    {
      title: "Configurações Sistema",
      url: "/super-admin/configuracoes",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>🔒 Super Administrador</SidebarGroupLabel>
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
    </Sidebar>
  );
};

export default SuperAdminSidebar;

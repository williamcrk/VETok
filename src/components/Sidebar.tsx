import {
  Bell,
  Home,
  Users,
  Dog,
  Stethoscope,
  ClipboardList,
  FileText,
  Archive,
  Settings,
  Calendar,
  Hospital,
} from 'lucide-react';
import vetokLogo from '@/assets/vetok-logo.png';

const navItems = [
  { href: '/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/procedimentos', icon: ClipboardList, label: 'Procedimentos' },
  { href: '/internamentos', icon: Hospital, label: 'Internamentos' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/pacientes', icon: Dog, label: 'Pacientes' },
  { href: '/prontuarios', icon: FileText, label: 'Prontuários' },
  { href: '/estoque', icon: Archive, label: 'Estoque' },
  { href: '/financeiro', icon: 'money', label: 'Financeiro' },
  { href: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export const Sidebar = () => {
  // ... (restante do componente)
}; 
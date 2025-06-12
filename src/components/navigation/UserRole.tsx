
import { useQuery } from '@tanstack/react-query';

export type UserRole = 'super_admin' | 'admin' | 'veterinarian' | 'receptionist' | 'dev';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      // Para desenvolvimento, sempre retorna perfil DEV
      // Isso permite testar todas as funcionalidades sem configurar Supabase
      return {
        role: 'dev' as UserRole,
        clinic_id: 'dev-clinic-id'
      };
    },
  });
};

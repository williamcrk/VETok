
import React from 'react';
import { useUserRole } from './UserRole';
import SuperAdminSidebar from './SuperAdminSidebar';
import AdminSidebar from './AdminSidebar';
import VeterinarianSidebar from './VeterinarianSidebar';
import ReceptionistSidebar from './ReceptionistSidebar';
import DevSidebar from './DevSidebar';
import { Skeleton } from '@/components/ui/skeleton';

const RoleBasedSidebar = () => {
  const { data: userProfile, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="w-64 h-screen bg-sidebar">
        <div className="p-4">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-6 w-28 mb-2" />
          <Skeleton className="h-6 w-20 mb-2" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <VeterinarianSidebar />; // Fallback
  }

  const role = userProfile.role as string;
  
  switch (role) {
    case 'dev':
      return <DevSidebar />;
    case 'super_admin':
      return <SuperAdminSidebar />;
    case 'admin':
      return <AdminSidebar />;
    case 'veterinarian':
      return <VeterinarianSidebar />;
    case 'receptionist':
      return <ReceptionistSidebar />;
    default:
      return <VeterinarianSidebar />;
  }
};

export default RoleBasedSidebar;

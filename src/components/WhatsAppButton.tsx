
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phone, 
  message = "Olá!", 
  className = "",
  variant = "outline",
  size = "sm"
}) => {
  const openWhatsApp = () => {
    // Remove caracteres não numéricos e adiciona código do país se necessário
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!phone) return null;

  return (
    <Button 
      onClick={openWhatsApp}
      variant={variant}
      size={size}
      className={`${className} text-green-600 hover:text-green-700 hover:bg-green-50`}
    >
      <MessageCircle className="w-3 h-3 mr-1" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;

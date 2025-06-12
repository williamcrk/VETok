
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Calendar, Package, DollarSign, Clock, Check, X } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Estoque Crítico',
      message: 'Amoxicilina 500mg está abaixo do estoque mínimo (45/100)',
      time: '2 min atrás',
      read: false,
      icon: Package,
      action: 'Repor Estoque'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pagamento Pendente',
      message: 'Cliente Maria Silva tem pagamento em atraso há 5 dias',
      time: '15 min atrás',
      read: false,
      icon: DollarSign,
      action: 'Enviar Cobrança'
    },
    {
      id: 3,
      type: 'info',
      title: 'Consulta Agendada',
      message: 'Próxima consulta em 30 minutos - Rex com Dr. João',
      time: '30 min atrás',
      read: true,
      icon: Calendar,
      action: 'Ver Agenda'
    },
    {
      id: 4,
      type: 'success',
      title: 'Meta Atingida',
      message: 'Dr. João Silva atingiu a meta mensal de R$ 25.000',
      time: '1 hora atrás',
      read: true,
      icon: Check,
      action: 'Ver Comissões'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Medicamento Vencendo',
      message: 'Anti-inflamatório vence em 15 dias',
      time: '2 horas atrás',
      read: false,
      icon: AlertTriangle,
      action: 'Verificar Estoque'
    }
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
            Limpar Tudo
          </Button>
        </div>
        <CardDescription>Alertas e atualizações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border rounded-lg ${notification.read ? 'bg-gray-50 opacity-75' : 'bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                    <notification.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      <div className="flex gap-1">
                        {notification.action && (
                          <Button variant="outline" size="sm" className="text-xs h-6">
                            {notification.action}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;

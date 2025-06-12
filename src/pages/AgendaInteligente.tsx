
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Bell, MessageCircle, Phone, AlertTriangle } from 'lucide-react';

const AgendaInteligente = () => {
  const [alerts, setAlerts] = useState([]);

  const generateWhatsAppMessage = (alert: any) => {
    const messages = {
      vacina: `Olá ${alert.owner}! 🐾\n\nLembramos que a vacina ${alert.service} do ${alert.pet} está agendada para ${alert.date} às ${alert.time}.\n\nConfirme sua presença!\n\nVetPrime - Cuidando com amor 💙`,
      retorno: `Olá ${alert.owner}! 🐾\n\nLembramos que o retorno do ${alert.pet} está agendado para ${alert.date} às ${alert.time}.\n\nAguardamos vocês!\n\nVetPrime - Cuidando com amor 💙`,
      consulta: `Olá ${alert.owner}! 🐾\n\nLembramos que a consulta do ${alert.pet} está agendada para ${alert.date} às ${alert.time}.\n\nConfirme sua presença!\n\nVetPrime - Cuidando com amor 💙`
    };
    return messages[alert.type as keyof typeof messages] || messages.consulta;
  };

  const openWhatsApp = (alert: any) => {
    const message = generateWhatsAppMessage(alert);
    const url = `https://wa.me/55${alert.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'vacina': return 'bg-green-100 text-green-800';
      case 'retorno': return 'bg-blue-100 text-blue-800';
      case 'consulta': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout title="Agenda Inteligente">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-sm text-gray-600">Alertas Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Mensagens Enviadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lembretes Automáticos</CardTitle>
            <CardDescription>Sistema inteligente de notificações por WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum alerta pendente</p>
                <p className="text-sm mt-2">
                  Os lembretes automáticos aparecerão aqui conforme agendamentos forem criados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{alert.pet} - {alert.owner}</h3>
                          <Badge className={getAlertColor(alert.type)}>
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.service}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {alert.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {alert.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openWhatsApp(alert)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp
                      </Button>
                      <Button size="sm" variant="outline">
                        Marcar Enviado
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Mensagens</CardTitle>
            <CardDescription>Personalize as mensagens automáticas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem para Vacinas</label>
                <textarea 
                  className="w-full p-3 border rounded-lg" 
                  rows={3}
                  defaultValue="Olá {cliente}! 🐾\n\nLembramos que a vacina {servico} do {pet} está agendada para {data} às {hora}.\n\nConfirme sua presença!\n\nVetPrime - Cuidando com amor 💙"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem para Retornos</label>
                <textarea 
                  className="w-full p-3 border rounded-lg" 
                  rows={3}
                  defaultValue="Olá {cliente}! 🐾\n\nLembramos que o retorno do {pet} está agendado para {data} às {hora}.\n\nAguardamos vocês!\n\nVetPrime - Cuidando com amor 💙"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Salvar Configurações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AgendaInteligente;

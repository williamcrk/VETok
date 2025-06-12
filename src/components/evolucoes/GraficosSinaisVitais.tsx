import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

const VitalSignChart = ({ data, dataKey, name, color }) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" fontSize={12} tickFormatter={(tick) => format(parseISO(tick), 'dd/MM HH:mm')} />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} fontSize={12} />
        <Tooltip labelFormatter={(label) => format(parseISO(label), "dd/MM/yyyy 'às' HH:mm")} />
        <Legend />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const GraficosSinaisVitais = ({ evolucoes }) => {
  const chartData = evolucoes
    .filter(e => e.temperatura || e.peso_atual || e.frequencia_cardiaca || e.frequencia_respiratoria)
    .map(e => ({
      time: e.data_evolucao,
      temperatura: e.temperatura,
      peso: e.peso_atual,
      fc: e.frequencia_cardiaca,
      fr: e.frequencia_respiratoria,
    }))
    .reverse();

  if (chartData.length < 2) {
    return (
      <Card>
        <CardHeader><CardTitle>Gráficos de Sinais Vitais</CardTitle></CardHeader>
        <CardContent>
            <p className="text-center text-gray-500 py-8">Dados insuficientes para gerar gráficos. São necessárias pelo menos duas evoluções com sinais vitais registrados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráficos de Sinais Vitais</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VitalSignChart data={chartData.filter(d => d.temperatura)} dataKey="temperatura" name="Temperatura (°C)" color="#ef4444" />
        <VitalSignChart data={chartData.filter(d => d.peso)} dataKey="peso" name="Peso (kg)" color="#3b82f6" />
        <VitalSignChart data={chartData.filter(d => d.fc)} dataKey="fc" name="Freq. Cardíaca (bpm)" color="#10b981" />
        <VitalSignChart data={chartData.filter(d => d.fr)} dataKey="fr" name="Freq. Respiratória (rpm)" color="#8b5cf6" />
      </CardContent>
    </Card>
  );
};

export default GraficosSinaisVitais; 
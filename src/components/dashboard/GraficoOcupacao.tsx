
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dadosOcupacao = [
  { horario: '08:00', ocupacao: 85 },
  { horario: '09:00', ocupacao: 92 },
  { horario: '10:00', ocupacao: 78 },
  { horario: '11:00', ocupacao: 95 },
  { horario: '14:00', ocupacao: 88 },
  { horario: '15:00', ocupacao: 75 },
  { horario: '16:00', ocupacao: 82 },
  { horario: '17:00', ocupacao: 90 }
];

const GraficoOcupacao = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Taxa de Ocupação</CardTitle>
        <CardDescription>Ocupação dos horários hoje</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dadosOcupacao}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="horario" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Ocupação']}
              labelStyle={{ color: '#666' }}
            />
            <Bar 
              dataKey="ocupacao" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GraficoOcupacao;

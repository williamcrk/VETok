
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dadosFaturamento = [
  { dia: 'Seg', valor: 1200 },
  { dia: 'Ter', valor: 1800 },
  { dia: 'Qua', valor: 1500 },
  { dia: 'Qui', valor: 2200 },
  { dia: 'Sex', valor: 1900 },
  { dia: 'Sáb', valor: 2500 },
  { dia: 'Dom', valor: 800 }
];

const GraficoFaturamento = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Faturamento Semanal</CardTitle>
        <CardDescription>Receita dos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dadosFaturamento}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value) => [`R$ ${value}`, 'Faturamento']}
              labelStyle={{ color: '#666' }}
            />
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GraficoFaturamento;

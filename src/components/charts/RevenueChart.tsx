
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  type?: 'line' | 'bar';
}

const RevenueChart = ({ data, type = 'line' }: RevenueChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Financeira</CardTitle>
        <CardDescription>Receitas, despesas e lucro nos últimos meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Despesas" />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Lucro" />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#10b981" name="Receita" />
                <Bar dataKey="expenses" fill="#ef4444" name="Despesas" />
                <Bar dataKey="profit" fill="#3b82f6" name="Lucro" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

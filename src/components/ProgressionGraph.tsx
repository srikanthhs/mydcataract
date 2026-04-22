import React from 'react';
import { Card } from './ui/Card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProgressionGraphProps {
  data: any[];
}

export const ProgressionGraph: React.FC<ProgressionGraphProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formattedData = sortedData.map(d => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString(),
    // Map visual acuity like 20/20 to 1, 20/40 to 0.5 for graphing
    acuityVal: mapAcuity(d.visualAcuityLeft)
  }));

  function mapAcuity(snellen: string) {
    if (!snellen) return 0;
    const parts = snellen.split('/');
    if (parts.length === 2) {
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return 0;
  }

  return (
    <Card padding="md" className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Cataract Progression Tracking</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Vision Metrics Over Time</p>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="dateLabel" 
              fontSize={10} 
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              fontSize={10}
              axisLine={false}
              tickLine={false}
              domain={[0, 1.2]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-google)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line 
              type="monotone" 
              dataKey="acuityVal" 
              name="Visual Acuity (L)" 
              stroke="#1A73E8" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#1A73E8" }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="contrastScore" 
              name="Contrast Sensitivity" 
              stroke="#34A853" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#34A853" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

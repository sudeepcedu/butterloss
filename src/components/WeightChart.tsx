import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';
import { format, parseISO } from 'date-fns';
import './WeightChart.css';

interface WeightChartProps {
  logs: DailyLog[];
}

const WeightChart: React.FC<WeightChartProps> = ({ logs }) => {
  // Filter logs that have weight recorded
  const weightLogs = logs.filter(log => log.weight !== null).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = weightLogs.map(log => ({
    date: format(parseISO(log.date), 'MMM dd'),
    weight: log.weight,
    deficit: log.deficit
  }));

  if (weightLogs.length === 0) {
    return (
      <div className="weight-chart empty">
        <h3>📊 Weight Progress</h3>
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <p>No weight entries recorded yet. Start logging your weight to see your progress chart!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weight-chart">
      <h3>📊 Weight Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'weight' ? `${value} kg` : `${value} cal`,
              name === 'weight' ? 'Weight' : 'Deficit'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart; 
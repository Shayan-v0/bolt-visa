import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Target } from 'lucide-react';

const PerformanceChart = ({ mainDeals, referenceDeals, totalEarnings }) => {
  const dealData = [
    { name: 'Main Deals', value: mainDeals, earnings: mainDeals * 2000, color: '#8b45ff' },
    { name: 'Reference Deals', value: referenceDeals, earnings: referenceDeals * 1000, color: '#ff6b9d' }
  ];

  const monthlyData = [
    { month: 'Jan', earnings: Math.floor(totalEarnings * 0.1) },
    { month: 'Feb', earnings: Math.floor(totalEarnings * 0.15) },
    { month: 'Mar', earnings: Math.floor(totalEarnings * 0.2) },
    { month: 'Apr', earnings: Math.floor(totalEarnings * 0.25) },
    { month: 'May', earnings: Math.floor(totalEarnings * 0.3) },
    { month: 'Jun', earnings: totalEarnings }
  ];

  const COLORS = ['#8b45ff', '#ff6b9d', '#ffd700'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Award className="mr-2 h-5 w-5 text-purple-400" />
            Deal Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dealData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dealData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(139, 69, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {dealData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-purple-300 text-sm">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 h-5 w-5 text-purple-400" />
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dealData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 69, 255, 0.2)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(139, 69, 255, 0.3)' }}
              />
              <YAxis 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(139, 69, 255, 0.3)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(139, 69, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value.toLocaleString()} PKR`, 'Earnings']}
              />
              <Bar dataKey="earnings" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b45ff" />
                  <stop offset="100%" stopColor="#ff6b9d" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
            Monthly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 69, 255, 0.2)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(139, 69, 255, 0.3)' }}
              />
              <YAxis 
                tick={{ fill: 'white', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(139, 69, 255, 0.3)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(139, 69, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value.toLocaleString()} PKR`, 'Earnings']}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#8b45ff" 
                strokeWidth={3}
                dot={{ fill: '#ff6b9d', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ffd700' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
import React from 'react';
import { motion } from 'framer-motion';
import { useDeals } from '@/hooks/useDeals';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Building, Users, Car } from 'lucide-react';

const ProfitAnalysis = () => {
  const { deals } = useDeals();
  const { expenses } = useExpenses();

  const convertToAED = (amount, currency) => {
    const rates = { PKR: 0.013, USD: 3.67, AED: 1 };
    return parseFloat(amount) * (rates[currency] || 1);
  };

  const totalRevenue = deals.reduce((sum, deal) => {
    if (deal.status === 'approved') {
      return sum + convertToAED(deal.paidAmount, deal.currency);
    }
    return sum;
  }, 0);

  const officeRent = 1500;
  const staffSalaries = 6000;
  const travelExpenses = 9000;
  const otherExpenses = expenses.reduce((sum, expense) => {
    if (expense.status === 'approved' && expense.type === 'other') {
      return sum + convertToAED(expense.amount, expense.currency);
    }
    return sum;
  }, 0);

  const totalExpenses = officeRent + staffSalaries + travelExpenses + otherExpenses;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

  const expenseBreakdown = [
    { name: 'Office Rent', value: officeRent, color: '#8b45ff' },
    { name: 'Staff Salaries', value: staffSalaries, color: '#ff6b9d' },
    { name: 'Travel Expenses', value: travelExpenses, color: '#ffd700' },
    { name: 'Other Expenses', value: otherExpenses, color: '#00ff88' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: totalRevenue * 0.1, expenses: totalExpenses * 0.1, profit: (totalRevenue - totalExpenses) * 0.1 },
    { month: 'Feb', revenue: totalRevenue * 0.15, expenses: totalExpenses * 0.15, profit: (totalRevenue - totalExpenses) * 0.15 },
    { month: 'Mar', revenue: totalRevenue * 0.2, expenses: totalExpenses * 0.2, profit: (totalRevenue - totalExpenses) * 0.2 },
    { month: 'Apr', revenue: totalRevenue * 0.25, expenses: totalExpenses * 0.25, profit: (totalRevenue - totalExpenses) * 0.25 },
    { month: 'May', revenue: totalRevenue * 0.3, expenses: totalExpenses * 0.3, profit: (totalRevenue - totalExpenses) * 0.3 },
    { month: 'Jun', revenue: totalRevenue, expenses: totalExpenses, profit: netProfit }
  ];

  const profitStats = [
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toLocaleString()} AED`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      description: 'Monthly income from deals'
    },
    {
      title: 'Total Expenses',
      value: `${totalExpenses.toLocaleString()} AED`,
      icon: Building,
      color: 'from-red-500 to-pink-500',
      description: 'Monthly operational costs'
    },
    {
      title: 'Net Profit',
      value: `${netProfit.toLocaleString()} AED`,
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      color: netProfit >= 0 ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-orange-500',
      description: 'Monthly profit/loss'
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      icon: Calculator,
      color: 'from-purple-500 to-pink-500',
      description: 'Profitability percentage'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Profit Analysis & Financial Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {profitStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="visa-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-purple-300 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white">Expense Breakdown</CardTitle>
            <CardDescription className="text-purple-300">
              Monthly expense distribution in AED
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
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
                  formatter={(value) => [`${value.toLocaleString()} AED`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-purple-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value.toLocaleString()} AED</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white">Monthly Trend</CardTitle>
            <CardDescription className="text-purple-300">
              Revenue vs Expenses vs Profit (AED)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                  formatter={(value) => [`${value.toLocaleString()} AED`]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00ff88" 
                  strokeWidth={3}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ff6b9d" 
                  strokeWidth={3}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#8b45ff" 
                  strokeWidth={3}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white">Detailed Financial Summary</CardTitle>
          <CardDescription className="text-purple-300">
            Complete breakdown of income and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Revenue Sources
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="text-green-300">Approved Deals</span>
                  <span className="text-white font-semibold">{totalRevenue.toLocaleString()} AED</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="text-purple-300">Total Revenue</span>
                  <span className="text-white font-bold text-lg">{totalRevenue.toLocaleString()} AED</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingDown className="mr-2 h-5 w-5 text-red-400" />
                Expense Categories
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-red-400" />
                    <span className="text-red-300">Office Rent</span>
                  </div>
                  <span className="text-white font-semibold">{officeRent.toLocaleString()} AED</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-red-400" />
                    <span className="text-red-300">Staff Salaries</span>
                  </div>
                  <span className="text-white font-semibold">{staffSalaries.toLocaleString()} AED</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center">
                    <Car className="mr-2 h-4 w-4 text-red-400" />
                    <span className="text-red-300">Travel Expenses</span>
                  </div>
                  <span className="text-white font-semibold">{travelExpenses.toLocaleString()} AED</span>
                </div>
                {otherExpenses > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-red-400" />
                      <span className="text-red-300">Other Expenses</span>
                    </div>
                    <span className="text-white font-semibold">{otherExpenses.toLocaleString()} AED</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="text-purple-300">Total Expenses</span>
                  <span className="text-white font-bold text-lg">{totalExpenses.toLocaleString()} AED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Net Profit</h3>
                <p className="text-purple-300">After all expenses</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} AED
                </div>
                <p className="text-purple-300">Profit Margin: {profitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitAnalysis;
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Gift, DollarSign, Target, FileText } from 'lucide-react';

const UserDashboardSummary = ({ deals }) => {
  const today = new Date().toDateString();
  const todayDeals = deals.filter(deal => new Date(deal.createdAt).toDateString() === today);
  const mainDeals = deals.filter(deal => deal.dealType === 'main');
  const referenceDeals = deals.filter(deal => deal.dealType === 'reference');
  
  const calculateEarnings = (deals) => {
    return deals.reduce((total, deal) => {
      if (deal.status === 'approved') {
        return total + (deal.dealType === 'main' ? 2000 : 1000);
      }
      return total;
    }, 0);
  };

  const totalEarnings = calculateEarnings(deals);

  const stats = [
    {
      title: "Your Total Deals",
      value: deals.length,
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Main Deals',
      value: mainDeals.length,
      icon: Gift,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Reference Deals',
      value: referenceDeals.length,
      icon: Target,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Your Rewards',
      value: `${totalEarnings.toLocaleString()} PKR`,
      icon: Star,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="visa-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-purple-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default UserDashboardSummary;
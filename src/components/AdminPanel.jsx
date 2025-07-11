import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserCheck, Calendar, Star, Award, Target, UserX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDeals } from '@/hooks/useDeals';

const AdminPanel = () => {
  const { users: allSystemUsers, refreshUsers: refreshAuthUsers } = useAuth(); 
  const { deals: allSystemDeals, refreshDeals: refreshDealData } = useDeals(true); 

  const [users, setUsers] = useState([]);
  const [deals, setDeals] = useState([]);

  const memoizedRefreshUsers = useCallback(() => {
    if (typeof refreshAuthUsers === 'function') {
      refreshAuthUsers();
    }
  }, [refreshAuthUsers]);

  // Don't call refresh functions here - they're already called from parent components
  useEffect(() => {
    // Data is already loaded from parent components
  }, []);

  useEffect(() => {
    setUsers(allSystemUsers || []);
  }, [allSystemUsers]);

  useEffect(() => {
    setDeals(allSystemDeals || []);
  }, [allSystemDeals]);

  const totalUsers = users.length;
  const activeUsers = users.filter(user => {
    const userDeals = deals.filter(deal => deal.userId === user.id);
    return userDeals.length > 0;
  }).length;

  const thisMonthDeals = deals.filter(deal => {
    const dealDate = new Date(deal.createdAt);
    const now = new Date();
    return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
  });

  const totalMainDeals = deals.filter(deal => deal.dealType === 'main' && deal.status === 'approved').length;
  const totalReferenceDeals = deals.filter(deal => deal.dealType === 'reference' && deal.status === 'approved').length;
  const totalEarnings = (totalMainDeals * 2000) + (totalReferenceDeals * 1000);

  const userStats = users.map(user => {
    const userDeals = deals.filter(deal => deal.userId === user.id);
    const mainDeals = userDeals.filter(deal => deal.dealType === 'main' && deal.status === 'approved').length;
    const referenceDeals = userDeals.filter(deal => deal.dealType === 'reference' && deal.status === 'approved').length;
    const userTotalEarnings = (mainDeals * 2000) + (referenceDeals * 1000);
    const pendingCount = userDeals.filter(deal => deal.status === 'pending').length;
    
    return {
      ...user,
      dealCount: userDeals.length,
      mainDeals,
      referenceDeals,
      totalEarnings: userTotalEarnings,
      pendingCount,
      lastActivity: userDeals.length > 0 ? 
        new Date(Math.max(...userDeals.map(d => new Date(d.createdAt)))).toLocaleDateString() : 
        'No activity'
    };
  });

  const adminStats = [
    {
      title: 'Total Consultants',
      value: totalUsers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: 'Registered consultants'
    },
    {
      title: 'Active Consultants',
      value: activeUsers,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      description: 'Consultants with deals'
    },
    {
      title: 'This Month Deals',
      value: thisMonthDeals.length,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      description: 'New deals this month'
    },
    {
      title: 'Total Rewards Paid',
      value: `${totalEarnings.toLocaleString()} PKR`,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      description: 'Company rewards paid out'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Admin Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {adminStats.map((stat, index) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white">Consultant Performance</CardTitle>
            <CardDescription className="text-purple-300">
              Overview of all consultants and their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 overflow-x-auto">
              {userStats.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors min-w-[500px] sm:min-w-full"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0 flex-shrink-0 min-w-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b45ff&color=fff`} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm sm:text-base">{user.name}</h3>
                      <p className="text-xs sm:text-sm text-purple-300 truncate">{user.email}</p>
                      <p className="text-xs text-purple-400 truncate">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center md:space-x-2 lg:space-x-3 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="text-center p-1">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-purple-500/20 rounded-full mb-1 mx-auto">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      </div>
                      <p className="text-xs font-semibold text-white">{user.mainDeals}</p>
                      <p className="text-xxs text-purple-300">Main</p>
                    </div>
                    <div className="text-center p-1">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-pink-500/20 rounded-full mb-1 mx-auto">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400" />
                      </div>
                      <p className="text-xs font-semibold text-white">{user.referenceDeals}</p>
                      <p className="text-xxs text-purple-300">Ref</p>
                    </div>
                    <div className="text-center p-1">
                      <p className="text-xs font-semibold text-white mt-1 sm:mt-[2.0rem]">{user.dealCount}</p>
                      <p className="text-xxs text-purple-300">Total</p>
                    </div>
                    <div className="text-center p-1">
                      <p className="text-xs font-semibold text-white mt-1 sm:mt-[2.0rem]">{user.pendingCount}</p>
                      <p className="text-xxs text-purple-300">Pending</p>
                    </div>
                    <div className="text-center col-span-2 sm:col-span-1 p-1">
                      <p className="text-sm sm:text-base font-bold gradient-text mt-1 sm:mt-[1.5rem]">{user.totalEarnings.toLocaleString()}</p>
                      <p className="text-xxs text-purple-300">PKR</p>
                    </div>
                    <div className="text-center hidden md:block p-1">
                      <p className="text-xs text-white/80 mt-1 sm:mt-[2.0rem]">{user.lastActivity}</p>
                      <p className="text-xxs text-purple-300">Activity</p>
                    </div>
                    <Badge className={`${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'} self-center mt-1 sm:mt-[1.6rem] text-xxs p-1 sm:px-1.5 sm:py-0.5`}>
                      {user.role}
                    </Badge>
                  </div>
                </motion.div>
              ))}
              
              {userStats.length === 0 && (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No consultants found</h3>
                  <p className="text-purple-300">No consultants have registered yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
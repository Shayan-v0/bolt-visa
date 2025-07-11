import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, User, FileText, Calendar, TrendingUp } from 'lucide-react';

const ActivityTracker = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = () => {
    const loginData = JSON.parse(localStorage.getItem('bolt_visa_login_history') || '[]');
    const attendanceData = JSON.parse(localStorage.getItem('bolt_visa_attendance') || '[]');
    const dealsData = JSON.parse(localStorage.getItem('bolt_visa_deals') || '[]');
    const usersData = JSON.parse(localStorage.getItem('bolt_visa_users') || '[]');
    
    setUsers(usersData);

    const allActivities = [];

    loginData.forEach(login => {
      allActivities.push({
        id: `login-${login.id}`,
        type: 'login',
        userId: login.userId,
        userName: login.userName,
        timestamp: login.timestamp,
        description: `Logged in to the system`,
        icon: User,
        color: 'text-green-400'
      });
    });

    attendanceData.forEach(attendance => {
      allActivities.push({
        id: `attendance-${attendance.id}`,
        type: 'attendance',
        userId: attendance.userId,
        userName: attendance.userName,
        timestamp: attendance.timestamp,
        description: `Marked attendance as ${attendance.status.replace('_', ' ')}`,
        icon: Calendar,
        color: 'text-blue-400'
      });
    });

    dealsData.forEach(deal => {
      allActivities.push({
        id: `deal-${deal.id}`,
        type: 'deal',
        userId: deal.userId,
        userName: deal.userName,
        timestamp: deal.createdAt,
        description: `Submitted ${deal.dealType} deal for ${deal.firstName} ${deal.lastName}`,
        icon: FileText,
        color: 'text-purple-400'
      });
    });

    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setActivities(allActivities.slice(0, 50));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getUserStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const loginData = JSON.parse(localStorage.getItem('bolt_visa_login_history') || '[]');
    const attendanceData = JSON.parse(localStorage.getItem('bolt_visa_attendance') || '[]');
    const dealsData = JSON.parse(localStorage.getItem('bolt_visa_deals') || '[]');

    const todayLogins = loginData.filter(login => 
      login.timestamp.startsWith(today)
    ).length;

    const todayAttendance = attendanceData.filter(attendance => 
      attendance.date === today
    ).length;

    const todayDeals = dealsData.filter(deal => 
      deal.createdAt.startsWith(today)
    ).length;

    return { todayLogins, todayAttendance, todayDeals };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Activity className="mr-2 h-6 w-6 text-purple-400" />
          User Activity Monitor
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="visa-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Today's Logins
            </CardTitle>
            <User className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayLogins}</div>
            <p className="text-xs text-purple-300 mt-1">Active sessions today</p>
          </CardContent>
        </Card>

        <Card className="visa-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Attendance Marked
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayAttendance}</div>
            <p className="text-xs text-purple-300 mt-1">Team members present</p>
          </CardContent>
        </Card>

        <Card className="visa-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Deals Submitted
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayDeals}</div>
            <p className="text-xs text-purple-300 mt-1">New deals today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity Feed</CardTitle>
          <CardDescription className="text-purple-300">
            Real-time activity from all team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start space-x-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500`}>
                    <activity.icon className={`h-4 w-4 text-white`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {activity.userName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                        >
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-purple-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-purple-300 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
                <p className="text-purple-300">User activities will appear here as they happen.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTracker;
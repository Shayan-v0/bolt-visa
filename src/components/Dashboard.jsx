import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDeals } from '@/hooks/useDeals';
import { useExpenses } from '@/hooks/useExpenses';
import { useDispatch } from 'react-redux';
import { fetchApplications } from '@/store/applicationsSlice';
import { loadExpenses } from '@/store/expensesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Plus, Download, FileText, DollarSign, Building, Calculator, Gift, Target, Star, CheckCircle, XCircle, Clock, TrendingUp, PieChart } from 'lucide-react';
import DealForm from '@/components/DealForm';
import DealList from '@/components/DealList';
import AdminPanel from '@/components/AdminPanel';
import PerformanceChart from '@/components/PerformanceChart';
import WelcomeBanner from '@/components/WelcomeBanner';
import ExpenseManagement from '@/components/ExpenseManagement';
import ProfitAnalysis from '@/components/ProfitAnalysis';
import UserManagement from '@/components/UserManagement';
import AttendanceSystem from '@/components/AttendanceSystem';
import ActivityTracker from '@/components/ActivityTracker';
import ApplicationStatusChart from '@/components/ApplicationStatusChart';



const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin'|| "Admin";
  const { deals, loading: dealsLoading, refreshDeals } = useDeals(isAdmin);
  const { expenses, loading: expensesLoading, refreshExpenses } = useExpenses(isAdmin);
  const [showDealForm, setShowDealForm] = useState(false);
  const hasLoadedDataRef = useRef(false);
  console.log("user",user)
  // const [applications, setApplications] = useState({})

  // Load data only once when user is available
  useEffect(() => {
    if (user && !hasLoadedDataRef.current) {
      dispatch(fetchApplications({ page: 1, limit: 10 }));
      dispatch(loadExpenses());
      hasLoadedDataRef.current = true;
    }
  }, [user, dispatch]);


  const userDeals = (deals || []).filter(deal => deal.userId === user?.id);
  const mainDealsUser = (userDeals || []).filter(deal => deal.dealType === 'main' && deal.status === 'approved');
  const referenceDealsUser = (userDeals || []).filter(deal => deal.dealType === 'reference' && deal.status === 'approved');

  const calculateUserEarnings = (userSpecificDeals) => {
    return (userSpecificDeals || []).reduce((total, deal) => {
      if (deal.status === 'approved') {
        return total + (deal.dealType === 'main' ? 2000 : 1000);
      }
      return total;
    }, 0);
  };
  const userTotalEarnings = calculateUserEarnings(userDeals);

  // Application status counts
  const totalApplications = isAdmin ? (deals || []).length : (userDeals || []).length;
  const approvedApplications = isAdmin ? (deals || []).filter(deal => deal.status === 'approved').length : (userDeals || []).filter(deal => deal.status === 'approved').length;
  const rejectedApplications = isAdmin ? (deals || []).filter(deal => deal.status === 'rejected').length : (userDeals || []).filter(deal => deal.status === 'rejected').length;
  const pendingApplications = isAdmin ? (deals || []).filter(deal => deal.status === 'pending').length : (userDeals || []).filter(deal => deal.status === 'pending').length;

  const convertToAED = (amount, currency) => {
    if (amount === null || amount === undefined || amount === '' || isNaN(parseFloat(amount))) return 0;
    const rates = { PKR: 0.013, USD: 3.67, AED: 1 };
    return parseFloat(amount) * (rates[currency] || 1);
  };

  const totalRevenue = (deals || []).reduce((sum, deal) => {
    if (deal.status === 'approved') {
      return sum + convertToAED(deal.paidAmount, deal.currency);
    }
    return sum;
  }, 0);

  const totalExpenses = (expenses || []).reduce((sum, expense) => {
    if (expense.status === 'approved') {
      return sum + convertToAED(expense.amount, expense.currency);
    }
    return sum;
  }, 0);

  const monthlyProfit = totalRevenue - totalExpenses;

  const handleDownloadReport = () => {
    // Create a CSV report
    const csvContent = [
      ['Application ID', 'Client Name', 'Status', 'Deal Type', 'Amount', 'Currency', 'Created Date'],
      ...(isAdmin ? deals : userDeals).map(deal => [
        deal.id,
        deal.clientName || 'N/A',
        deal.status,
        deal.dealType,
        deal.paidAmount || '0',
        deal.currency || 'AED',
        new Date(deal.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isAdmin ? 'admin' : 'user'}_applications_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const adminStats = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      description: 'All company applications'
    },
    {
      title: 'Approved Applications',
      value: approvedApplications,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      description: 'Successfully approved'
    },
    {
      title: 'Rejected Applications',
      value: rejectedApplications,
      icon: XCircle,
      color: 'from-red-500 to-pink-500',
      description: 'Applications rejected'
    },
    {
      title: 'Pending Applications',
      value: pendingApplications,
      icon: Clock,
      color: 'from-yellow-400 to-orange-400',
      description: 'Awaiting review'
    },
    {
      title: 'Monthly Revenue',
      value: `${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      description: 'Total revenue this month'
    },
    {
      title: 'Monthly Expenses',
      value: `${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`,
      icon: Building,
      color: 'from-red-500 to-pink-500',
      description: 'Total expenses this month'
    },
    {
      title: 'Net Profit',
      value: `${monthlyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`,
      icon: Calculator,
      color: monthlyProfit >= 0 ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-orange-500',
      description: 'Monthly profit/loss'
    }
  ];

  const userStats = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      description: 'All your applications'
    },
    {
      title: 'Approved Applications',
      value: approvedApplications,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      description: 'Your approved applications'
    },
    {
      title: 'Rejected Applications',
      value: rejectedApplications,
      icon: XCircle,
      color: 'from-red-500 to-pink-500',
      description: 'Your rejected applications'
    },
    {
      title: 'Pending Applications',
      value: pendingApplications,
      icon: Clock,
      color: 'from-yellow-400 to-orange-400',
      description: 'Your pending applications'
    },
    {
      title: 'Main Deals',
      value: mainDealsUser.length,
      icon: Gift,
      color: 'from-blue-500 to-cyan-500',
      description: 'Your approved main deals'
    },
    {
      title: 'Reference Deals',
      value: referenceDealsUser.length,
      icon: Target,
      color: 'from-orange-500 to-yellow-500',
      description: 'Your approved reference deals'
    },
    {
      title: 'Your Rewards',
      value: `${userTotalEarnings.toLocaleString()} PKR`,
      icon: Star,
      color: 'from-green-500 to-emerald-500',
      description: 'Total rewards earned (approved deals)'
    }
  ];

  const statsToDisplay = isAdmin ? adminStats : userStats;

  if (dealsLoading || expensesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {!isAdmin && <WelcomeBanner user={user} deals={deals} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-sm text-purple-300">
            {isAdmin ? 'Manage all operations and financial overview' : 'Track your applications and performance'}
          </p>
        </div>
        {!isAdmin &&
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

            <Button
              onClick={() => setShowDealForm(true)}
              className="bolt-gradient hover:scale-105 transition-transform w-full sm:w-auto flex-shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Application
            </Button>
            <Button
              onClick={handleDownloadReport}
              className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-transform w-full sm:w-auto flex-shrink-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        }
      </motion.div>

      {/* Application Status Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsToDisplay.slice(0, 4).map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="visa-card h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-purple-300 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Visual Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Application Status Chart */}
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-purple-400" />
              Application Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationStatusChart
              approved={approvedApplications}
              rejected={rejectedApplications}
              pending={pendingApplications}
            />
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
              {isAdmin ? 'Company Performance' : 'Your Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
                            <PerformanceChart
                  mainDeals={isAdmin ? (deals || []).filter(d => d.dealType === 'main' && d.status === 'approved').length : mainDealsUser.length}
                  referenceDeals={isAdmin ? (deals || []).filter(d => d.dealType === 'reference' && d.status === 'approved').length : referenceDealsUser.length}
                  totalEarnings={isAdmin ? ((deals || []).filter(d => d.status === 'approved').reduce((sum, d) => sum + (d.dealType === 'main' ? 2000 : 1000), 0)) : userTotalEarnings}
                />
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Stats for Admin */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminStats.slice(4).map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 4) * 0.1 }}
              >
                <Card className="visa-card h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-purple-300 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Stats for User */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats.slice(4).map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 4) * 0.1 }}
              >
                <Card className="visa-card h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-purple-300 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue={isAdmin ? "profit" : "deals"} className="space-y-4">
          <div className="overflow-hidden rounded-lg glass-effect border-purple-500/20 p-1">
            <TabsList className="bg-transparent p-0 overflow-x-auto whitespace-nowrap no-scrollbar w-full flex justify-start sm:justify-center">
              {!isAdmin && (
                <>
                  <TabsTrigger value="deals" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    My Applications
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Attendance
                  </TabsTrigger>
                </>
              )}
              {isAdmin && (
                <>
                  <TabsTrigger value="profit" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Profit Analysis
                  </TabsTrigger>
                  <TabsTrigger value="expenses" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Expenses
                  </TabsTrigger>
                  <TabsTrigger value="users" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="all-deals" className="text-white data-[state=active]:bg-purple-500/30 data-[state=active]:text-white px-3 py-1.5 text-sm flex-shrink-0">
                    All Applications
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {!isAdmin && (
            <>
              <TabsContent value="deals">
                <DealList deals={userDeals} isAdmin={false} />
              </TabsContent>
              <TabsContent value="performance">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="visa-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Gift className="mr-2 h-5 w-5 text-purple-400" />
                        Reward Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">Approved Main Deals ({mainDealsUser.length})</span>
                        <span className="text-white font-semibold">{(mainDealsUser.length * 2000).toLocaleString()} PKR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">Approved Reference Deals ({referenceDealsUser.length})</span>
                        <span className="text-white font-semibold">{(referenceDealsUser.length * 1000).toLocaleString()} PKR</span>
                      </div>
                      <div className="border-t border-purple-500/20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Total Earnings</span>
                          <span className="text-2xl font-bold gradient-text">{(userTotalEarnings).toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <PerformanceChart
                    mainDeals={mainDealsUser.length}
                    referenceDeals={referenceDealsUser.length}
                    totalEarnings={userTotalEarnings}
                  />
                </div>
              </TabsContent>
              <TabsContent value="attendance">
                <AttendanceSystem />
              </TabsContent>
            </>
          )}

          {isAdmin && (
            <>
              <TabsContent value="profit">
                <ProfitAnalysis />
              </TabsContent>
              <TabsContent value="expenses">
                <ExpenseManagement />
              </TabsContent>
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              <TabsContent value="attendance">
                <AttendanceSystem />
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTracker />
              </TabsContent>
              <TabsContent value="admin">
                <AdminPanel />
              </TabsContent>
              <TabsContent value="all-deals">
                <DealList deals={deals} isAdmin={true} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </motion.div>

      {showDealForm && (
        <DealForm
          isOpen={showDealForm}
          onClose={() => setShowDealForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
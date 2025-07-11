import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import UserProfile from '@/components/UserProfile';
import UserSettings from '@/components/UserSettings';

const AppContent = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    const existingUsers = localStorage.getItem('bolt_visa_users');
    if (!existingUsers) {
      const demoUsers = [
        {
          id: '1',
          name: 'Manager Admin',
          email: 'admin@bolt.com',
          password: 'admin123',
          role: 'admin',
          department: 'Management',
          position: 'Manager',
          employeeId: 'BVE-MNG-0001',
          createdAt: new Date().toISOString(),
          totalEarnings: 0,
          mainDeals: 0,
          referenceDeals: 0,
          bonuses: 0,
          avatar: "https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/53b9caa86d8744abede1406a439fa863.jpg"
        },
        {
          id: '2',
          name: 'Eman Khan',
          email: 'eman@bolt.com',
          password: 'eman123',
          role: 'user',
          department: 'Visa Consulting',
          position: 'Team Leader',
          employeeId: 'BVE-TL-0001',
          createdAt: new Date().toISOString(),
          totalEarnings: 0,
          mainDeals: 0,
          referenceDeals: 0,
          bonuses: 0,
          avatar: "https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/53b9caa86d8744abede1406a439fa863.jpg"
        }
      ];
      localStorage.setItem('bolt_visa_users', JSON.stringify(demoUsers));
    }

    const existingDeals = localStorage.getItem('bolt_visa_deals');
    if (!existingDeals) {
      localStorage.setItem('bolt_visa_deals', JSON.stringify([]));
    }

    const existingExpenses = localStorage.getItem('bolt_visa_expenses');
    if (!existingExpenses) {
      const currentDate = new Date();
      const demoExpenses = [
        {
          id: 'fixed-office_rent',
          type: 'office_rent',
          title: 'Monthly Office Rent',
          amount: '1500',
          currency: 'AED',
          category: 'Fixed Expenses',
          description: 'Monthly office space rental',
          date: currentDate.toISOString().split('T')[0],
          status: 'approved',
          isRecurring: true,
          createdAt: currentDate.toISOString()
        },
        {
          id: 'fixed-staff_salary',
          type: 'staff_salary',
          title: 'Staff Salaries',
          amount: '6000',
          currency: 'AED',
          category: 'Fixed Expenses',
          description: 'Monthly staff salaries',
          date: currentDate.toISOString().split('T')[0],
          status: 'approved',
          isRecurring: true,
          createdAt: currentDate.toISOString()
        },
        {
          id: 'fixed-travel',
          type: 'travel',
          title: 'Business Travel Expenses',
          amount: '',
          currency: 'AED',
          category: 'Fixed Expenses',
          description: 'Monthly travel and transportation costs',
          date: currentDate.toISOString().split('T')[0],
          status: 'approved',
          isRecurring: true,
          createdAt: currentDate.toISOString()
        }
      ];
      localStorage.setItem('bolt_visa_expenses', JSON.stringify(demoExpenses));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-purple-600/30">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        <Route path="/*" element={<ProtectedRoutes />} />
      ) : (
        <>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

const ProtectedRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/settings" element={<UserSettings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
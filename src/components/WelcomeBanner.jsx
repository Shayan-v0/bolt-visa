import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Trophy, Target, Banknote, UserCircle  } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoginHistory } from '../store/userSlice';

const WelcomeBanner = ({ user, deals }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const loginHistory = JSON.parse(localStorage.getItem('bolt_visa_login_history') || '[]');
      const today = new Date().toISOString().split('T')[0];

      const todayLogins = loginHistory.filter(login =>
        login.userId === user.id && login.timestamp.startsWith(today)
      );

      if (todayLogins.length === 0) {
        const loginRecord = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          timestamp: new Date().toISOString(),
          date: today
        };

        loginHistory.push(loginRecord);
        localStorage.setItem('bolt_visa_login_history', JSON.stringify(loginHistory));
        
        // Update RTK state
        dispatch(setLoginHistory(loginHistory));
      }
    }
  }, [user, dispatch]);

  const mainDeal = (deals || []).filter((val) => val.dealType == 'Main Deal')
  const subDeal = (deals || []).filter((val) => val.dealType == 'Sub Deal')
  const familyDeal = (deals || []).filter((val) => val.dealType == 'Familt Deal')
  console.log('deals welcome ', subDeal)
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name?.split(' ')[0] || 'Champion';

    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 17) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  const motivationalMessages = [
    "Ready to close some amazing deals today?",
    "Your next success story starts now!",
    "Let's make today profitable!",
    "Time to turn opportunities into rewards!",
    "Every deal brings you closer to your goals!",
    "Today is perfect for breaking records!",
    "Your expertise makes dreams come true!",
    "Another day, another opportunity to excel!"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <Card className="glass-effect border-purple-500/20 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
          
          {/* Animated sparkles */}
          <div className="absolute top-4 right-4">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>

          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <UserCircle className="h-8 w-8 text-purple-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {getGreeting()}! 👋
                    </h1>
                    <p className="text-purple-300 text-sm">
                      {randomMessage}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-white text-sm">
                      Main Deals: <span className="font-semibold text-yellow-400">{mainDeal.length}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    <span className="text-white text-sm">
                      Sub Deals: <span className="font-semibold text-blue-400">{subDeal.length}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-5 w-5 text-green-400" />
                    <span className="text-white text-sm">
                      Family Deals: <span className="font-semibold text-green-400">{familyDeal.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default WelcomeBanner;
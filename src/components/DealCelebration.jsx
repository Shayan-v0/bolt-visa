import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Gift, Sparkles, X } from 'lucide-react';

const DealCelebration = ({ deal, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const celebrationMessages = {
    "Main Deal": [
      "🎉 Outstanding! You've closed a Main Deal!",
      "💰 Fantastic work! 2,000 PKR reward earned!",
      "🌟 You're on fire! Another main deal in the books!",
      "🚀 Excellent performance! Keep up the great work!"
    ],
    "Sub Deal": [
      "🎊 Great job! Reference deal successfully closed!",
      "💎 Well done! 1,000 PKR reward earned!",
      "⭐ Nice work! Your referral skills are impressive!",
      "🎯 Perfect! Another satisfied client referred!"
    ]
  };

  const getRandomMessage = (dealType) => {
    const messages = celebrationMessages[dealType];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const confettiElements = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
      initial={{
        x: Math.random() * window.innerWidth,
        y: -10,
        rotate: 0,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{
        y: window.innerHeight + 10,
        rotate: 360,
        x: Math.random() * window.innerWidth
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        ease: "easeOut",
        delay: Math.random() * 2
      }}
    />
  ));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {confettiElements}
          </div>
        )}
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-md w-full mx-4"
        >
          <Card className="glass-effect border-purple-500/30 overflow-hidden">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-4"
              >
                Congratulations! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-purple-300 mb-6"
              >
                {getRandomMessage(deal.dealType)}
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300">Case ID:</span>
                    <span className="text-white font-mono font-bold">{deal.caseId}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300">Client:</span>
                    <span className="text-white">{deal.firstName} {deal.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300">Deal Type:</span>
                    <span className="text-white capitalize">{deal.dealType} Deal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Reward:</span>
                    <span className="text-2xl font-bold gradient-text">
                      {deal.dealType === 'main' ? '2,000' : '1,000'} PKR
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <Button
                    onClick={onClose}
                    className="bolt-gradient hover:scale-105 transition-transform"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Awesome! Continue Working
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DealCelebration;
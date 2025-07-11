import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Filter } from 'lucide-react';

const PerformanceFilter = ({ onFilterChange }) => {
  const handlePeriodChange = (period) => {
    onFilterChange({ period, date: null });
  };

  const handleDateChange = (e) => {
    onFilterChange({ period: 'custom', date: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="visa-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-purple-300 mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm">Performance Period:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePeriodChange('today')}
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Clock className="h-4 w-4 mr-1" />
                Today
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePeriodChange('weekly')}
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Calendar className="h-4 w-4 mr-1" />
                This Week
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePeriodChange('monthly')}
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Calendar className="h-4 w-4 mr-1" />
                This Month
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePeriodChange('all')}
                className="border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                All Time
              </Button>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Calendar className="h-4 w-4 text-purple-300" />
              <Input
                type="date"
                onChange={handleDateChange}
                className="glass-effect border-purple-500/20 text-white w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceFilter;
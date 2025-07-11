import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

const SearchAndFilter = ({ onSearch, onFilter, deals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dealType: '',
    currency: '',
    hasRemainingPayment: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      dealType: '',
      currency: '',
      hasRemainingPayment: ''
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
    setSearchTerm('');
    onSearch('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
          <Input
            placeholder="Search by case ID, client name, phone, passport, nationality..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 glass-effect border-purple-500/20 text-white placeholder:text-purple-300"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-40 glass-effect border-purple-500/20 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="glass-effect border-purple-500/20">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Completed</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.dealType} onValueChange={(value) => handleFilterChange('dealType', value)}>
            <SelectTrigger className="w-40 glass-effect border-purple-500/20 text-white">
              <SelectValue placeholder="Deal Type" />
            </SelectTrigger>
            <SelectContent className="glass-effect border-purple-500/20">
              <SelectItem value="main">Main Deals</SelectItem>
              <SelectItem value="reference">Reference Deals</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.hasRemainingPayment} onValueChange={(value) => handleFilterChange('hasRemainingPayment', value)}>
            <SelectTrigger className="w-48 glass-effect border-purple-500/20 text-white">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent className="glass-effect border-purple-500/20">
              <SelectItem value="true">Has Remaining Payment</SelectItem>
              <SelectItem value="false">Fully Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
            <SelectTrigger className="w-32 glass-effect border-purple-500/20 text-white">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="glass-effect border-purple-500/20">
              <SelectItem value="PKR">PKR</SelectItem>
              <SelectItem value="AED">AED</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-purple-500/20 text-white hover:bg-purple-500/10"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Search: "{searchTerm}"
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Status: {filters.status}
            </Badge>
          )}
          {filters.dealType && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Type: {filters.dealType}
            </Badge>
          )}
          {filters.hasRemainingPayment && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Payment: {filters.hasRemainingPayment === 'true' ? 'Remaining' : 'Fully Paid'}
            </Badge>
          )}
          {filters.currency && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Currency: {filters.currency}
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SearchAndFilter;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building, Users, Car, DollarSign, Edit } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm'; 
import ExpenseList from '@/components/ExpenseList'; 

const ExpenseManagement = () => {
  const { expenses, refreshExpenses } = useExpenses(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditingFixed, setIsEditingFixed] = useState(false);

  // No need to call refreshExpenses here - it's already called from the parent component

  const convertToAED = (amount, currency) => {
    if (amount === null || amount === undefined || amount === '' || isNaN(parseFloat(amount))) return 0;
    const rates = { PKR: 0.013, USD: 3.67, AED: 1 };
    return parseFloat(amount) * (rates[currency] || 1);
  };

  const getCategoryTotal = (type) => {
    return (expenses || [])
      .filter(exp => exp.type === type && exp.status === 'approved')
      .reduce((sum, exp) => sum + convertToAED(exp.amount, exp.currency), 0);
  };
  
  const officeRentTotal = getCategoryTotal('office_rent');
  const staffSalaryTotal = getCategoryTotal('staff_salary');
  const travelTotal = getCategoryTotal('travel');

  const otherVariableExpenses = (expenses || []).filter(exp => !exp.isRecurring);
  const otherExpensesTotal = otherVariableExpenses
    .filter(exp => exp.status === 'approved')
    .reduce((sum, exp) => sum + convertToAED(exp.amount, exp.currency), 0);
  
  const totalExpensesAED = officeRentTotal + staffSalaryTotal + travelTotal + otherExpensesTotal;

  const fixedExpenseCategories = [
    { type: 'office_rent', title: 'Office Rent', icon: Building, currentTotal: officeRentTotal },
    { type: 'staff_salary', title: 'Staff Salaries', icon: Users, currentTotal: staffSalaryTotal },
    { type: 'travel', title: 'Travel Expenses', icon: Car, currentTotal: travelTotal },
  ];
  
  const openEditFormForFixed = (type) => {
    const existingFixedExpense = (expenses || []).find(exp => exp.type === type && exp.isRecurring);
    const categoryDefaults = {
      office_rent: { id: 'fixed-office_rent', title: 'Monthly Office Rent', amount: '1500', currency: 'AED', category: 'Fixed Expenses', description: 'Monthly office space rental', isRecurring: true, type: 'office_rent', date: new Date().toISOString().split('T')[0], status: 'approved' },
      staff_salary: { id: 'fixed-staff_salary', title: 'Staff Salaries', amount: '6000', currency: 'AED', category: 'Fixed Expenses', description: 'Monthly staff salaries', isRecurring: true, type: 'staff_salary', date: new Date().toISOString().split('T')[0], status: 'approved' },
      travel: { id: 'fixed-travel', title: 'Business Travel Expenses', amount: '', currency: 'AED', category: 'Fixed Expenses', description: 'Monthly travel and transportation costs', isRecurring: true, type: 'travel', date: new Date().toISOString().split('T')[0], status: 'approved' },
    };
    setEditingExpense(existingFixedExpense || categoryDefaults[type]);
    setIsEditingFixed(true);
    setShowExpenseForm(true);
  };
  
  const openAddOtherExpenseForm = () => {
    setEditingExpense(null);
    setIsEditingFixed(false);
    setShowExpenseForm(true);
  };

  const openEditOtherExpenseForm = (expense) => {
    setEditingExpense(expense);
    setIsEditingFixed(false);
    setShowExpenseForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-white mb-2">Expense Management</h2>
          <p className="text-purple-300">Manage office rent, staff salaries, and other business expenses</p>
        </div>
        <Button
          onClick={openAddOtherExpenseForm}
          className="bolt-gradient hover:scale-105 transition-transform w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Other Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {fixedExpenseCategories.map(item => (
          <Card className="visa-card group relative" key={item.type}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7 text-purple-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" 
              onClick={() => openEditFormForFixed(item.type)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-white text-sm md:text-base flex items-center">
                <item.icon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-400" />{item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl md:text-2xl font-bold text-white">{item.currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED</div>
              <p className="text-xs text-purple-300">Monthly total</p>
            </CardContent>
          </Card>
        ))}
         <Card className="visa-card">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-white text-sm md:text-base flex items-center"><DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-400" />Total Expenses</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-xl md:text-2xl font-bold text-white">
                    {totalExpensesAED.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </div>
                <p className="text-xs text-purple-300">Current monthly total</p>
            </CardContent>
          </Card>
      </div>

      <ExpenseList 
        expenses={otherVariableExpenses} 
        isAdmin={true} 
        onEdit={openEditOtherExpenseForm} 
        title="Other Variable Expenses"
      />

      {showExpenseForm && (
        <ExpenseForm
          isOpen={showExpenseForm}
          onClose={() => { setShowExpenseForm(false); setEditingExpense(null); setIsEditingFixed(false); }}
          expense={editingExpense}
          isFixedExpense={isEditingFixed}
        />
      )}
    </div>
  );
};

export default ExpenseManagement;
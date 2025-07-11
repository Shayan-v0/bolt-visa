import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth.jsx';
import {
  loadExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearError
} from '../store/expensesSlice';

export const useExpenses = (isAdminView = false) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data: allExpenses, loading, error } = useSelector(state => state.expenses);

  const refreshExpenses = useCallback(() => {
    dispatch(loadExpenses());
  }, [dispatch]);

  const addExpenseHandler = async (expenseData) => {
    if (!user && !expenseData.isRecurring) {
      return { success: false, error: "User not authenticated for non-recurring expense" };
    }
    
    try {
      const expenseWithUser = {
        ...expenseData,
        userId: user?.id,
        userName: user?.name
      };
      await dispatch(addExpense(expenseWithUser)).unwrap();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateExpenseHandler = async (id, updates) => {
    try {
      await dispatch(updateExpense({ id, updates })).unwrap();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteExpenseHandler = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const approveExpense = async (id) => {
    return updateExpenseHandler(id, { status: 'approved', approvedAt: new Date().toISOString() });
  };

  const rejectExpense = async (id, reason) => {
    return updateExpenseHandler(id, { status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason });
  };

  // Filter expenses based on user role and view
  const expenses = isAdminView || user?.role === 'admin'
    ? allExpenses
    : allExpenses.filter(expense => expense.userId === user?.id && !expense.isRecurring);

  return {
    expenses,
    loading,
    error,
    addExpense: addExpenseHandler,
    updateExpense: updateExpenseHandler,
    deleteExpense: deleteExpenseHandler,
    approveExpense,
    rejectExpense,
    refreshExpenses,
    clearError: () => dispatch(clearError())
  };
};
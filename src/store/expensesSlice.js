import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for loading expenses
export const loadExpenses = createAsyncThunk(
  'expenses/loadExpenses',
  async (_, { getState }) => {
    // Simulate API call - in real app, this would be an API call
    const allExpenses = JSON.parse(localStorage.getItem('bolt_visa_expenses') || '[]');
    
    const fixedExpenseTypes = ['office_rent', 'staff_salary', 'travel'];
    fixedExpenseTypes.forEach(type => {
      if (!allExpenses.find(exp => exp.type === type && exp.isRecurring)) {
        const defaults = {
          office_rent: { 
            id: `fixed-${type}`, 
            type: 'office_rent', 
            title: 'Monthly Office Rent', 
            amount: '1500', 
            currency: 'AED', 
            category: 'Fixed Expenses', 
            description: 'Monthly office space rental', 
            date: new Date().toISOString().split('T')[0], 
            status: 'approved', 
            isRecurring: true, 
            createdAt: new Date().toISOString() 
          },
          staff_salary: { 
            id: `fixed-${type}`, 
            type: 'staff_salary', 
            title: 'Staff Salaries', 
            amount: '6000', 
            currency: 'AED', 
            category: 'Fixed Expenses', 
            description: 'Monthly staff salaries', 
            date: new Date().toISOString().split('T')[0], 
            status: 'approved', 
            isRecurring: true, 
            createdAt: new Date().toISOString() 
          },
          travel: { 
            id: `fixed-${type}`, 
            type: 'travel', 
            title: 'Business Travel Expenses', 
            amount: '0', 
            currency: 'AED', 
            category: 'Fixed Expenses', 
            description: 'Monthly travel and transportation costs', 
            date: new Date().toISOString().split('T')[0], 
            status: 'approved', 
            isRecurring: true, 
            createdAt: new Date().toISOString() 
          },
        };
        if (defaults[type]) {
          allExpenses.push(defaults[type]);
        }
      }
    });
    
    localStorage.setItem('bolt_visa_expenses', JSON.stringify(allExpenses));
    return allExpenses;
  }
);

// Async thunk for adding expense
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { getState }) => {
    const allExpenses = JSON.parse(localStorage.getItem('bolt_visa_expenses') || '[]');
    const newExpense = {
      id: expenseData.id || Date.now().toString(),
      ...expenseData,
      userId: expenseData.isRecurring ? 'system' : expenseData.userId,
      userName: expenseData.isRecurring ? 'System Fixed' : expenseData.userName,
      status: expenseData.isRecurring ? 'approved' : 'pending',
      createdAt: new Date().toISOString()
    };

    allExpenses.push(newExpense);
    localStorage.setItem('bolt_visa_expenses', JSON.stringify(allExpenses));
    return newExpense;
  }
);

// Async thunk for updating expense
export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, updates }, { getState }) => {
    const allExpenses = JSON.parse(localStorage.getItem('bolt_visa_expenses') || '[]');
    const index = allExpenses.findIndex(expense => expense.id === id);
    
    if (index !== -1) {
      allExpenses[index] = { ...allExpenses[index], ...updates };
      localStorage.setItem('bolt_visa_expenses', JSON.stringify(allExpenses));
      return { id, updates: allExpenses[index] };
    }
    throw new Error('Expense not found');
  }
);

// Async thunk for deleting expense
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { getState }) => {
    const allExpenses = JSON.parse(localStorage.getItem('bolt_visa_expenses') || '[]');
    const expenseToDelete = allExpenses.find(exp => exp.id === id);
    
    if (expenseToDelete && expenseToDelete.isRecurring) {
      throw new Error('Fixed recurring expenses cannot be deleted through this interface.');
    }
    
    const filteredExpenses = allExpenses.filter(expense => expense.id !== id);
    localStorage.setItem('bolt_visa_expenses', JSON.stringify(filteredExpenses));
    return id;
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load expenses cases
      .addCase(loadExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add expense cases
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update expense cases
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload.updates;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete expense cases
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(exp => exp.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = expensesSlice.actions;
export default expensesSlice.reducer; 
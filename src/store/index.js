import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './applicationsSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import expensesReducer from './expensesSlice';

const store = configureStore({
  reducer: {
    applications: applicationsReducer,
    auth: authReducer,
    user: userReducer,
    expenses: expensesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store; 
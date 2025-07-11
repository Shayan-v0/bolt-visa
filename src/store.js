import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import userReducer from './store/userSlice';
import applicationsReducer from './store/applicationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    applications: applicationsReducer,
  },
});

export default store; 
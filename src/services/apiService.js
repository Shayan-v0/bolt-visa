// Centralized API service using RTK and cookies
// This file exports all the async thunks and provides a clean API interface

// Auth related exports
export {
  loginUser,
  updateUserProfile,
  setUser,
  setToken,
  setLoading,
  logout,
  clearError
} from '../store/authSlice';

// User management exports
export {
  registerUser,
  editUser,
  fetchAllUsers,
  setPage as setUserPage,
  setLimit as setUserLimit,
  clearError as clearUserError
} from '../store/userSlice';

// Applications exports
export {
  fetchApplications,
  deleteApplication,
  addApplication,
  updateApplicationStatus,
  editApplication,
  setPage as setApplicationPage,
  setLimit as setApplicationLimit,
  clearError as clearApplicationError
} from '../store/applicationsSlice';

// Selectors for easy state access
export const selectAuth = (state) => state.auth;
export const selectUsers = (state) => state.users;
export const selectApplications = (state) => state.applications;

// Helper functions for common operations
export const getAuthToken = () => {
  const Cookies = require('js-cookie');
  return Cookies.get('bolt_visa_token');
};

export const isAuthenticated = (state) => {
  return !!state.auth.token && !!state.auth.user;
};

export const getUserRole = (state) => {
  return state.auth.user?.role;
};

export const isAdmin = (state) => {
  return getUserRole(state) === 'admin' || getUserRole(state) === 'Admin';
}; 
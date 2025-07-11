import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setUser, setToken, logout as reduxLogout, loginUser, fetchUserProfile } from '../store/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);



  // Load user from cookie/session on mount and fetch profile if needed
  useEffect(() => {
    const tokenFromCookie = Cookies.get('bolt_visa_token');
    if (tokenFromCookie && !token) {
      dispatch(setToken(tokenFromCookie));
    }
    
    // Fetch user profile if we have a token and userId but no user
    if (token && userId && !user && !loading) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, token, userId, user, loading]);

  const login = useCallback(async (email, password, deviceType = 'web') => {
    try {
      const result = await dispatch(loginUser({ email, password, deviceType })).unwrap();
      return { success: true, user: result.data };
    } catch (err) {
      throw new Error(err.message || 'Invalid credentials. Please check your email and password.');
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(reduxLogout());
  }, [dispatch]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
  }), [user, loading, error, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
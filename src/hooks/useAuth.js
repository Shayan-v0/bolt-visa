import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  loadUsersFromStorage, 
  loadCurrentUserFromStorage, 
  saveCurrentUserToStorage, 
  removeCurrentUserFromStorage,
  getStoredUsers,
  saveUsersToStorage,
  saveLoginHistory,
  generateAvatarUrl
} from '@/services/authService';
import { loginUser } from '@/apis/user/authentication';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const _loadData = useCallback(() => {
    setLoading(true);
    try {
      const storedUsers = loadUsersFromStorage();
      setUsers(storedUsers);
      const storedCurrentUser = loadCurrentUserFromStorage();
      
      if (storedCurrentUser) {
        const userFromList = storedUsers.find(u => u.id === storedCurrentUser.id);
        if (userFromList) {
          setCurrentUser(prev => JSON.stringify(prev) !== JSON.stringify(userFromList) ? userFromList : prev);
        } else {
          setCurrentUser(null);
          removeCurrentUserFromStorage();
        }
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error loading data from authService:", error);
      setUsers([]);
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    _loadData();
  }, [_loadData]);

  const refreshUsers = useCallback(() => {
    _loadData();
  }, [_loadData]);

  const login = useCallback(async (email, password, deviceType = 'web') => {
    setLoading(true);
    try {
      const response = await loginUser(email, password, deviceType);
      if (response.success && response.user && response.token) {
        localStorage.setItem('bolt_visa_token', response.token);
        saveCurrentUserToStorage(response.user);
        setCurrentUser(response.user);
        saveLoginHistory(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      } else {
        setLoading(false);
        throw new Error(response.message || 'Invalid credentials.');
      }
    } catch (err) {
      setLoading(false);
      throw new Error(err.message || 'Invalid credentials. Please check your email and password.');
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    removeCurrentUserFromStorage();
  }, []);

  const addUser = useCallback((userData) => {
    const currentUsers = getStoredUsers();
    if (currentUsers.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists.' };
    }
    const newUser = { 
      ...userData, 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString(),
      totalEarnings: 0,
      mainDeals: 0,
      referenceDeals: 0,
      bonuses: 0,
      avatar: userData.avatar || generateAvatarUrl(userData.name)
    };
    const updatedUsers = [...currentUsers, newUser];
    saveUsersToStorage(updatedUsers);
    refreshUsers();
    return { success: true, user: newUser };
  }, [refreshUsers]);

  const updateUser = useCallback(async (userId, updates) => {
    let currentUsers = getStoredUsers();
    const userIndex = currentUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }
    
    const oldUserData = currentUsers[userIndex];
    let updatedUser = { ...oldUserData, ...updates };
    
    if (!updates.password || updates.password === '') {
      updatedUser.password = oldUserData.password;
    }
    
    if (updates.avatar && typeof updates.avatar === 'string') { 
      updatedUser.avatar = updates.avatar;
    } else if (!updates.avatar) {
      if (updates.name && oldUserData.avatar && !oldUserData.avatar.startsWith('data:image')) {
        updatedUser.avatar = generateAvatarUrl(updates.name);
      } else {
        updatedUser.avatar = oldUserData.avatar;
      }
    }


    currentUsers[userIndex] = updatedUser;
    saveUsersToStorage(currentUsers);
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
      saveCurrentUserToStorage(updatedUser);
    }
    refreshUsers();
    return { success: true, user: updatedUser };
  }, [refreshUsers, currentUser]);

  const deleteUser = useCallback((userId) => {
    let currentUsers = getStoredUsers();
    const userToDelete = currentUsers.find(u => u.id === userId);

    if (!userToDelete) {
      return { success: false, error: 'User not found.' };
    }
    if (userToDelete.role === 'admin' && currentUsers.filter(u => u.role === 'admin').length <= 1) {
      return { success: false, error: 'Cannot delete the last admin account.' };
    }

    const updatedUsers = currentUsers.filter(u => u.id !== userId);
    saveUsersToStorage(updatedUsers);
    refreshUsers();
    return { success: true };
  }, [refreshUsers]);

  const contextValue = useMemo(() => ({
    user: currentUser, 
    users, 
    loading, 
    login,
    logout, 
    addUser, 
    updateUser, 
    deleteUser, 
    isAdmin: currentUser?.role === 'admin',
    refreshUsers
  }), [currentUser, users, loading, login, logout, addUser, updateUser, deleteUser, refreshUsers]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
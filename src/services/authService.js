const STORAGE_KEYS = {
  USERS: 'bolt_visa_users',
  CURRENT_USER: 'bolt_visa_currentUser',
  LOGIN_HISTORY: 'bolt_visa_login_history',
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

const saveUsers = (usersArray) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersArray));
};

const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  console.log('bolt_visa_currentUser' === STORAGE_KEYS.CURRENT_USER)
  console.log('user mila', user)
  return user ? JSON.parse(user) : null;
};

const saveCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  console.log('currentr user null hogya')
};

const getLoginHistory = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY) || '[]');
};

const addLoginHistoryEntry = (userId, userName) => {
  const history = getLoginHistory();
  history.push({
    id: Date.now().toString(),
    userId,
    userName,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(history));
};

const findUserByCredentials = (email, password) => {
  const users = getUsers();
  return users.find(u => u.email === email && u.password === password);
};

const findUserByIdInList = (usersList, userId) => {
  return usersList.find(u => u.id === userId);
};

const checkEmailExists = (email) => {
  const users = getUsers();
  return users.some(u => u.email === email);
};

const generateAvatarUrl = (name) => {
  if (!name) return `https://ui-avatars.com/api/?name=User&background=8b45ff&color=fff`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b45ff&color=fff`;
};

const createUserObject = (userData) => {
  return {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    totalEarnings: 0,
    mainDeals: 0,
    referenceDeals: 0,
    bonuses: 0,
    avatar: userData.avatar || generateAvatarUrl(userData.name),
  };
};

const applyUserUpdates = (userId, updates) => {
  let users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { success: false, error: 'User not found.', user: null };
  }

  const oldUserData = users[userIndex];
  const updatedUser = { ...oldUserData, ...updates };

  if (updates.password && updates.password !== '') {
    updatedUser.password = updates.password;
  } else {
    updatedUser.password = oldUserData.password;
  }

  if (updates.avatar && typeof updates.avatar === 'string') {
    updatedUser.avatar = updates.avatar;
  } else if (updates.name && !updates.avatar && typeof updates.name === 'string') {
    if (oldUserData.avatar && oldUserData.avatar.startsWith('data:image')) {
      updatedUser.avatar = oldUserData.avatar;
   } else {
     updatedUser.avatar = generateAvatarUrl(updates.name);
   }
  } else if (!updates.avatar) {
      updatedUser.avatar = oldUserData.avatar;
  }

  users[userIndex] = updatedUser;
  saveUsers(users);
  return { success: true, user: updatedUser };
};

const removeUserObject = (userId) => {
  let users = getUsers();
  const userToDelete = users.find(u => u.id === userId);

  if (!userToDelete) {
    return { success: false, error: 'User not found.' };
  }
  if (userToDelete.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
    return { success: false, error: 'Cannot delete the last admin account.' };
  }

  const updatedUsers = users.filter(u => u.id !== userId);
  saveUsers(updatedUsers);
  return { success: true };
};

export { generateAvatarUrl };

export const authService = {
  getUsers,
  saveUsers,
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  getLoginHistory,
  addLoginHistoryEntry,
  findUserByCredentials,
  findUserByIdInList,
  checkEmailExists,
  createUserObject,
  applyUserUpdates,
  removeUserObject,
  generateAvatarUrl,
};
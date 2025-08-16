// In-memory user storage (temporary, resets on server restart)
// In production, this would be replaced with a database
let users = [];

export const addUser = (userData) => {
  users.push(userData);
  console.log('✅ User added to storage:', userData.email);
  console.log('📊 Total users in storage:', users.length);
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserByCredentials = (email, password) => {
  return users.find(user => user.email === email && user.password === password);
};

export const getAllUsers = () => {
  return users;
};

export const getUserCount = () => {
  return users.length;
};

export const clearUsers = () => {
  users = [];
  console.log('🗑️ All users cleared from storage');
};

export const updateUser = (email, updates) => {
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    console.log('✅ User updated:', email, updates);
    return true;
  }
  return false;
}; 
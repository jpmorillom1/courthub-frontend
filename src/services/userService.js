// Mock data para usuarios
const mockUsers = [
  {
    id: '1',
    email: 'admin@uce.edu.ec',
    name: 'Admin User',
    role: 'admin',
    studentId: null,
    faculty: null,
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'sarah.johnson@uce.edu.ec',
    name: 'Sarah Johnson',
    role: 'student',
    studentId: '20234567',
    faculty: 'Engineering',
    createdAt: '2023-02-20T14:00:00Z',
  },
  {
    id: '3',
    email: 'david.lee@uce.edu.ec',
    name: 'David Lee',
    role: 'student',
    studentId: '20234568',
    faculty: 'Sciences',
    createdAt: '2023-02-22T09:00:00Z',
  },
  {
    id: '4',
    email: 'michael.chen@uce.edu.ec',
    name: 'Michael Chen',
    role: 'student',
    studentId: '20234569',
    faculty: 'Engineering',
    createdAt: '2023-03-01T11:00:00Z',
  },
  {
    id: '5',
    email: 'emma.rodriguez@uce.edu.ec',
    name: 'Emma Rodriguez',
    role: 'student',
    studentId: '20234570',
    faculty: 'Medicine',
    createdAt: '2023-03-05T13:00:00Z',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  async getAllUsers() {
    await delay(600);
    return mockUsers;
  },

  async getUserById(userId) {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async updateUser(userId, userData) {
    await delay(500);
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  },

  async deleteUser(userId) {
    await delay(500);
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
    return { success: true };
  },

  async getCurrentUserProfile() {
    await delay(400);
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not authenticated');
    }
    const currentUser = JSON.parse(userStr);
    return mockUsers.find((u) => u.id === currentUser.id) || currentUser;
  },
};


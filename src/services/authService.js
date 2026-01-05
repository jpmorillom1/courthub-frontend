// Mock data para autenticación
const mockUsers = [
  {
    id: '1',
    email: 'admin@uce.edu.ec',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    studentId: null,
  },
  {
    id: '2',
    email: 'sarah.johnson@uce.edu.ec',
    password: 'student123',
    name: 'Sarah Johnson',
    role: 'student',
    studentId: '20234567',
    faculty: 'Engineering',
  },
  {
    id: '3',
    email: 'david.lee@uce.edu.ec',
    password: 'student123',
    name: 'David Lee',
    role: 'student',
    studentId: '20234568',
    faculty: 'Sciences',
  },
];

// Simular delay de red
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(800); // Simular llamada a API
    
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `mock_token_${user.id}_${Date.now()}`;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return {
      token,
      user: userWithoutPassword,
    };
  },

  async register(userData) {
    await delay(1000);

    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      role: 'student',
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return {
      token,
      user: userWithoutPassword,
    };
  },

  async logout() {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};


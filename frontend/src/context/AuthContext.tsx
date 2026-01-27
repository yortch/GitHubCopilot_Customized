import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

interface User {
  userId: number;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Token storage helpers
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setIsLoggedIn(true);
      setIsAdmin(storedUser.isAdmin);
      setUser(storedUser);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Store token and user data
      setStoredToken(token);
      setStoredUser(userData);
      
      // Update state
      setIsLoggedIn(true);
      setIsAdmin(userData.isAdmin);
      setUser(userData);
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password
      });
      
      const { token, userId, isAdmin: userIsAdmin } = response.data;
      const userData: User = {
        userId,
        email,
        isAdmin: userIsAdmin
      };
      
      // Store token and user data
      setStoredToken(token);
      setStoredUser(userData);
      
      // Update state
      setIsLoggedIn(true);
      setIsAdmin(userIsAdmin);
      setUser(userData);
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Registration failed:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (for potential server-side cleanup)
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear stored data regardless of API call success
      removeStoredToken();
      removeStoredUser();
      
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
      
      // Update state
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/request-reset`, { email });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw new Error('Failed to request password reset');
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        resetToken,
        newPassword
      });
    } catch (error) {
      console.error('Password reset failed:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to reset password');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isAdmin, 
      user, 
      login, 
      register, 
      logout, 
      requestPasswordReset, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Password validation matching server side validation rules
  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  };

  // Create a new user
  const signup = async (email: string, password: string, name: string) => {
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
    }
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        displayName: name,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to sign up';
      throw new Error(msg);
    }
  };

  // Login existing user
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to log in';
      throw new Error(msg);
    }
  };

  // Login with Google (not active in frontend, kept to satisfy type interface)
  const loginWithGoogle = async () => {
    console.warn('Google Login is not supported in MERN version.');
    throw new Error('Google Login is not supported in MERN version.');
  };

  // Reset password
  const resetPassword = async (email: string) => {
    console.warn('Reset Password is not supported in local MERN version.');
    throw new Error('Reset Password is not supported in local MERN version.');
  };

  // Update user profile
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      const response = await api.put('/auth/profile', {
        displayName,
        photoURL,
      });
      const { user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update profile';
      throw new Error(msg);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error during backend logout check:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Listen for local authentication token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          const user = response.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          setCurrentUser(user);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
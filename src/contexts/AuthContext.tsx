import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'technician' | 'manager';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkUserExists: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_KEY = 'gearguard_user';
const REGISTERED_USERS_KEY = 'gearguard_registered_users';
const PASSWORDS_KEY = 'gearguard_passwords';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  // Persist registered users
  useEffect(() => {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Persist passwords (in real app, this would be hashed and stored securely)
  useEffect(() => {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }, [passwords]);

  const checkUserExists = (email: string): boolean => {
    return registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if user exists
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      return { 
        success: false, 
        error: 'No account found with this email. Please sign up first.' 
      };
    }

    // Validate password
    const storedPassword = passwords[email.toLowerCase()];
    if (storedPassword !== password) {
      return { 
        success: false, 
        error: 'Invalid password. Please try again.' 
      };
    }

    // Login successful
    setUser(existingUser);
    localStorage.setItem(USER_KEY, JSON.stringify(existingUser));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Validate inputs
    if (!email || !password || !name) {
      return { 
        success: false, 
        error: 'All fields are required.' 
      };
    }

    if (password.length < 4) {
      return { 
        success: false, 
        error: 'Password must be at least 4 characters.' 
      };
    }

    // Check if user already exists
    if (checkUserExists(email)) {
      return { 
        success: false, 
        error: 'An account with this email already exists. Please login instead.' 
      };
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
    };

    // Save user and password
    setRegisteredUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [email.toLowerCase()]: password }));
    
    // Auto-login after signup
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        registeredUsers,
        login,
        signup,
        logout,
        checkUserExists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

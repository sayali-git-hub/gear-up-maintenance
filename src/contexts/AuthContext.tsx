import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'technician' | 'manager';
}

interface RegisteredUser {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkUserExists: (email: string) => boolean;
}

const REGISTERED_USERS_KEY = 'gearguard_registered_users';

const getRegisteredUsers = (): RegisteredUser[] => {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveRegisteredUser = (user: RegisteredUser) => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('gearguard_user');
    return stored ? JSON.parse(stored) : null;
  });

  const checkUserExists = (email: string): boolean => {
    const users = getRegisteredUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getRegisteredUsers();
    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!existingUser) {
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        return { success: false, error: 'No account found with this email. Please sign up first.' };
      }
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    const loggedInUser: User = {
      id: `user-${Date.now()}`,
      email: existingUser.email,
      name: existingUser.name,
      role: 'manager',
    };
    setUser(loggedInUser);
    localStorage.setItem('gearguard_user', JSON.stringify(loggedInUser));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || password.length < 4 || !name) {
      return { success: false, error: 'Please fill in all fields with valid data.' };
    }

    // Check if user already exists
    if (checkUserExists(email)) {
      return { success: false, error: 'An account with this email already exists. Please login instead.' };
    }

    // Register the new user
    saveRegisteredUser({ email, password, name });

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
    };
    setUser(newUser);
    localStorage.setItem('gearguard_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gearguard_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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

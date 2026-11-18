import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types/trade.types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (token: string, userProfile?: Partial<UserProfile>) => void;
  logout: () => void;
  setDemoMode: (enabled: boolean) => void;
}

const defaultUser: UserProfile = {
  id: 'usr-001',
  name: 'Collins Olayemi',
  email: 'collins.olayemi@tradefin.com',
  role: 'Trade Operations Approver',
  branch: 'Head Office - Trade & Treasury Services',
  permissions: [
    'ISSUE_LETTER_OF_CREDIT',
    'AUTHORISE_LETTER_OF_CREDIT',
    'AMEND_LETTER_OF_CREDIT',
    'VIEW_ALL_LETTER_OF_CREDIT_RECORDS',
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>('demo_jwt_token_2026');
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const login = (authToken: string, userProfile?: Partial<UserProfile>) => {
    setToken(authToken);
    apiClient.setToken(authToken);
    setUser({
      ...defaultUser,
      ...userProfile,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    apiClient.setToken(null);
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (enabled && !user) {
      setUser(defaultUser);
      setToken('demo_jwt_token_2026');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isDemoMode,
        login,
        logout,
        setDemoMode,
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

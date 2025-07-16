import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface LoginResponse {
  tokenId: string;
  email: string;
  role: string;
  expiresAt: string;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);
        // Optionally validate token with backend
        // validateToken(token);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not on login page
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        }/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, email: userEmail, role, expiresAt }: LoginResponse =
        await response.json();
      localStorage.setItem('accessToken', token);
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('role', role);
      localStorage.setItem('userEmail', userEmail);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);

    router.push('/login');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

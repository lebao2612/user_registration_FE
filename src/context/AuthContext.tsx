import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api, { setMemoryAccessToken } from '../api/api';
import { Box, Spinner, Center } from '@chakra-ui/react';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  email: string;
  createdAt: string;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const API_URL = 'https://user-registration-api-dl92.onrender.com';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  const fetchProfile = async (): Promise<User | null> => {
    try {
      const { data } = await api.get<User>('/user/profile');
      setUser(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      await logout();
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = data;

    localStorage.setItem('refreshToken', refreshToken);
    setMemoryAccessToken(accessToken);

    await fetchProfile();
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout failed (token might be expired, this is OK):', error);
    } finally {
      setUser(null);
      localStorage.removeItem('refreshToken');
      setMemoryAccessToken(null);
      queryClient.clear();
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log("refresh", refreshToken)
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('App load: Checking refresh token...');
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        localStorage.setItem('refreshToken', data.refreshToken);
        setMemoryAccessToken(data.accessToken);

        await fetchProfile();
      } catch (error) {
        console.error('App load: Refresh token invalid.', error);
        localStorage.removeItem('refreshToken');
        setMemoryAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const value = { user, isAuthenticated, isLoading, login, logout };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

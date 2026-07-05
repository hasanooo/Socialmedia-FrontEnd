import { createContext, useContext, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginPayload, type RegisterPayload } from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<unknown>;
  loginError: string | null;
  registerError: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: 60_000,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => queryClient.setQueryData(['me'], user),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => queryClient.setQueryData(['me'], user),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
    },
  });

  const value: AuthContextValue = {
    user: meQuery.data ?? null,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!meQuery.data,
    login: (payload) => loginMutation.mutateAsync(payload),
    register: (payload) => registerMutation.mutateAsync(payload),
    logout: () => logoutMutation.mutateAsync(),
    loginError: extractError(loginMutation.error),
    registerError: extractError(registerMutation.error),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function extractError(error: unknown): string | null {
  if (!error) return null;
  const anyError = error as { response?: { data?: { error?: string; errors?: string[] } } };
  return anyError.response?.data?.error ?? anyError.response?.data?.errors?.[0] ?? 'Something went wrong.';
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

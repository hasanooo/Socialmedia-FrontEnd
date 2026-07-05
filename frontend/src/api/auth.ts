import { apiClient } from './client';
import type { User } from '../types';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) => apiClient.post<User>('/auth/register', payload).then((r) => r.data),
  login: (payload: LoginPayload) => apiClient.post<User>('/auth/login', payload).then((r) => r.data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),
};

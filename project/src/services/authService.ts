import api from './api';

export interface User {
  id?: number;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  // RN1: Cadastro Usuário
  async register(userData: { email: string; password: string; fullName: string }): Promise<User> {
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Email inválido');
    }

    // Validação de senha
    if (userData.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // RN2: Acesso Usuário
  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const response = await api.post('/auth/login', { email, password });
    
    // Armazenar token para futuras requisições
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
};
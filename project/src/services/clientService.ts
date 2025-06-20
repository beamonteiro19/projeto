import api from './api';

export interface Client {
  clientId?: number;
  companyName: string;
  cnpj: string;
  description: string;
  companyEmail: string;
  companyPhoneNumber: string;
  businessArea: string;
}

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    const response = await api.get('/clients');
    return response.data;
  },

  async getClientById(id: number): Promise<Client> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async createClient(client: Client): Promise<Client> {
    const response = await api.post('/clients', client);
    return response.data;
  },

  async updateClient(id: number, client: Client): Promise<Client> {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },

  async deleteClient(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
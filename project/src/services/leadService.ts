import api from './api';

export interface Company {
  companyId?: number;
  companyName: string;
  cnpj: string;
  description: string;
  companyEmail: string;
  companyPhoneNumber: string;
  businessArea: string;
  razaoSocial?: string;
  representanteName?: string;
  status: 'Arquivada' | 'Cliente'; // RN5
}

export interface Lead {
  leadId?: number;
  company: Company;
  date?: string;
  communicationChannel: string; // meio de contato - RN4
  location: string; // local de contato - RN4
  offer: string;
  isLead: boolean;
  status: 'Ativo' | 'Inativo'; // RN3
  createdAt?: string;
}

export const leadService = {
  // RN3 e RN4: Criação do lead
  async createLead(leadData: {
    company: Omit<Company, 'companyId' | 'status'>;
    communicationChannel: string;
    location: string;
    offer: string;
  }): Promise<Lead> {
    // Validação dos campos obrigatórios - RN4
    if (!leadData.company.companyName || !leadData.communicationChannel || !leadData.location) {
      throw new Error('Nome da empresa/cliente, meio de contato e local de contato são obrigatórios');
    }

    // RN6: Validação dos dados da empresa
    if (!leadData.company.cnpj || !leadData.company.businessArea || 
        !leadData.company.companyEmail || !leadData.company.companyPhoneNumber) {
      throw new Error('CNPJ/CPF, área de atuação, email e telefone da empresa são obrigatórios');
    }

    const lead: Lead = {
      company: {
        ...leadData.company,
        status: 'Arquivada' // RN5: Status inicial da empresa
      },
      communicationChannel: leadData.communicationChannel,
      location: leadData.location,
      offer: leadData.offer,
      isLead: true,
      status: 'Ativo', // RN4: Status padrão do lead
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/leads', lead);
    return response.data;
  },

  async getAllLeads(): Promise<Lead[]> {
    const response = await api.get('/leads');
    return response.data;
  },

  async getLeadById(id: number): Promise<Lead> {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const response = await api.put(`/leads/${id}`, lead);
    return response.data;
  },

  async deleteLead(id: number): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  // RN10: Promoção do lead para cliente
  async promoteLeadToClient(leadId: number): Promise<string> {
    try {
      const response = await api.post(`/leads/${leadId}/promote`);
      
      // Atualizar status da empresa para "Cliente"
      // e marcar lead como inativo
      await this.updateLead(leadId, { 
        isLead: false, 
        status: 'Inativo'
      });

      return response.data;
    } catch (error) {
      throw new Error('Erro ao promover lead para cliente');
    }
  },

  // RN10: Arquivar lead
  async archiveLead(leadId: number): Promise<void> {
    try {
      await this.updateLead(leadId, { 
        isLead: false, 
        status: 'Inativo'
      });
    } catch (error) {
      throw new Error('Erro ao arquivar lead');
    }
  }
};
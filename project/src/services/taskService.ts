import api from './api';

export interface LeadTask {
  leadTaskId?: number;
  contact: string; // nome do contato - RN8
  place: string; // local de encontro - RN8
  contactMethod: string; // meio de encontro - RN8
  environment: string; // ambiente - RN8
  location: string; // localização - RN8
  feedback: string; // proposta - RN8
  taskBegin: string;
  taskEnd: string;
  lead: {
    leadId: number;
  };
  taskStatus: 'Em processo' | 'Cancelado' | 'Concluído'; // RN7
  createdAt?: string;
}

export interface ClientTask {
  clientTaskId?: number;
  theme: string; // tema da reunião - RN13
  startDateTime: string; // data e hora de início - RN13
  endDateTime: string; // data e hora de término - RN13
  projectDescription: string; // descrição do projeto - RN13
  notes: string; // notas - RN13
  client: {
    clientId: number;
  };
  taskStatus: 'Em progresso' | 'Cancelada' | 'Concluída'; // RN12
  createdAt?: string;
}

export const taskService = {
  // RN8: Criação de tarefa lead
  async createLeadTask(taskData: {
    contact: string;
    place: string;
    contactMethod: string;
    environment: string;
    location: string;
    feedback: string;
    taskBegin: string;
    taskEnd: string;
    leadId: number;
  }): Promise<LeadTask> {
    // Validação dos campos obrigatórios - RN8
    if (!taskData.contact || !taskData.place || !taskData.contactMethod || 
        !taskData.environment || !taskData.location || !taskData.feedback) {
      throw new Error('Todos os campos da tarefa são obrigatórios');
    }

    // RN11: Verificar conflito de data com a mesma empresa
    const existingTasks = await this.getAllLeadTasks();
    const taskDate = new Date(taskData.taskBegin).toDateString();
    
    const conflictingTask = existingTasks.find(task => {
      const existingTaskDate = new Date(task.taskBegin).toDateString();
      return existingTaskDate === taskDate && task.lead.leadId === taskData.leadId;
    });

    if (conflictingTask) {
      throw new Error('Já existe uma tarefa agendada para esta empresa na data selecionada');
    }

    const task: LeadTask = {
      contact: taskData.contact,
      place: taskData.place,
      contactMethod: taskData.contactMethod,
      environment: taskData.environment,
      location: taskData.location,
      feedback: taskData.feedback,
      taskBegin: taskData.taskBegin,
      taskEnd: taskData.taskEnd,
      lead: { leadId: taskData.leadId },
      taskStatus: 'Em processo', // RN8: Status padrão
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/lead-tasks', task);
    return response.data;
  },

  // RN13: Criação de tarefa cliente
  async createClientTask(taskData: {
    theme: string;
    startDateTime: string;
    endDateTime: string;
    projectDescription: string;
    notes: string;
    clientId: number;
  }): Promise<ClientTask> {
    // Validação dos campos obrigatórios - RN13
    if (!taskData.theme || !taskData.startDateTime || !taskData.endDateTime || 
        !taskData.projectDescription) {
      throw new Error('Tema, data/hora de início, data/hora de término e descrição do projeto são obrigatórios');
    }

    const task: ClientTask = {
      theme: taskData.theme,
      startDateTime: taskData.startDateTime,
      endDateTime: taskData.endDateTime,
      projectDescription: taskData.projectDescription,
      notes: taskData.notes || '',
      client: { clientId: taskData.clientId },
      taskStatus: 'Em progresso', // Status padrão
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/client-tasks', task);
    return response.data;
  },

  async getAllLeadTasks(): Promise<LeadTask[]> {
    const response = await api.get('/lead-tasks');
    return response.data;
  },

  async getAllClientTasks(): Promise<ClientTask[]> {
    const response = await api.get('/client-tasks');
    return response.data;
  },

  // RN9: Manutenção de tarefa lead
  async updateLeadTask(id: number, task: Partial<LeadTask>): Promise<LeadTask> {
    const response = await api.put(`/lead-tasks/${id}`, task);
    return response.data;
  },

  // RN14: Manutenção de tarefa cliente
  async updateClientTask(id: number, task: Partial<ClientTask>): Promise<ClientTask> {
    // RN14: Verificar se não está tentando desarquivar
    if (task.taskStatus === 'Em progresso' && task.taskStatus === 'Arquivada') {
      throw new Error('Não é possível desarquivar uma tarefa cliente');
    }

    const response = await api.put(`/client-tasks/${id}`, task);
    return response.data;
  },

  async deleteLeadTask(id: number): Promise<void> {
    await api.delete(`/lead-tasks/${id}`);
  },

  async deleteClientTask(id: number): Promise<void> {
    await api.delete(`/client-tasks/${id}`);
  }
};
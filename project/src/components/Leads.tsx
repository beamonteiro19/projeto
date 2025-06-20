import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { leadService, Lead } from '../services/leadService';
import { taskService } from '../services/taskService';

interface LeadWithTasks extends Lead {
  id: number;
  empresa: string;
  representante: string;
  cnpj: string;
  localizacao: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  statusColor: string;
  borderColor: string;
  razaoSocial: string;
  servicosProdutos: string;
  localContato: string;
  areaAtuacao: string;
  meioContato: string;
  telefoneContato: string;
  tarefas: { id: number; descricao: string; data: string }[];
}

interface LeadsProps {
  onNewTask: () => void;
  searchQuery: string;
  onPromoteLead: (
    clientData: {
      id: number;
      empresa: string;
      representante: string;
      cnpj: string;
      localizacao: string;
      email: string;
      telefone: string;
    }
  ) => void;
  onLeadsDataChange: (leads: LeadWithTasks[]) => void;
}

const Leads: React.FC<LeadsProps> = ({
  onNewTask,
  searchQuery,
  onPromoteLead,
  onLeadsDataChange,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [leadsData, setLeadsData] = useState<LeadWithTasks[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const leads = await leadService.getAllLeads();
      const tasks = await taskService.getAllLeadTasks();
      
      const leadsWithTasks: LeadWithTasks[] = leads.map((lead) => ({
        ...lead,
        id: lead.leadId || 0,
        empresa: lead.company.companyName,
        representante: lead.company.companyName, // Ajustar conforme necessário
        cnpj: lead.company.cnpj,
        localizacao: lead.location,
        email: lead.company.companyEmail,
        status: lead.isLead ? 'Ativo' : 'Inativo',
        statusColor: lead.isLead ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800',
        borderColor: lead.isLead ? 'border-l-blue-500' : 'border-l-red-500',
        razaoSocial: lead.company.companyName,
        servicosProdutos: lead.company.description,
        localContato: lead.location,
        areaAtuacao: lead.company.businessArea,
        meioContato: lead.communicationChannel,
        telefoneContato: lead.company.companyPhoneNumber,
        tarefas: tasks
          .filter(task => task.lead.leadId === lead.leadId)
          .map(task => ({
            id: task.leadTaskId || 0,
            descricao: task.feedback,
            data: new Date(task.taskBegin).toLocaleDateString('pt-BR'),
          })),
      }));

      setLeadsData(leadsWithTasks);
      onLeadsDataChange(leadsWithTasks);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleArchive = useCallback(async (id: number) => {
    try {
      const lead = leadsData.find(l => l.id === id);
      if (lead) {
        await leadService.updateLead(id, {
          ...lead,
          isLead: false,
        });
        await loadLeads();
      }
    } catch (error) {
      console.error('Erro ao arquivar lead:', error);
    }
    setExpandedItems((prev) => prev.filter((i) => i !== id));
  }, [leadsData]);

  const handlePromoteClient = useCallback(
    async (id: number) => {
      try {
        await leadService.promoteLeadToClient(id);
        const leadToPromote = leadsData.find((lead) => lead.id === id);
        if (leadToPromote) {
          const newClient = {
            id: leadToPromote.id,
            empresa: leadToPromote.empresa,
            representante: leadToPromote.representante,
            cnpj: leadToPromote.cnpj,
            localizacao: leadToPromote.localizacao,
            email: leadToPromote.email,
            telefone: leadToPromote.telefoneContato,
          };
          onPromoteLead(newClient);
          await loadLeads();
        }
      } catch (error) {
        console.error('Erro ao promover lead:', error);
      }
      setExpandedItems((prev) => prev.filter((i) => i !== id));
    },
    [leadsData, onPromoteLead]
  );

  const filteredLeads = useMemo(() => {
    const currentLeads = leadsData.filter((lead) => lead.status === 'Ativo');
    if (!searchQuery) {
      return currentLeads;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return currentLeads.filter(
      (lead) =>
        lead.empresa.toLowerCase().includes(lowerCaseQuery) ||
        lead.representante.toLowerCase().includes(lowerCaseQuery) ||
        lead.cnpj.toLowerCase().includes(lowerCaseQuery) ||
        lead.localizacao.toLowerCase().includes(lowerCaseQuery) ||
        lead.email.toLowerCase().includes(lowerCaseQuery) ||
        lead.status.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, leadsData]);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito max-w-7xl mx-auto p-8">
        <div className="text-center">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito max-w-7xl mx-auto">
      {/* Header da tabela */}
      <div className="grid grid-cols-[30px_1.5fr_1.2fr_1fr_1fr_1.5fr_1fr_1fr] gap-4 px-4 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-custom-gray">
        <div></div>
        <div className="text-left">Empresa</div>
        <div className="text-left">Representante</div>
        <div className="text-left">CNPJ</div>
        <div className="text-left">Localização</div>
        <div className="text-left">E-mail</div>
        <div className="text-left">Tarefa</div>
        <div className="text-left">Status</div>
      </div>

      {/* Linhas de dados */}
      {filteredLeads.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500">
          Nenhum lead encontrado para "{searchQuery}".
        </div>
      ) : (
        filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className={`border-b border-gray-100 ${
              expandedItems.includes(lead.id)
                ? `border-l-4 ${lead.borderColor}`
                : ''
            }`}
          >
            <div
              className="grid grid-cols-[30px_1.5fr_1.2fr_1fr_1fr_1.5fr_1fr_1fr] gap-4 px-4 py-4 items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleExpanded(lead.id)}
            >
              {/* Ícone de expansão */}
              <div className="flex justify-start">
                <svg
                  className={`w-4 h-4 text-custom-gray transition-transform duration-200 ${
                    expandedItems.includes(lead.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Empresa */}
              <div className="text-sm font-bold text-custom-black truncate">
                {lead.empresa}
              </div>

              {/* Representante */}
              <div className="text-sm font-normal text-custom-gray truncate">
                {lead.representante}
              </div>

              {/* CNPJ */}
              <div className="text-sm font-normal text-custom-gray truncate">
                {lead.cnpj}
              </div>

              {/* Localização */}
              <div className="text-sm font-normal text-custom-gray truncate">
                {lead.localizacao}
              </div>

              {/* Email */}
              <div className="text-sm font-normal text-custom-gray truncate">
                {lead.email}
              </div>

              {/* Tarefa */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNewTask();
                  }}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-1 rounded"
                >
                  <svg
                    className="w-4 h-4 text-custom-gray"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm font-normal text-custom-gray">
                    Nova tarefa
                  </span>
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${lead.statusColor}`}
                >
                  {lead.status}
                </span>
              </div>
            </div>

            {/* Seção expandida */}
            {expandedItems.includes(lead.id) && (
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* MAIS INFORMAÇÕES */}
                  <div>
                    <h4 className="text-sm font-bold text-custom-gray mb-4 text-left">
                      Mais informações:
                    </h4>
                    <div className="space-y-2 text-left">
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Razão social:
                        </span>{' '}
                        {lead.razaoSocial || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Serviços/Produtos:
                        </span>{' '}
                        {lead.servicosProdutos || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Local do contato:
                        </span>{' '}
                        {lead.localContato || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Área de atuação:
                        </span>{' '}
                        {lead.areaAtuacao || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Meio de contato:
                        </span>{' '}
                        {lead.meioContato || 'N/A'}
                      </p>
                      <p className="text-sm font-normal text-custom-gray">
                        <span className="font-semibold text-custom-black">
                          Telefone:
                        </span>{' '}
                        {lead.telefoneContato || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* TAREFAS ASSOCIADAS */}
                  <div>
                    <h4 className="text-sm font-bold text-custom-gray mb-4 text-left">
                      Tarefas associadas:
                    </h4>
                    <div className="space-y-3">
                      {lead.tarefas && lead.tarefas.length > 0 ? (
                        lead.tarefas.map((task) => (
                          <div
                            key={task.id}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-normal text-custom-black truncate max-w-[70%]">
                                {task.descricao}
                              </span>
                              <span className="text-sm font-normal text-custom-gray font-bold">
                                Data: {task.data}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm font-normal text-custom-gray text-left">
                          Nenhuma tarefa associada.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePromoteClient(lead.id);
                    }}
                  >
                    Promover a cliente
                  </button>
                  <button
                    className="text-custom-gray hover:text-custom-black text-sm font-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(lead.id);
                    }}
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Leads;
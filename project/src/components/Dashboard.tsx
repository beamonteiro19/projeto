import React, { useState, useMemo, useEffect } from 'react';
import SideMenu from './SideMenu';
import Leads from './Leads';
import Tasks from './Tasks';
import Clients from './Clients';
import SearchBar from './SearchBar';
import FormLead from './FormLead';
import FormTask from './FormTask';
import Profile from './Profile';
import ScheduleWeb from './ScheduleWeb';
import Notifications from './Notifications';
import NotificationBell from './NotificationBell';

interface Lead {
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

interface Task {
  id: number;
  leadId: number;
  proposta: string;
  status: 'Em progresso' | 'Cancelado' | 'Concluído';
  statusColor: string;
  borderColor: string;
  empresa: string;
  representante: string;
  meioEncontro: string;
  ambiente: string;
  localizacao: string;
  data: string;
  avatar: string;
}

export type ActiveSection =
  | 'leads'
  | 'tasks'
  | 'clients'
  | 'agenda'
  | 'profile';

interface ClientData {
  id: number;
  empresa: string;
  representante: string;
  cnpj: string;
  localizacao: string;
  email: string;
  telefone: string;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('leads');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newClientPromoted, setNewClientPromoted] = useState<ClientData | null>(
    null
  );
  const [showNotifications, setShowNotifications] = useState(false);

  const [currentLeadsData, setCurrentLeadsData] = useState<Lead[]>([]);
  const [currentTasksData, setCurrentTasksData] = useState<Task[]>([]);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleNewLead = () => {
    setShowLeadModal(true);
  };

  const handleNewTask = () => {
    setShowTaskModal(true);
    setEditingTask(null);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handlePromoteLeadToClient = (clientData: ClientData) => {
    setNewClientPromoted(clientData);
    setActiveSection('clients');
    setTimeout(() => setNewClientPromoted(null), 100);
  };

  const notificationCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;

    const leadsNeedingAttention = currentLeadsData.filter(
      (lead) => lead.status === 'Ativo' && lead.tarefas.length === 0
    ).length;
    count += leadsNeedingAttention;

    const tasksDue = currentTasksData.filter((task) => {
      if (task.status === 'Em progresso') {
        const [day, month, year] = task.data.split('/').map(Number);
        const taskDate = new Date(year, month - 1, day);

        return taskDate <= today;
      }
      return false;
    }).length;

    count += tasksDue;

    return count;
  }, [currentLeadsData, currentTasksData]);

  useEffect(() => {
    if (notificationCount > previousNotificationCount) {
      setHasUnreadNotifications(true);
    }
    setPreviousNotificationCount(notificationCount);
  }, [notificationCount, previousNotificationCount]);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setHasUnreadNotifications(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'leads':
        return (
          <Leads
            onNewTask={handleNewTask}
            searchQuery={searchQuery}
            onPromoteLead={handlePromoteLeadToClient}
            onLeadsDataChange={setCurrentLeadsData}
          />
        );
      case 'tasks':
        return (
          <Tasks
            onEditTask={handleEditTask}
            searchQuery={searchQuery}
            onTasksDataChange={setCurrentTasksData}
          />
        );
      case 'clients':
        return (
          <Clients
            searchQuery={searchQuery}
            newClientData={newClientPromoted}
          />
        );
      case 'agenda':
        return <ScheduleWeb />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <Leads
            onNewTask={handleNewTask}
            searchQuery={searchQuery}
            onPromoteLead={handlePromoteLeadToClient}
            onLeadsDataChange={setCurrentLeadsData}
          />
        );
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'leads':
        return 'Leads';
      case 'tasks':
        return 'Tarefas';
      case 'clients':
        return 'Clientes';
      case 'agenda':
        return 'Agenda';
      case 'profile':
        return 'Perfil';
      default:
        return 'Leads';
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case 'leads':
        return 'Pesquisar leads';
      case 'tasks':
        return 'Pesquisar tarefas';
      case 'clients':
        return 'Pesquisar clientes';
      case 'agenda':
        return '';
      case 'profile':
        return '';
      default:
        return 'Pesquisar';
    }
  };

  const showNewButton = activeSection === 'leads';
  const showGreeting =
    activeSection === 'leads' ||
    activeSection === 'tasks' ||
    activeSection === 'clients' ||
    activeSection === 'agenda';
  const showCommonHeader = activeSection !== 'profile';

  return (
    <div className="flex h-screen bg-gray-50 font-nunito">
      <SideMenu
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 p-8">
        <div className="w-full">
          {showGreeting && (
            <h1 className="text-2xl font-bold text-custom-black mb-8 text-left">
              {getGreeting()}, <span className="font-bold">Mohamed Ali</span>!
            </h1>
          )}

          {showCommonHeader && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-custom-black">
                {getSectionTitle()}
              </h2>

              <div className="flex items-center space-x-4">
                {getSearchPlaceholder() && (
                  <div className="w-80">
                    <SearchBar
                      placeholder={getSearchPlaceholder()}
                      onChangeText={setSearchQuery}
                    />
                  </div>
                )}

                <button
                  onClick={handleOpenNotifications}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Notificações"
                >
                  <NotificationBell
                    notificationCount={notificationCount}
                    hasUnread={hasUnreadNotifications}
                  />
                </button>

                {showNewButton && (
                  <button
                    onClick={handleNewLead}
                    className="flex items-center space-x-2 bg-custom-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
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
                    <span className="text-sm font-bold">Novo Lead</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>

      {showLeadModal && (
        <FormLead
          onClose={() => setShowLeadModal(false)}
          onSubmit={(data) => {
            console.log('Lead data:', data);
            setShowLeadModal(false);
          }}
        />
      )}

      {showTaskModal && (
        <FormTask
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={(data) => {
            console.log('Task data:', data);
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          editingTask={editingTask}
        />
      )}

      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default Dashboard;
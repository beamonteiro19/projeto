import React, { useState, useMemo, useEffect } from 'react';

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

interface TasksProps {
  onEditTask: (task: Task) => void;
  searchQuery: string;
  newTaskFromLead?: Task | null;
  onTasksDataChange: (tasks: Task[]) => void;
}

const Tasks: React.FC<TasksProps> = ({
  onEditTask,
  searchQuery,
  newTaskFromLead,
  onTasksDataChange,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [tasksData, setTasksData] = useState<Task[]>([
    {
      id: 1,
      leadId: 101,
      proposta: 'Refinamento do fluxo de usuários',
      status: 'Em progresso',
      statusColor: 'bg-blue-100 text-blue-800',
      borderColor: 'border-l-blue-500',
      empresa: 'HS Corporation 1',
      representante: 'Henry Silva',
      meioEncontro: '',
      ambiente: 'lorem ipsum',
      localizacao: 'São Paulo - SP',
      data: '20/06/2025',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
    },
    {
      id: 2,
      leadId: 102,
      proposta: 'Revisão da proposta comercial',
      status: 'Cancelado',
      statusColor: 'bg-red-100 text-red-800',
      borderColor: 'border-l-red-500',
      empresa: 'HS Corporation 2',
      representante: 'Henry Silva',
      meioEncontro: '',
      ambiente: 'remoto',
      localizacao: 'Rio de Janeiro - RJ',
      data: '21/06/2025',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
    },
    {
      id: 3,
      leadId: 103,
      proposta: 'Apresentação técnica do sistema',
      status: 'Concluído',
      statusColor: 'bg-green-100 text-green-800',
      borderColor: 'border-l-green-500',
      empresa: 'HS Corporation 3',
      representante: 'Henry Silva',
      meioEncontro: '',
      ambiente: 'presencial',
      localizacao: 'Belo Horizonte - MG',
      data: '22/06/2025',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
    },
    {
      id: 4,
      leadId: 101,
      proposta: 'Preparar reunião de feedback',
      status: 'Em progresso',
      statusColor: 'bg-blue-100 text-blue-800',
      borderColor: 'border-l-blue-500',
      empresa: 'Beta Solutions',
      representante: 'Bob Williams',
      meioEncontro: 'Online',
      ambiente: 'remoto',
      localizacao: 'Curitiba - PR',
      data: '25/06/2025',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
    },
  ]);

  useEffect(() => {
    onTasksDataChange(tasksData);
  }, [tasksData, onTasksDataChange]);

  useEffect(() => {
    if (newTaskFromLead) {
      setTasksData((prevTasks) => {
        if (!prevTasks.some((task) => task.id === newTaskFromLead.id)) {
          const newTaskWithStatus = {
            ...newTaskFromLead,
            status: 'Em progresso' as const,
            statusColor: 'bg-blue-100 text-blue-800',
            borderColor: 'border-l-blue-500',
          };
          return [...prevTasks, newTaskWithStatus];
        }
        return prevTasks;
      });
    }
  }, [newTaskFromLead]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateTaskStatus = (
    taskId: number,
    newStatus: 'Em progresso' | 'Cancelado' | 'Concluído'
  ) => {
    setTasksData((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          let newStatusColor = '';
          let newBorderColor = '';
          switch (newStatus) {
            case 'Em progresso':
              newStatusColor = 'bg-blue-100 text-blue-800';
              newBorderColor = 'border-l-blue-500';
              break;
            case 'Cancelado':
              newStatusColor = 'bg-red-100 text-red-800';
              newBorderColor = 'border-l-red-500';
              break;
            case 'Concluído':
              newStatusColor = 'bg-green-100 text-green-800';
              newBorderColor = 'border-l-green-500';
              break;
            default:
              break;
          }
          return {
            ...task,
            status: newStatus,
            statusColor: newStatusColor,
            borderColor: newBorderColor,
          };
        }
        return task;
      })
    );
  };

  const filteredTasks = useMemo(() => {
    const nonCancelledTasks = tasksData.filter(
      (task) => task.status !== 'Cancelado'
    );

    if (!searchQuery) {
      return nonCancelledTasks;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return nonCancelledTasks.filter(
      (task) =>
        task.proposta.toLowerCase().includes(lowerCaseQuery) ||
        task.status.toLowerCase().includes(lowerCaseQuery) ||
        task.empresa.toLowerCase().includes(lowerCaseQuery) ||
        task.representante.toLowerCase().includes(lowerCaseQuery) ||
        task.ambiente.toLowerCase().includes(lowerCaseQuery) ||
        task.localizacao.toLowerCase().includes(lowerCaseQuery) ||
        task.data.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, tasksData]);

  const handleActionClick = (action: string, task: Task) => {
    setShowActionMenu(null);
    if (action === 'edit') {
      onEditTask(task);
    } else if (action === 'cancel') {
      updateTaskStatus(task.id, 'Cancelado');
    } else if (action === 'complete') {
      updateTaskStatus(task.id, 'Concluído');
    }
    console.log(`${action} task:`, task);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito">
      <div className="grid grid-cols-[30px_2fr_1.5fr_1fr] gap-4 px-4 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-custom-gray">
        <div></div>
        <div className="text-left">Proposta</div>
        <div className="text-left">Status</div>
        <div className="text-left">Editar</div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          Nenhuma tarefa encontrada.
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`border-b border-gray-100 ${
              expandedItems.includes(task.id)
                ? `border-l-4 ${task.borderColor}`
                : ''
            }`}
          >
            <div className="grid grid-cols-[30px_2fr_1.5fr_1fr] gap-4 px-4 py-4 items-center hover:bg-gray-50">
              <div className="flex justify-start">
                <button
                  onClick={() => toggleExpanded(task.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    className={`w-4 h-4 text-custom-gray transition-transform duration-200 ${
                      expandedItems.includes(task.id) ? 'rotate-180' : ''
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
                </button>
              </div>

              <div className="text-sm font-bold text-custom-black truncate">
                {task.proposta}
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${task.statusColor}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => onEditTask(task)}
                  className="flex items-center space-x-2 text-custom-gray hover:text-custom-black text-sm font-normal"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Editar</span>
                </button>

                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() =>
                      setShowActionMenu(
                        showActionMenu === task.id ? null : task.id
                      )
                    }
                  >
                    <svg
                      className="w-4 h-4 text-custom-gray"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {showActionMenu === task.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {task.status !== 'Cancelado' && (
                        <button
                          onClick={() => handleActionClick('cancel', task)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-t-lg text-left"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Cancelar</span>
                        </button>
                      )}
                      {task.status !== 'Concluído' && (
                        <button
                          onClick={() => handleActionClick('complete', task)}
                          className={`flex items-center space-x-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 ${
                            task.status !== 'Cancelado' ? '' : 'rounded-t-lg'
                          } text-left`}
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Concluir</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {expandedItems.includes(task.id) && (
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={task.avatar}
                      alt={task.representante}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-base font-bold text-custom-black mb-3">
                      {task.proposta}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
                      <div>
                        <span className="font-bold text-custom-gray">
                          Empresa:
                        </span>{' '}
                        <span className="text-custom-black">
                          {task.empresa}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-custom-gray">
                          Representante:
                        </span>{' '}
                        <span className="text-custom-black">
                          {task.representante}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-custom-gray">
                          Meio de encontro:
                        </span>{' '}
                        <span className="text-custom-black">
                          {task.meioEncontro || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-custom-gray">
                          Ambiente:
                        </span>{' '}
                        <span className="text-custom-black">
                          {task.ambiente}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-custom-gray">
                          Localização:
                        </span>{' '}
                        <span className="text-custom-black">
                          {task.localizacao}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm">
                      <span className="font-bold text-custom-gray">Data: </span>
                      <span className="text-custom-black font-semibold">
                        {task.data}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {showActionMenu !== null && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
};

export default Tasks;

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { taskService } from '../services/taskService';

type Task = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
};

type MarkedDate = {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
};

const ScheduleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CalendarWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  .react-calendar {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-family: 'Nunito', sans-serif;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
    font-size: 1rem;
    color: #111827;
    font-weight: 700;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #f9fafb;
  }

  .react-calendar__month-view__weekdays__weekday {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .react-calendar__month-view__days__day {
    color: #111827;
  }

  .react-calendar__tile {
    padding: 0.5em 0.2em;
    font-size: 0.875rem;
  }

  .react-calendar__tile--now {
    background: #eff6ff;
    color: #3b82f6;
    border-radius: 0.5rem;
  }

  .react-calendar__tile--active {
    background: #3b82f6;
    color: white;
    border-radius: 0.5rem;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #2563eb;
  }

  .has-tasks {
    position: relative;
  }

  .has-tasks::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: #3B82F6;
    border-radius: 50%;
  }

  .react-calendar__tile--active.has-tasks::after {
    background-color: white;
  }
`;

const TasksListWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const TaskCard = styled.div<{ active: boolean }>`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  ${(props) =>
    props.active &&
    `
    border-left: 4px solid #3B82F6;
  `}
`;

const TaskTitle = styled.h4`
  font-weight: 600;
  color: #1f2937;
`;

const TaskDescription = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const TaskTime = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const ScheduleWeb: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllLeadTasks();
      const data: Task[] = response.map((task: any) => ({
        id: task.leadTaskId,
        title: task.contact,
        description: task.feedback,
        date: task.taskBegin,
        time: new Date(task.taskBegin).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setAllTasks(data);
      setTasksForDate(selectedDate, data);
      highlightDatesWithTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlightDatesWithTasks = (data: Task[]) => {
    const newMarks: Record<string, MarkedDate> = {};
    data.forEach((task) => {
      if (!newMarks[task.date]) {
        newMarks[task.date] = {
          marked: true,
          dotColor: '#3B82F6',
        };
      }
    });
    setMarkedDates(newMarks);
  };

  const setTasksForDate = (date: Date, all: Task[]) => {
    const dateString = date.toISOString().split('T')[0];
    setTasks(all.filter((task) => task.date === dateString));
  };

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) {
      setSelectedDate(date[0]);
      setTasksForDate(date[0], allTasks);
    } else {
      setSelectedDate(date);
      setTasksForDate(date, allTasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setTasksForDate(selectedDate, allTasks);
  }, [selectedDate, allTasks]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (markedDates[dateString]?.marked) {
        return 'has-tasks';
      }
    }
    return null;
  };

  if (loading) {
    return (
      <ScheduleContainer>
        <div className="text-center p-8">Carregando agenda...</div>
      </ScheduleContainer>
    );
  }

  return (
    <ScheduleContainer>
      <ContentWrapper>
        <CalendarWrapper>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="pt-BR"
            className="react-calendar"
            tileClassName={tileClassName}
          />
        </CalendarWrapper>

        <TasksListWrapper>
          <p className="text-gray-600 text-sm mb-2">
            {selectedDate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h3 className="text-lg font-semibold text-custom-black mb-4">
            Tarefas para o dia
          </h3>

          {tasks.length === 0 ? (
            <p className="text-gray-500">Nenhuma tarefa para esta data.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((item, index) => (
                <TaskCard key={item.id} active={index === 0}>
                  <TaskTitle>{item.title}</TaskTitle>
                  <TaskDescription>
                    {item.description || 'Nenhuma descrição.'}
                  </TaskDescription>
                  <TaskTime>{index === 0 ? 'Agora' : item.time}</TaskTime>
                </TaskCard>
              ))}
            </div>
          )}
        </TasksListWrapper>
      </ContentWrapper>
    </ScheduleContainer>
  );
};

export default ScheduleWeb;
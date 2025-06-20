import React, { useState, useEffect } from 'react';
import InputWeb from './InputWeb';
import { taskService } from '../services/taskService';

interface FormTaskProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingTask?: any;
  leadId?: number;
}

const FormTask: React.FC<FormTaskProps> = ({
  onClose,
  onSubmit,
  editingTask,
  leadId,
}) => {
  const [formData, setFormData] = useState({
    nomeDoContato: '',
    meioDeEncontro: '',
    localDeEncontro: '',
    ambiente: '',
    localizacao: '',
    escolhaUmaData: '',
    proposta: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        nomeDoContato: editingTask.contact || '',
        meioDeEncontro: editingTask.contactMethod || '',
        localDeEncontro: editingTask.place || '',
        ambiente: editingTask.environment || '',
        localizacao: editingTask.location || '',
        escolhaUmaData: editingTask.taskBegin
          ? new Date(editingTask.taskBegin).toISOString().split('T')[0]
          : '',
        proposta: editingTask.feedback || '',
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingTask) {
        // RN9: Manutenção de tarefa lead
        const updatedTask = {
          contact: formData.nomeDoContato,
          contactMethod: formData.meioDeEncontro,
          place: formData.localDeEncontro,
          environment: formData.ambiente,
          location: formData.localizacao,
          taskBegin: new Date(formData.escolhaUmaData).toISOString(),
          taskEnd: new Date(formData.escolhaUmaData).toISOString(),
          feedback: formData.proposta,
        };

        await taskService.updateLeadTask(editingTask.leadTaskId, updatedTask);
      } else {
        // RN8: Criação de uma Tarefa lead
        if (!leadId) {
          throw new Error('Lead ID é obrigatório para criar uma tarefa');
        }

        const taskData = {
          contact: formData.nomeDoContato,
          place: formData.localDeEncontro,
          contactMethod: formData.meioDeEncontro,
          environment: formData.ambiente,
          location: formData.localizacao,
          feedback: formData.proposta,
          taskBegin: new Date(formData.escolhaUmaData).toISOString(),
          taskEnd: new Date(formData.escolhaUmaData).toISOString(),
          leadId: leadId,
        };

        await taskService.createLeadTask(taskData);
      }

      onSubmit(formData);
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-nunito">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-custom-black">
            {editingTask ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InputWeb
              label="Nome do contato *"
              name="nomeDoContato"
              value={formData.nomeDoContato}
              onChange={handleChange}
              placeholder="nome do contato"
              required
            />
            <InputWeb
              label="Meio de encontro *"
              name="meioDeEncontro"
              value={formData.meioDeEncontro}
              onChange={handleChange}
              placeholder="meio de encontro"
              required
            />
            <InputWeb
              label="Local de encontro *"
              name="localDeEncontro"
              value={formData.localDeEncontro}
              onChange={handleChange}
              placeholder="local de encontro"
              required
            />
            <InputWeb
              label="Ambiente *"
              name="ambiente"
              value={formData.ambiente}
              onChange={handleChange}
              placeholder="ambiente"
              required
            />
            <InputWeb
              label="Localização *"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              placeholder="localização"
              required
            />
            <div>
              <label
                htmlFor="escolhaUmaData"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Escolha uma Data *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="escolhaUmaData"
                  name="escolhaUmaData"
                  value={formData.escolhaUmaData}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent pr-10"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="proposta"
              className="block text-sm font-medium text-custom-black mb-1"
            >
              Proposta *
            </label>
            <textarea
              id="proposta"
              name="proposta"
              value={formData.proposta}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent resize-none"
              placeholder="adicione à proposta desta tarefa"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading 
                ? (editingTask ? 'Salvando...' : 'Criando...') 
                : (editingTask ? 'Salvar alterações' : 'Criar tarefa')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTask;
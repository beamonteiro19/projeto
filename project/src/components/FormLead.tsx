import React, { useState } from 'react';
import InputWeb from './InputWeb';
import { leadService } from '../services/leadService';

interface FormLeadProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FormLead: React.FC<FormLeadProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nomeEmpresaOuCliente: '',
    meioDeContato: '',
    localDeContato: '',
    razaoSocial: '',
    cnpjCpf: '',
    servicosOuProdutos: '',
    email: '',
    telefone: '',
    areaDeAtuacao: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        company: {
          companyName: formData.nomeEmpresaOuCliente,
          cnpj: formData.cnpjCpf,
          description: formData.descricao,
          companyEmail: formData.email,
          companyPhoneNumber: formData.telefone,
          businessArea: formData.areaDeAtuacao,
        },
        communicationChannel: formData.meioDeContato,
        location: formData.localDeContato,
        offer: formData.servicosOuProdutos,
        isLead: true,
      };

      await leadService.createLead(leadData);
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      alert('Erro ao criar lead. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-nunito">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-custom-black">Novo Lead</h2>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InputWeb
              label="Nome da empresa/cliente"
              name="nomeEmpresaOuCliente"
              value={formData.nomeEmpresaOuCliente}
              onChange={handleInputChange}
              placeholder="nome da empresa/cliente"
            />
            <InputWeb
              label="Meio de contato"
              name="meioDeContato"
              value={formData.meioDeContato}
              onChange={handleInputChange}
              placeholder="meio de contato"
            />
            <InputWeb
              label="Local de contato"
              name="localDeContato"
              value={formData.localDeContato}
              onChange={handleInputChange}
              placeholder="local de contato"
            />
            <InputWeb
              label="Razão Social"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleInputChange}
              placeholder="razão social"
            />
            <InputWeb
              label="CNPJ/CPF"
              name="cnpjCpf"
              value={formData.cnpjCpf}
              onChange={handleInputChange}
              placeholder="cnpj/cpf"
            />
            <InputWeb
              label="Serviços/Produtos"
              name="servicosOuProdutos"
              value={formData.servicosOuProdutos}
              onChange={handleInputChange}
              placeholder="serviços/produtos"
            />
            <InputWeb
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
            />
            <InputWeb
              label="Telefone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
            />
            <InputWeb
              label="Área de Atuação"
              name="areaDeAtuacao"
              value={formData.areaDeAtuacao}
              onChange={handleInputChange}
              placeholder="área de atuação"
            />
            <div className="md:col-span-2">
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent resize-none"
                placeholder="adicione a descrição da empresa"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold shadow-lg disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLead;
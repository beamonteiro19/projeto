import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { clientService, Client } from '../services/clientService';

interface ClientsProps {
  searchQuery: string;
  newClientData?: Client | null;
}

const Clients: React.FC<ClientsProps> = ({ searchQuery, newClientData }) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clients = await clientService.getAllClients();
      setClientsData(clients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (newClientData) {
      setClientsData((prevClients) => {
        if (!prevClients.some((client) => client.clientId === newClientData.clientId)) {
          return [...prevClients, newClientData];
        }
        return prevClients;
      });
    }
  }, [newClientData]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) {
      return clientsData;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return clientsData.filter(
      (client) =>
        client.companyName.toLowerCase().includes(lowerCaseQuery) ||
        client.cnpj.toLowerCase().includes(lowerCaseQuery) ||
        client.companyEmail.toLowerCase().includes(lowerCaseQuery) ||
        client.companyPhoneNumber.toLowerCase().includes(lowerCaseQuery) ||
        client.businessArea.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, clientsData]);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const handleCopy = useCallback(
    async (textToCopy: string, clientId: number, fieldName: string) => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        const key = `${clientId}-${fieldName}`;
        setCopiedStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [key]: false }));
        }, 2000);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito overflow-hidden p-8">
        <div className="text-center">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 font-nunito overflow-hidden">
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-custom-gray">
        <div>Empresa</div>
        <div>Representante</div>
        <div>Telefone</div>
        <div>CNPJ</div>
        <div>Área de Atuação</div>
        <div>Email</div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="px-6 py-4 text-center text-gray-500">
          Nenhum cliente encontrado para "{searchQuery}".
        </div>
      ) : (
        filteredClients.map((client) => (
          <div
            key={client.clientId}
            className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <div
              className="text-sm font-normal text-custom-black relative cursor-pointer"
              onClick={() => handleCopy(client.companyName, client.clientId!, 'empresa')}
              title={`Clique para copiar: ${client.companyName}`}
            >
              {truncateText(client.companyName, 25)}
              {copiedStates[`${client.clientId}-empresa`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div
              className="text-sm font-normal text-custom-gray relative cursor-pointer"
              onClick={() =>
                handleCopy(client.companyName, client.clientId!, 'representante')
              }
              title={`Clique para copiar: ${client.companyName}`}
            >
              {truncateText(client.companyName, 20)}
              {copiedStates[`${client.clientId}-representante`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div
              className="text-sm font-normal text-custom-gray relative cursor-pointer"
              onClick={() => handleCopy(client.companyPhoneNumber, client.clientId!, 'telefone')}
              title={`Clique para copiar: ${client.companyPhoneNumber}`}
            >
              {truncateText(client.companyPhoneNumber, 15)}
              {copiedStates[`${client.clientId}-telefone`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div
              className="text-sm font-normal text-custom-gray relative cursor-pointer"
              onClick={() => handleCopy(client.cnpj, client.clientId!, 'cnpj')}
              title={`Clique para copiar: ${client.cnpj}`}
            >
              {truncateText(client.cnpj, 18)}
              {copiedStates[`${client.clientId}-cnpj`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div
              className="text-sm font-normal text-custom-gray relative cursor-pointer"
              onClick={() =>
                handleCopy(client.businessArea, client.clientId!, 'areaAtuacao')
              }
              title={`Clique para copiar: ${client.businessArea}`}
            >
              {truncateText(client.businessArea, 20)}
              {copiedStates[`${client.clientId}-areaAtuacao`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>

            <div
              className="text-sm font-normal text-custom-gray relative cursor-pointer"
              onClick={() => handleCopy(client.companyEmail, client.clientId!, 'email')}
              title={`Clique para copiar: ${client.companyEmail}`}
            >
              {truncateText(client.companyEmail, 18)}
              {copiedStates[`${client.clientId}-email`] && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  Copiado!
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Clients;
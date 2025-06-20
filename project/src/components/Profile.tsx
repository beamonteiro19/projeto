// src/components/Profile.tsx
import React, { useState } from 'react';
import InputWeb from './InputWeb'; // Certifique-se de que o caminho está correto
import InputFile from './InputFile'; // Importe o novo componente InputFile

interface ProfileProps {
  // Se houver dados de usuário para carregar ou salvar, adicione props aqui
}

const Profile: React.FC<ProfileProps> = () => {
  const [avatarUri, setAvatarUri] = useState(
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  );
  const [formData, setFormData] = useState({
    nomeCompleto: 'Mohamed Ali',
    cargo: 'UI/UX Designer',
    empresa: 'Cadabra',
    localizacao: 'NYC, New York, USA',
    dataDeNascimento: '1996-05-19', // Formato YYYY-MM-DD para input type="date"
    email: 'evanyates@gmail.com',
    telefone: '+1 675 346 23-10',
    senha: 'password123', // Usaremos um valor fictício para demonstração
    confirmarSenha: 'password123', // Usaremos um valor fictício para demonstração
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUri(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Aqui você faria o upload do arquivo para o servidor
      console.log('Arquivo selecionado para upload:', file.name);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!'); // Usando alert provisoriamente, substituir por modal customizado
      return;
    }
    console.log('Perfil Salvo:', formData);
    alert('Perfil atualizado com sucesso!'); // Usando alert provisoriamente, substituir por modal customizado
    // Lógica para enviar dados para a API
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 font-nunito max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-custom-black mb-8 text-center">
        Perfil
      </h2>

      <form onSubmit={handleSave}>
        <div className="flex flex-col items-center mb-8">
          <InputFile
            label="" // O label para o InputFile é visualmente integrado ao componente
            onFileChange={handleFileChange}
            currentImageUrl={avatarUri}
          />
        </div>

        <h3 className="text-lg font-bold text-custom-black mb-4">
          Informações pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="Nome completo"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            placeholder="Mohamed Ali"
          />
          <InputWeb
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleInputChange}
            placeholder="UI/UX Designer"
          />
          <InputWeb
            label="Empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            placeholder="Cadabra"
          />
          <InputWeb
            label="Localização"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleInputChange}
            placeholder="NYC, New York, USA"
          />
          <div>
            <label
              htmlFor="dataDeNascimento"
              className="block text-sm font-medium text-custom-black mb-1"
            >
              Data de nascimento
            </label>
            <div className="relative">
              <input
                type="date"
                id="dataDeNascimento"
                name="dataDeNascimento"
                value={formData.dataDeNascimento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent pr-10"
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

        <h3 className="text-lg font-bold text-custom-black mb-4">
          Informações de contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="evanyates@gmail.com"
          />
          <InputWeb
            label="Telefone"
            name="telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="+1 675 346 23-10"
          />
        </div>

        <h3 className="text-lg font-bold text-custom-black mb-4">
          Informações da conta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <InputWeb
            label="Editar senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleInputChange}
            placeholder="********"
          />
          <InputWeb
            label="Confirmar senha"
            name="confirmarSenha"
            type="password"
            value={formData.confirmarSenha}
            onChange={handleInputChange}
            placeholder="********"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-custom-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold shadow-lg"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
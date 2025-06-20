import React, { useRef } from 'react';

interface InputFileProps {
  label: string;
  onFileChange: (file: File | null) => void;
  currentImageUrl?: string;
}

const InputFile: React.FC<InputFileProps> = ({
  label,
  onFileChange,
  currentImageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    onFileChange(file);
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <label className="block text-sm font-medium text-custom-black mb-1">
          {label}
        </label>
      )}
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 hover:border-custom-black transition-colors flex items-center justify-center"
        onClick={handleClick}
      >
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm text-center">
            Selecionar imagem
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.618 3h2.764a2 2 0 011.664.89l.808 1.212a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default InputFile;
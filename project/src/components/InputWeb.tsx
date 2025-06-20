import React from 'react';

interface InputWebProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  name: string;
}

const InputWeb: React.FC<InputWebProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  readOnly = false,
  name,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-custom-black mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-black focus:border-transparent"
        placeholder={placeholder || label.toLowerCase()}
      />
    </div>
  );
};

export default InputWeb;

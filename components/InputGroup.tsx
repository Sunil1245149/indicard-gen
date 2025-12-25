import React from 'react';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'date' | 'select' | 'textarea';
  options?: string[];
  name: string;
  placeholder?: string;
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, value, onChange, type = 'text', options, name, placeholder, className 
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      {type === 'select' ? (
        <select 
          name={name}
          value={value} 
          onChange={onChange}
          className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
        >
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
        />
      ) : (
        <input 
          type={type} 
          name={name}
          value={value} 
          onChange={onChange}
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      )}
    </div>
  );
};

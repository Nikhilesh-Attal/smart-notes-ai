import React from "react";

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-brand-border-light bg-brand-glass text-white placeholder-brand-subtle outline-none focus:border-brand-green transition-colors duration-200"
    />
  );
};

export default Input;

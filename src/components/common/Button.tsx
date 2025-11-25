import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, primary = true }) => (
  <button
    onClick={onClick}
    className={`w-full py-3 rounded-lg shadow-md font-semibold text-lg transition-colors ${
      primary ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`}
  >
    {text}
  </button>
);

// 핵심: default로 내보내기
export default Button;
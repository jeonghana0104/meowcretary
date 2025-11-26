import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  // 친구 코드의 버튼 색상 (비서냥이 파란색)
  const btnColor = '#2E63A6'; 

  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-[0.98]"
      style={{ 
        width: '100%', 
        padding: '14px 0', 
        borderRadius: '8px', 
        backgroundColor: btnColor, 
        color: 'white', 
        fontWeight: 'bold', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.2s', 
        border: 'none', 
        cursor: 'pointer' 
      }}
    >
      {text}
    </button>
  );
};

export default Button;
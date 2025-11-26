import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', placeholder, value, onChange }) => {
  // 친구 코드의 스타일 변수들 (기본 라이트 모드 색상 적용)
  const borderStyle = '#e5e7eb';
  const inputBgStyle = 'white';
  const textStyle = '#374151';

  return (
    <div className="mb-4" style={{ marginBottom: '16px' }}>
      <label 
        className="block font-medium mb-1 text-sm opacity-80" 
        style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontWeight: '500', 
          fontSize: '14px', 
          opacity: 0.8, 
          color: textStyle 
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2.5 focus:outline-none"
        style={{ 
            width: '100%', 
            borderWidth: '1px', 
            borderColor: borderStyle, 
            borderRadius: '8px', 
            padding: '10px 12px', 
            backgroundColor: inputBgStyle, 
            color: textStyle, 
            outline: 'none', 
            boxSizing: 'border-box' 
        }}
      />
    </div>
  );
};

export default InputField;
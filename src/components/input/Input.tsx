import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode; 
}

const Input: React.FC<InputProps> = ({ type, placeholder, className, icon, ...props }) => {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full 
          p-2 
          border 
          border-[#7367f0] 
          rounded-md 
          outline-none 
          transition-all
          duration-300
          focus:translate-y-[-2px]
          focus:shadow-md
          ${className} 
          ${icon ? 'pr-10' : ''}
        `}
        {...props}
      />
      {icon && (
        <div className="
          absolute 
          right-3 
          top-1/2 
          -translate-y-1/2 
          text-[#7367f0]
          transition-transform
          duration-300
          hover:rotate-12
        ">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;
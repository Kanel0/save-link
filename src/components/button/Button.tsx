import { Link, LinkProps } from "react-router-dom";
import * as React from "react";
import '../fonts/font.css'
// ButtonPrimary component
interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ children, className = "", ...props }) => {
  return (
    <button {...props} className={`bg-gray-800 font-[Klapt] hover:bg-[#45444c] text-white font-semibold py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
};


interface LinkButtonProps extends LinkProps {
    children: React.ReactNode;
    className?: string;

  }

export const LinkButton: React.FC<LinkButtonProps> = ({ children, className = "",  ...props }) => {
  return (
    <div>
      <Link  {...props}  className={`bg-gray-800 hover:bg-[#45444c] text-white font-semibold py-2 px-4 rounded ${className}`}>
        {children}
      </Link>
    </div>
  );
};


// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className = "", ...props }) => {
  return (
    <label className="flex items-center cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${checked ? 'bg-[#7367f0] border-[#7367f0]' : 'bg-white border-gray-300 hover:border-[#7367f0]'} ${className}`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="ml-2 text-gray-700">{label}</span>}
    </label>
  );
}

export default Checkbox;
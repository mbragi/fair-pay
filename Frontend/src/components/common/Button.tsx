import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
 children: React.ReactNode;
 variant?: ButtonVariant;
 size?: ButtonSize;
 icon?: LucideIcon;
 iconPosition?: 'left' | 'right';
 fullWidth?: boolean;
 isLoading?: boolean;
 loadingText?: string;
 disabled?: boolean;
 type?: 'button' | 'submit' | 'reset';
 className?: string;
 onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
 children,
 variant = 'primary',
 size = 'md',
 icon: Icon,
 iconPosition = 'left',
 fullWidth = false,
 isLoading = false,
 loadingText,
 disabled = false,
 type = 'button',
 className = '',
 onClick,
}) => {
 // Base styles that apply to all buttons
 const baseStyles = 'font-medium rounded-lg transition-all flex items-center justify-center';

 // Size variations
 const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
 };

 // Variant styles
 const variantStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg',
  secondary: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50',
  success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg',
  outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
  gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg',
 };

 // Disabled styles
 const disabledStyles = 'opacity-50 cursor-not-allowed';

 // Combine all styles
 const buttonStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${fullWidth ? 'w-full' : ''} 
    ${(disabled || isLoading) ? disabledStyles : ''} 
    ${className}
  `;

 // Loading spinner SVG
 const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
 );

 return (
  <button
   type={type}
   className={buttonStyles}
   disabled={disabled || isLoading}
   onClick={onClick}
  >
   {isLoading ? (
    <>
     <LoadingSpinner />
     {loadingText || children}
    </>
   ) : (
    <>
     {Icon && iconPosition === 'left' && <Icon className="mr-2" size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
     {children}
     {Icon && iconPosition === 'right' && <Icon className="ml-2" size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
    </>
   )}
  </button>
 );
};

export default Button;
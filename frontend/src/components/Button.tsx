import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[var(--primary-green)] text-[var(--dark-bg)] hover:bg-[var(--primary-green-hover)]',
    secondary: 'bg-[var(--dark-card)] text-[var(--text-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--dark-card)] hover:text-[var(--text-primary)]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}



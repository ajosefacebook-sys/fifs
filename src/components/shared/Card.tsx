'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-xl p-4
        ${hover ? 'cursor-pointer hover:border-[rgba(212,168,67,0.5)] transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

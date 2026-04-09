import React from 'react';

interface SwissGridProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const SwissGrid: React.FC<SwissGridProps> = ({ children, className = '', as: Component = 'div' }) => {
  return (
    <Component className={`grid grid-cols-12 gap-x-4 md:gap-x-6 ${className}`}>
      {children}
    </Component>
  );
};

export const SwissContainer: React.FC<SwissGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full px-6 md:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
};

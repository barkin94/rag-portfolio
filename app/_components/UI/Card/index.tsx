import React from 'react';

const Card: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ children, className = "" }) => {
  return (
    <div className={`
      bg-background text-foreground border
      border-slate-600/50 rounded-lg p-6 md:p-8 shadow-blue-700/30 relative
      overflow-hidden transition-transform duration-300 ease-in-out
      hover:scale-105 hover:shadow-2xl ${className}
    `} aria-label="Card">
      {children}
    </div>
  );
};

export default Card;

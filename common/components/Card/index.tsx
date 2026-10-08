import React from 'react';

interface CardProps {
  hoverEffects?: boolean;
  hoverScale?: boolean;
  children: React.ReactNode;
  htmlProps?: React.ComponentPropsWithoutRef<'div'>;
}

const Card: React.FC<CardProps> = ({ hoverEffects = true, hoverScale = true, htmlProps = {}, children }) => {
  return (
    <div
    {...htmlProps}
    className={`
      bg-background text-foreground border border-slate-300 dark:border-slate-700/50 
      rounded-lg p-6 md:p-8 shadow-blue-700/30 relative
      overflow-hidden transition-transform duration-300 ease-in-out
      ${hoverEffects && hoverScale ? 'hover:scale-105 hover:shadow-2xl' : ''}
      ${hoverEffects && !hoverScale ? 'hover:shadow-2xl' : ''}
      ${htmlProps.className}
    `} aria-label="Card">
      {children}
    </div>
  );
};

export default Card;

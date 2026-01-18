import { ReactNode } from 'react';

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="fixed top-0 shadow-sm backdrop-blur z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 w-full h-20">
      {children}
    </header>
  );
}


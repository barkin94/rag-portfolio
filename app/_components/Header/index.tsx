
import { cookies } from 'next/headers';

import ThemeToggleButton from './ThemeToggleButton'
import NavLinks from './NavLinks';
import SideBar from './SideBar';

export default async function Header() {
  const isDark = (await cookies()).get('isDark')?.value === '1';

  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 fixed top-0 z-50 shadow-sm backdrop-blur px-4 lg:px-[15%] dismissError w-full h-16">
      <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Barkin Buyuksagin
      </h4>
      
      <NavLinks className='hidden lg:flex' />

      <div className="hidden lg:flex">
        <ThemeToggleButton isDark={isDark} />
      </div>

      <div className="lg:hidden">
        <SideBar isDark={isDark}/>
      </div>
    </header>
  );
}


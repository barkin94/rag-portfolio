import ThemeToggleButton from './ThemeToggleButton'
import NavLinks from './NavLinks';
import { cookies } from 'next/headers';

export default async function Header() {
  const isDark = (await cookies()).get('isDark')?.value === '1';

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Division - Name */}
          <div className="flex items-center justify-center flex-1">
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Barkin Buyuksagin
            </h4>
          </div>

          {/* Middle Division - Navigation Links */}        
          <NavLinks />

          {/* Right Division - Theme Toggle */}
          <div className="flex items-center justify-center flex-1">
            <ThemeToggleButton isDark={isDark} />
          </div>
        </div>
      </div>
    </header>
  );
}


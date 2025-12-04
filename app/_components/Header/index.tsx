import ThemeToggleButton from './ThemeToggleButton'
import NavLinks from './NavLinks';

export default function Header() {

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Division - Name */}
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Barkin Buyuksagin
            </h1>
          </div>

          {/* Middle Division - Navigation Links */}        
          <NavLinks />

          {/* Right Division - Theme Toggle */}
          <div className="flex items-center justify-center flex-1">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
}


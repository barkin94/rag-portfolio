import ThemeToggleButton from './ThemeToggleButton'
import NavLinks from './NavLinks';

export default function Header() {

  return (
    <header className="w-full border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Division - Name */}
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
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


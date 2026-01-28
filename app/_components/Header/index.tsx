import { cookies } from 'next/headers';

import NavLinks from './NavLinks';
import SideBar from './SideBar';
import ThemeToggleButton from './ThemeToggleButton';
import HeaderContainer from '@/common/components/HeaderContainer';
import { Theme, CookieName } from '@/common/enums';

type HeaderProps = {
  theme: Theme;
};

export default async function Header({ theme }: HeaderProps) {
  const cookieStore = await cookies();
  const hasAdminAccess = !!cookieStore.get(CookieName.ADMIN_TOKEN);

  return (
    <HeaderContainer>
      <div className="px-4 lg:px-[15%] w-full flex items-center justify-between">
        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Barkin Buyuksagin
        </h4>

        <NavLinks className='hidden lg:flex' showAdminLink={hasAdminAccess} />

        <div className="hidden lg:flex">
          <ThemeToggleButton theme={theme} />
        </div>

        <div className="lg:hidden">
          <SideBar theme={theme} />
        </div>
      </div>
    </HeaderContainer>
  );
}


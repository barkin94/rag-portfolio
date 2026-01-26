import { Theme } from '@/common/enums/theme';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import ThemeToggleButton from './ThemeToggleButton';
import HeaderContainer from '@/common/components/HeaderContainer';
import { cookies } from 'next/headers';

type HeaderProps = {
  theme: Theme;
};

export default async function Header({ theme }: HeaderProps) {
  const cookieStore = await cookies();
  const hasAdminAccess = cookieStore.get("admin_access")?.value == "1";

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


import HeaderContainer from '@/common/components/HeaderContainer';
import { LeftArrowIcon } from '@/common/components/Icons';
import Link from 'next/link';
import AdminSideBar from '../SideBar';

export default function AdminHeader() {
  return (
    <HeaderContainer>
      <div className="flex items-center p-4 w-full">
        <Link
          href="/"
          title="Go back"
          className="mr-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
          aria-label="Go back"
          >
            <LeftArrowIcon className="w-4 h-4" />
        </Link>

        <div className="grow"></div>

        <AdminSideBar />
      </div>
    </HeaderContainer>
  );
}

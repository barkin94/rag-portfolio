'use client';

import Link from "next/link";

const navItems = [
  ['Home', '/#'],
  ['Tech Stack', '/#tech-stack'],
  ['Journey', '/#journey'],
  ['Contact', '/#contact'],
];

type NavLinksProps = {
  className?: string;
  aftertLinkClick?: () => void;
  showAdminLink: boolean;
};

  const NavLinks: React.FC<NavLinksProps> = ({ className = '', aftertLinkClick, showAdminLink }) => {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        {showAdminLink && <Link
          key="admin"
          href="/admin"
          className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          Admin
        </Link>}

        {
          navItems.map(([label, url], index) => (
            <Link
              key={index}
              href={url}
              onClick={() => aftertLinkClick?.()}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {label}
            </Link>
          ))
        }
      </div>
    )
  }

export default NavLinks;

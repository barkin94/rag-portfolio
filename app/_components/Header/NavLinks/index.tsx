'use client'

import Link from "next/link";

const navItems = [
  ['Home', '/#'],
  // ['About', '/#about'],
  ['Tech Stack', '/#tech-stack'],
  ['Journey', '/#journey']
];

export default () => (
    <div className="flex items-center justify-center flex-1 gap-6">
    {
        navItems.map(([label, url], index) => (
            <Link 
            key={index}
            href={url} 
            onNavigate={(e) => console.log(e)}
            className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {label}
          </Link>
        ))
    }
    </div>
) 
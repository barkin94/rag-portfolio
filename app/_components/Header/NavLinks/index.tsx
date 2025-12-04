import Link from "next/link";

export default () => (
    <div className="flex items-center justify-center flex-1 gap-6">
    {
        [['Home', '/'], ['Journey', '/journey']].map(([label, url], index) => (
            <Link 
            key={index}
            href={url} 
            className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {label}
          </Link>
        ))
    }
    </div>
) 
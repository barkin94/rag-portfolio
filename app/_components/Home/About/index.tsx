import { LinkedInIcon, GitHubIcon } from "@/common/components/Icons";

interface AboutProps {
  summary: {
    location: string;
    summary: string;
    workPreferences: string;
  };
}

export default function About({ summary }: AboutProps) {
  return (
    <div
      aria-label="About"
      role="log"
      aria-live="polite"
    >
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">🚀</span> About Me
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {summary.summary}
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {summary.workPreferences}
        </p>
      </div>
      <div className="flex items-center justify-start gap-4">
        <a
          href="https://linkedin.com/in/barkinsagin"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          aria-label="LinkedIn Profile"
        >
          <LinkedInIcon className="w-5 h-5" />
        </a>
        <a
          href="https://github.com/barkin94"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
          aria-label="GitHub Profile"
        >
          <GitHubIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

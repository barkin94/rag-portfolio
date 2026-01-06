import { LinkedInIcon, GitHubIcon, EmailIcon, ResumeIcon } from "../../Icons";

export default () => (
  <div
    aria-label="About"
    role="log"
    aria-live="polite"
  >
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span className="text-3xl">🚀</span> About Me
      </h3>
      <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
        A backend software engineer with full-stack capabilities and 6+ years of experience building
        scalable systems. Specializing in Javascript ecosystem and cloud technologies, and also bringing more skills to the table.
      </p>
      {/* <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        I love turning complex problems into simple, beautiful solutions.
      </p> */}
    </div>
    <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
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
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
        aria-label="GitHub Profile"
      >
        <GitHubIcon className="w-5 h-5" />
      </a>
      <a
        href="mailto:barkinsagin@gmail.com"
        className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
        aria-label="Email"
      >
        <EmailIcon className="w-5 h-5" />
      </a>
      <a
        href="#"
        download
        className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
        aria-label="Download Resume"
      >
        <ResumeIcon className="w-5 h-5" />
      </a>
    </div>
  </div>
);

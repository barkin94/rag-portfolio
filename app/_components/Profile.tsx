import React from "react";

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const ResumeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const Profile = () => {
  return (
    <section className="relative bg-linear-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 mb-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-purple-200/20 to-indigo-200/20 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div>
        <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-32 h-32 md:w-36 md:h-36 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-5xl md:text-6xl text-white shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900/50">
              👤
            </div>
            <div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full">
                  👋 Hello, I'm
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
                Barkin Buyuksagin
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-2">
                Full Stack Developer
              </p>
              <p className="text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
                Building digital experiences that make a difference
              </p>
            </div>
          </div>

        <div className="mb-8">
          {/* Profile Info Card */}
          {/* <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">John Doe</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-1">📍 Available for opportunities</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <a
                    href="https://linkedin.com/in/barkinsagin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="GitHub Profile"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:barkinsagin@gmail.com"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="Email"
                  >
                    <EmailIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="/resume.pdf"
                    download
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="Download Resume"
                  >
                    <ResumeIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div> */}

          {/* About Me Card */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-indigo-200 dark:border-indigo-900/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="text-3xl">🚀</span> About Me
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
                Passionate full-stack developer with 5+ years of experience building scalable web applications.
                Specializing in React, Next.js, Node.js, and cloud technologies.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I love turning complex problems into simple, beautiful solutions.
              </p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <a
                    href="https://linkedin.com/in/barkinsagin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="GitHub Profile"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:barkinsagin@gmail.com"
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="Email"
                  >
                    <EmailIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="/resume.pdf"
                    download
                    className="p-3 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label="Download Resume"
                  >
                    <ResumeIcon className="w-5 h-5" />
                  </a>
                </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span>⚡</span> Tech Stack
          </h3>
          <div className="flex flex-wrap gap-3">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-transform duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

}


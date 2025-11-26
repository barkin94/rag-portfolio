export default () => {
  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
    "PostgreSQL",
  ];

  return (
    <section
        aria-label="Tech Stack"
        role="log"
        aria-live="polite"
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span>⚡</span> Tech Stack
      </h3>
      <div className="flex flex-wrap gap-3">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-transform duration-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};

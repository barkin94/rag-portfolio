export default () => (
  <section
    aria-label="Header"
    role="log"
    aria-live="polite"
    className="flex items-center justify-center gap-4"
  >
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
  </section>
);

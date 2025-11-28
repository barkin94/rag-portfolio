import Image from "next/image";

export default () => (
  <section
    aria-label="Header"
    role="log"
    aria-live="polite"
    className="flex flex-wrap items-center justify-center gap-6"
  >
    <Image
      src="/1727656649134.jpeg"
      alt="user picture"
      className="rounded-full"
      width={200}
      height={200}
    />
    <div>
      <div className="mb-4">
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full">
          👋 Hello, I'm
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl md:leading-[4rem] font-black bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
        Barkin Buyuksagin
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-2">
        Backend Software Engineer
      </p>
      <p className="text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
        Building digital experiences that make a difference
      </p>
    </div>
  </section>
);

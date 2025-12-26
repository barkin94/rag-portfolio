import Image from "next/image";
import TypingText from "../UI/TypingText";

export default () => (
  <section
    aria-label="Header"
    role="log"
    aria-live="polite"
    className="text-center"
  >
    <div className="mb-4 mt-5">
      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full">
        👋 Welcome
      </span>
    </div>
    <Image
      src="/1727656649134.jpeg"
      alt="user picture"
      className="rounded-full mx-auto"
      width={300}
      height={300}
    />
    <div>
      <h1 className="text-4xl md:text-5xl md:leading-16 font-black bg-clip-text mb-4">
        <TypingText textArray={[
          "Hello!",
          "I'm Barkin.",
          "This is a very long multi-line test."
        ]}/>
      </h1>
      <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-medium mb-2">
        Backend Software Engineer
      </p>
      <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
        Building digital experiences that make a difference
      </p>
    </div>
  </section>
);

import Image from "next/image";
import TypingText from "../UI/TypingText";
import About from "./About";

export default function Home() {
  return (
    <section id="home" role="log" aria-live="polite">
      <div className="grid grid-cols-3 gap-3 mx-20 lg:mx-50 min-h-[calc(100vh-1.5rem)] items-center">
        <div className="col-span-2">
          <h1 className="text-4xl md:text-5xl md:leading-16 font-black bg-clip-text mb-6 lg:mb-8">
            <TypingText
              textArray={[
                "Hello!",
                "I'm Barkin.",
                "👋 Welcome",
                //"This is a very long multi-line test."
              ]}
            />
          </h1>
          <div>
            <About />
          </div>
        </div>

        <div className="col-span-1">
          {/* <div className="mb-4">
      <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-stone-800 px-4 py-1.5 rounded-full">
        👋 Welcome
      </span>
    </div> */}
          <Image
            src="/1727656649134.jpeg"
            alt="user picture"
            className="rounded-full mx-auto"
            width={400}
            height={400}
          />
          {/* <div>
      <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-medium mb-2">
        Backend Software Engineer
      </p>
      <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
        Building digital experiences that make a difference
      </p>
    </div> */}
        </div>
      </div>
    </section>
  );
}

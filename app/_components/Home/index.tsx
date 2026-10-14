import TypingText from "@/common/components/TypingText";
import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import ChatInputWithRedirect from "./ChatInputWithRedirect";

export default function Home() {
  return (
    <WithFadeInAnimation threshold={0.5}>
      <section id="home" role="log" aria-live="polite" className="flex flex-col justify-center mx-auto max-w-4xl min-h-screen px-4">
        <div className="mb-12 md:mb-16">
          <span className="text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1 text-lg font-bold">Welcome! 👋</span>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl md:leading-16 font-black bg-clip-text mb-16">
            <TypingText
              textArray={[
                "Hello!",
                "I'm Barkin.",
                "Let's chat!",
              ]}
            />
          </h1>
          <div className="max-w-2xl">
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
              I'm a backend-focused software engineer with full-stack capabilities and 6+ years of software engineering experience, modernizing software
              development through AI-powered tools, agentic workflows, cloud-native technologies, and LLM applications.
            </p>
          </div>
        </div>

        <p className="mb-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
          <span className="text-2xl mr-2">🚀</span>Want to know more? Ask away!
        </p>
        <ChatInputWithRedirect />
      </section>
    </WithFadeInAnimation>
  );
}

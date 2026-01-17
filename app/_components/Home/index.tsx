import TypingText from "@/common/components/TypingText";
import About from "./About";
import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import ChatInputWithRedirect from "./ChatInputWithRedirect";

export default function Home() {
  return (
    <WithFadeInAnimation threshold={0.5}>
      <section id="home" role="log" aria-live="polite" className="flex flex-col justify-center mx-auto max-w-4xl min-h-screen px-4">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl md:leading-16 font-black bg-clip-text mb-12">
            <TypingText
              textArray={[
                "Hello! 👋",
                "Welcome!",
                "I'm Barkin.",
                //"A software engineer.",
                "Let's chat!",
              ]}
            />
          </h1>
          <About />
        </div>
        <ChatInputWithRedirect />
      </section>
    </WithFadeInAnimation>
  );
}

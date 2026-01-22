import Form from "./Form";
import WithFadeInAnimation from '@/common/components/FadeInOnViewportEntry';
// import { WhatsAppIcon } from "@/common/components/Icons";

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-4xl text-center">
        <WithFadeInAnimation threshold={0.5}>
          <h1 className="text-4xl font-bold text-center mb-4">
            Reach out!
          </h1>

          <div className="mb-12 text-xl">
            Ready to explore collaboration opportunities or discuss your next software ideas?
          </div>
        </WithFadeInAnimation>

        <WithFadeInAnimation threshold={0.5}>
          <Form />
        </WithFadeInAnimation>

        {/* <WithFadeInAnimation threshold={0.5}>
          <div className="flex items-center justify-center mx-8 my-16">
            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />
            <span className="px-4 py-2 md:px-2 md:py-4 text-slate-500 dark:text-slate-400 font-medium text-sm whitespace-nowrap shrink-0">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700" />
          </div>

          <div className="mb-12 text-xl">
            Prefer a quicker chat? Reach out via my social media.
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <a
              href="https://linkedin.com/in/barkinsagin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>

            <form action="insert walink" method="get" target="_blank">
              <button type="submit" className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg">
                <WhatsAppIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </WithFadeInAnimation> */}

      </div>
    </section>
  );
}


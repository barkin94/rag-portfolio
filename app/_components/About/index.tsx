import Image from "next/image";
import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import { LinkedInIcon, GitHubIcon } from "@/common/components/Icons";

interface AboutProps {
  summary: {
    location: string;
    summary: string;
    workPreferences: string;
  };
  imageSrc?: string;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Barkin&backgroundColor=64748b,475569&radius=50";


export default function About({ summary, imageSrc }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4">
        <WithFadeInAnimation threshold={0.5}>
          <h2 className="text-3xl font-bold text-center mb-4">About Me</h2>
          <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">
            Get to know me better
          </p>
        </WithFadeInAnimation>

        <WithFadeInAnimation threshold={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-12 items-start">
            {/* Photo on the left */}
            <div className="mx-auto md:mx-0 md:shrink-0 flex justify-center">
              <Image
                src={imageSrc ?? DEFAULT_AVATAR}
                alt="Barkin Buyuksagin Photo"
                width={320}
                height={320}
                className="w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-slate-200 dark:border-slate-700 shadow-xl"
                priority
                unoptimized
              />
            </div>

            {/* Content on the right */}
            <div className="text-center md:text-left">
              {/* Resume Summary */}
              <div className="mb-8">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-lg">
                  {summary.summary}
                </p>
              </div>

              {/* Basic Info Table-like Area */}
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      Location
                    </dt>
                    <dd className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      {summary.location}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      Work Preferences
                    </dt>
                    <dd className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      {summary.workPreferences}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a
                  href="https://linkedin.com/in/barkinsagin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/barkin94"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </WithFadeInAnimation>
      </div>
    </section>
  );
}
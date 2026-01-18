import HeaderContainer from "@/common/components/HeaderContainer";
import { LeftArrowIcon } from "@/common/components/Icons";
import Link from "next/link";

export default function Loading() {
  return (
    <>
      {/* Render the chat but without reset button */}
      <HeaderContainer>
        <div className="flex items-center p-4 w-full">
          <Link
            href="/"
            title="Go back"
            className="mr-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
            aria-label="Go back"
          >
            <LeftArrowIcon className="w-4 h-4" />
          </Link>

          <div className="grow">
            <h2 className="text-lg font-semibold text-foreground">Chat with me</h2>
            <p className="text-sm text-foreground">I am here to help you with your questions.</p>
          </div>
        </div>
      </HeaderContainer>
      <div id="chat-loading" className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-3 items-center">
            <span
              className="w-4 h-4 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="w-4 h-4 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="w-4 h-4 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
          <p className="text-base text-foreground opacity-70">Loading chat...</p>
        </div>
      </div>
    </>
  );
}

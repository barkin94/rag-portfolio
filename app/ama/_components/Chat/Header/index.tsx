'use client';

import { redirect, RedirectType } from 'next/navigation';
import HeaderContainer from '@/common/components/HeaderContainer';
import { LeftArrowIcon } from '@/common/components/Icons';

type ChatHeaderProps = {
  onResetChat: () => void;
};

export default function ChatHeader({ onResetChat }: ChatHeaderProps) {
  return (
    <HeaderContainer>
      <div className="flex items-center p-4 w-full">
        <button
          onClick={() => redirect('/', RedirectType.replace)}
          title="Go back"
          className="mr-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <LeftArrowIcon className="w-4 h-4" />
        </button>

        <div className="grow">
          <h2 className="text-lg font-semibold text-foreground">Chat with me</h2>
          <p className="text-sm text-foreground">I am here to help you with your questions.</p>
        </div>
        <button
          onClick={onResetChat}
          title="Reset chat"
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none cursor-pointer"
          aria-label="Reset chat"
        >
          ↺
        </button>
      </div>
    </HeaderContainer>
  );
}

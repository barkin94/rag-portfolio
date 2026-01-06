'use client';

import React from "react";
import { ScrollUpIcon } from "../Icons";

const ScrollUpButton: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed p-1 bottom-6 right-6 z-50 bg-foreground text-background transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-lg rounded-full w-14 h-14 flex items-center justify-center focus:outline-none cursor-pointer"
      aria-label="Scroll to top">
      <ScrollUpIcon className="w-8 h-8" />
    </button>
  );
}

export default ScrollUpButton;

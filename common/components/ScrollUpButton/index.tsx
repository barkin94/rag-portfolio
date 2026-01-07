'use client';

import React, { useState, useEffect } from "react";

import { ScrollUpIcon } from "../Icons";

const ScrollUpButton: React.FC = () => {
  const [isIntersecting, setIsIntersecting] = useState(true);
  
  useEffect(() => {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0].isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(homeSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScrollToTop}
      className={
        `fixed p-1 bottom-6 right-6 z-50 bg-foreground text-background
        transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-lg
        rounded-full w-14 h-14 focus:outline-none cursor-pointer fade-in-section
        flex items-center justify-center
        fading-section fading-${isIntersecting ? 'out' : 'in'}`}
      aria-label="Scroll to top">
      <ScrollUpIcon className="w-8 h-8" />
    </button>
  );
}

export default ScrollUpButton;

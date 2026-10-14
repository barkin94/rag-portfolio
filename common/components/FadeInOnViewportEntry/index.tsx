'use client';

import { useEffect, useRef } from 'react';

interface FadeInOnViewportEntryProps {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
}

export default function FadeInOnViewportEntry({ children, threshold, delay = 0 }: FadeInOnViewportEntryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove('fading-out');
              entry.target.classList.add('fading-in');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  return (
    <div ref={sectionRef} className="fading-section fading-out">
      {children}
    </div>
  );
}


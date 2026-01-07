'use client';

import { useEffect, useRef } from 'react';

interface WithFadeInAnimationProps {
  children: React.ReactNode;
}

export default function WithFadeInAnimation({ children }: WithFadeInAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fading-in');
            // Optionally disconnect after first appearance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
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
  }, []);

  return (
    <div ref={sectionRef} className="fading-section">
      {children}
    </div>
  );
}


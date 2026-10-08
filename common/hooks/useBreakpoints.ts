"use client";

import { useState, useEffect, useLayoutEffect } from "react";

export function useBreakpoints(breakpoint: number): boolean {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setIsBelowBreakpoint(mediaQuery.matches);

    handler();
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

   
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? isBelowBreakpoint : false;
}
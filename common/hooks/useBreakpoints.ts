"use client";

import { useState, useEffect } from "react";

export function useBreakpoints(breakpoint: number): boolean {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelowBreakpoint(window.innerWidth < breakpoint);
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);

    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return isBelowBreakpoint;
}
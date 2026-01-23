'use client'

import React, { useRef, useLayoutEffect } from "react";

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  ref?: React.RefObject<HTMLTextAreaElement | null>
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const baseHeight = 56;
  const maxHeight = props.style?.maxHeight as number ?? Number.MAX_SAFE_INTEGER;
  
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = props.ref ?? internalRef;

  const adjustHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      // 1. Reset height to a small value to get the true scrollHeight
      textarea.style.height = '0px';
      
      const newHeight = textarea.scrollHeight;
      
      // 2. Apply the height, strictly enforcing our baseHeight minimum
      // We don't rely on CSS for the min-height here; we force it via JS
      const finalHeight = newHeight < baseHeight ? baseHeight : newHeight;
      
      textarea.style.height = `${Math.min(finalHeight, maxHeight)}px`;
    }
  };

  // useLayoutEffect prevents the visual "flicker" of height changing
  useLayoutEffect(() => {
    adjustHeight();
  }, [props.value]);

  const defaultClassName = `w-full resize-none p-4 text-base leading-6 box-border
                    bg-background text-foreground
                    rounded-3xl border border-slate-300 dark:border-slate-800
                    focus:outline-none focus:ring-slate-500/50 dark:focus:ring-slate-400/50
                    focus:border-slate-400 dark:focus:border-slate-500
                    transition-colors duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-inner
                    overflow-y-hidden`;

  return (
      <textarea
          {...props}
          ref={textAreaRef}
          onInput={(e) => {
            adjustHeight();
            props.onInput?.(e);
          }}
          style={{
              ...props.style,
              height: `${baseHeight}px`,
              lineHeight: '1.5rem', // Explicitly 24px
          }}
          className={`${defaultClassName} ${props.className ?? ''}`}
      />
  );
}

export default TextArea;
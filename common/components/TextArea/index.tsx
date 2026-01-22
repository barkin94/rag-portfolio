'use client'

import React, { useRef } from "react";

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  ref?: React.RefObject<HTMLTextAreaElement | null>
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const height = props.style?.height as number ?? 56;
  const maxHeight = props.style?.maxHeight as number ?? Number.MAX_SAFE_INTEGER;
  const ref = props.ref ?? useRef<HTMLTextAreaElement>(null);


  if (ref?.current) {
    const scrollHeight = height > ref.current.scrollHeight ? height : ref.current.scrollHeight;
    ref.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
  }

  const defaultClassName = `w-full resize-none overflow-y-hidden p-4 text-base 
                    bg-background text-foreground
                    rounded-3xl border border-slate-300 dark:border-slate-800
                    focus:outline-none focus:ring-slate-500/50 dark:focus:ring-slate-400/50
                    focus:border-slate-400 dark:focus:border-slate-500
                    transition duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-inner h-min-[52px]`

  return (
      <textarea
          {...props}
          ref={ref}
          style={{
              height: `${height}px`,
              maxHeight: `${maxHeight}px`,
          }}
          className={`${defaultClassName} ${props.className}`}
          aria-label={props["aria-label"] ?? 'Message Input'}
          aria-describedby={props["aria-describedby"] ?? 'textarea-help'}
      />
  )
}

export default TextArea

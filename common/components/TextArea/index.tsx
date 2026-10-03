'use client'

import React, { useRef, useLayoutEffect, useCallback, useMemo, useImperativeHandle } from "react";

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  ref?: React.Ref<HTMLTextAreaElement>
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const baseHeight = 56;
  const maxHeight = props.style?.maxHeight as number ?? Number.MAX_SAFE_INTEGER;

  const internalRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => internalRef.current!, []);

  const adjustHeight = useCallback(() => {
    const textarea = internalRef.current;
    if (textarea) {
      // 1. Reset height to a small value to get the true scrollHeight
      textarea.style.height = '0px';

      const newHeight = textarea.scrollHeight;

      // 2. Apply the height, strictly enforcing our baseHeight minimum
      // We don't rely on CSS for the min-height here; we force it via JS
      const finalHeight = newHeight < baseHeight ? baseHeight : newHeight;

      textarea.style.height = `${Math.min(finalHeight, maxHeight)}px`;
    }
  }, [maxHeight]);

  // useLayoutEffect prevents the visual "flicker" of height changing
  useLayoutEffect(() => {
    adjustHeight();
  }, [props.value, adjustHeight]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const defaultClassName = useMemo(() => `w-full resize-none p-4 text-base leading-6 box-border
                    bg-background text-foreground
                    rounded-3xl border border-slate-300 dark:border-slate-800
                    focus:outline-none focus:ring-slate-500/50 dark:focus:ring-slate-400/50
                    focus:border-slate-400 dark:focus:border-slate-500
                    transition-colors duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-inner
                    overflow-y-hidden`, []);

  const style = useMemo(() => ({
    ...props.style,
    height: `${baseHeight}px`,
    lineHeight: '1.5rem', // Explicitly 24px
  }), [props.style]);

  const className = useMemo(() => `${defaultClassName} ${props.className ?? ''}`, [defaultClassName, props.className]);

  return (
    <textarea
      {...props}
      ref={internalRef}
      onInput={(e) => {
        adjustHeight();
        props.onInput?.(e);
      }}
      style={style}
      className={className}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
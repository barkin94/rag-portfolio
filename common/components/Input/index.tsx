'use client'

import { FC, ComponentPropsWithoutRef } from 'react'

const Input: FC<ComponentPropsWithoutRef<'input'>> = (props) => {
  const defaultHeight = props.style?.height ?? 56;
  const defaultMaxHeight = props.style?.maxHeight ?? 200;

  const defaultClassName = `w-full resize-none overflow-y-hidden p-4 text-base 
                      bg-background text-foreground
                      rounded-3xl border border-slate-300 dark:border-slate-800
                      focus:outline-none focus:ring-slate-500/50 dark:focus:ring-slate-400/50
                      focus:border-slate-400 dark:focus:border-slate-500
                      transition duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500
                      disabled:opacity-50 disabled:cursor-not-allowed shadow-inner h-min-[52px]`

  return (
    <input
      {...props}
      style={{
        height: `${defaultHeight}px`,
        maxHeight: `${defaultMaxHeight}px`,
      }}
      className={`${defaultClassName} ${props.className}`}
    />
  )
}


export default Input

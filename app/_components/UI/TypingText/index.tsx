'use client';

import React, { useState, useEffect } from 'react';

// Define the three phases of the animation
type AnimationPhase = 'typing' | 'pausing' | 'deleting';

interface TypingTextProps {
  textArray: string[]; // The array of strings to loop through
  typingSpeed?: number; // Speed for adding characters (default: 100)
  deletingSpeed?: number; // Speed for removing characters (default: 50)
  pauseTime?: number; // Time in ms to pause before deleting (default: 1500)
  textClassName?: string;
}

/**
 * A React component that loops through an array of text strings, 
 * typing and then deleting each one with a cursor animation.
 */
const TypingText: React.FC<TypingTextProps> = ({ 
  textArray,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
  //textClassName = 'text-lg text-gray-800'
}) => {
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing');
  const [arrayIndex, setArrayIndex] = useState(0); // Index of the current string in textArray

  const currentText = textArray[arrayIndex];

  useEffect(() => {
    // --- Phase: TYPING ---
    if (phase === 'typing') {
      const isTypingFinished = typedText.length === currentText.length;
      
      if (!isTypingFinished) {
        const timer = setTimeout(() => {
          // Append the next character
          setTypedText(currentText.substring(0, typedText.length + 1));
        }, typingSpeed);

        return () => clearTimeout(timer);
      } else {
        // Typing finished, move to pausing phase
        setPhase('pausing');
      }
    } 
    
    // --- Phase: PAUSING ---
    else if (phase === 'pausing') {
      // Pause for a specified time before deleting
      const timer = setTimeout(() => {
        setPhase('deleting');
      }, pauseTime);

      return () => clearTimeout(timer);
    } 
    
    // --- Phase: DELETING ---
    else if (phase === 'deleting') {
      const isDeletingFinished = typedText.length === 0;

      if (!isDeletingFinished) {
        const timer = setTimeout(() => {
          // Remove the last character
          setTypedText(currentText.substring(0, typedText.length - 1));
        }, deletingSpeed);

        return () => clearTimeout(timer);
      } else {
        // Deleting finished, move to the next string in the array and restart typing
        const nextIndex = (arrayIndex + 1) % textArray.length;
        setArrayIndex(nextIndex);
        setPhase('typing');
      }
    }
  }, [typedText, phase, arrayIndex, textArray, currentText, typingSpeed, deletingSpeed, pauseTime]);

  // The cursor blinks only during the typing and deleting phases
  const cursorClass = phase === 'pausing' ? 'animate-ping' : 'opacity-100';

  return (
    <div>
      {typedText}
      <span className={cursorClass}>|</span>
    </div>
  );
};

export default TypingText;
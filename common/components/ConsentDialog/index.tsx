'use client'

import { createPortal } from "react-dom";

export const CONSENT_STORAGE_KEY = 'user_consent_accepted';

export const hasUserConsented = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_STORAGE_KEY) === 'true';
};

interface ConsentDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const ConsentDialog: React.FC<ConsentDialogProps> = ({
  isOpen,
  onAccept,
  onReject,
}) => {
  const handleAccept = () => {
    // Store consent in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
    }
    onAccept();
  };

  if (!isOpen) return null;

  return (
    // attached the modal to document.body to prevent a weird css bug that occurs when
    // a parent node's css has transform property, modal's fixed position won't 
    // work properly.
    createPortal(
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onReject}
        />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-dialog-title"
        >
          <div
            className="bg-background border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="consent-dialog-title"
              className="text-xl font-semibold text-foreground"
            >
              Privacy Notice
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              To improve this AI, chats may be analyzed anonymously without tracking background data like IP, location, etc.
              <br />
              <br />
              <b>Please avoid sharing sensitive personal details.</b>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onReject}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cancel submission"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 text-white hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors"
                aria-label="Confirm and submit"
              >
                Accept & Submit
              </button>
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
};

export default ConsentDialog;


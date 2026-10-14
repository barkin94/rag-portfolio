"use client";

import { DownloadIcon } from "@/common/components/Icons";

export default function DownloadResumeButton() {
  const handleDownloadResume = async () => {
    try {
      const response = await fetch('/api/resume');
      if (!response.ok) throw new Error('Failed to download resume');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Barkin_Buyuksagin_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  return (
    <button
      onClick={handleDownloadResume}
      className="cursor-pointer p-3 rounded-full border-2 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-400 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
      aria-label="Download Resume"
    >
      <DownloadIcon className="w-6 h-6" />
    </button>
  );
}
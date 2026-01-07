export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 shadow-sm text-center text-slate-500 text-sm pt-6 pb-12">
      {`© ${currentYear} Barkin Buyuksagin. Powered by Next.js, Tailwind CSS, custom RAG and lots of coffee. ☕`}
    </footer>
  );
}
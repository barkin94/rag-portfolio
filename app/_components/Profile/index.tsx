import Header from './Header';
import About from './About';
import TechStack from "./TechStack";

export default () => {
  return (
    <section className="relative bg-linear-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 mb-12 h-fit overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-purple-200/20 to-indigo-200/20 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div>
        <Header />
        <div className='mb-8'></div>
        <About/>
        <div className="mb-8"></div>
        <TechStack />
      </div>
    </section>
  );
};

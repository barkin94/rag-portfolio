import Card from "@/common/components/Card";
import ContactForm from "./ContactForm";
import WithFadeInAnimation from '@/common/components/FadeInOnViewportEntry';

export default function Contact() {
  const linkedinUrl = "https://www.linkedin.com/in/barkin-uludag-06652b102/";

  return (
    <section id="contact" className="px-4 py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-2xl">
        <WithFadeInAnimation threshold={0.5}>
          <h1 className="text-4xl font-bold text-center mb-4">Contact</h1>
          <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">Ready to discuss your next product idea or explore collaboration opportunities? I'd love to hear from you.</p>
        </WithFadeInAnimation>
        
        <Card>
          <ContactForm />
        </Card>


        <div className="mt-6 text-sm">
          <span className="mr-2">Or connect on LinkedIn:</span>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline break-words"
          >
            {linkedinUrl}
          </a>
        </div>
      </div>
    </section>
  );
}


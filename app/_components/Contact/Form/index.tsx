 "use client";
 
import { FormEvent, useState } from "react";

import Input from "@/common/components/Input";
import TextArea from "@/common/components/TextArea";
import { EmailIcon } from "@/common/components/Icons";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setStatus("idle");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, fromEmail, message, subject }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setName("");
      setFromEmail("");
      setMessage("");
      setSubject("");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          id="fromEmail"
          type="email"
          value={fromEmail}
          placeholder="Your E-mail"
          onChange={(e) => setFromEmail(e.target.value)}
          required
        />
      </div>

      <Input
        id="subject"
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <TextArea
        id="message"
        placeholder="Your Message"
        value={message}
        style={{ height: 100 }}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full p-3 rounded-full border-2 border-slate-400 dark:border-slate-600
        text-slate-700 dark:text-slate-300 hover:bg-slate-400
        dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100
        transition-all duration-300 shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-200/50 dark:bg-slate-600/50" 
        >
        {submitting
          ? "Sending..."
          : <div className="flex items-center gap-2 justify-center">
              <EmailIcon className="w-5 h-5" />
              <span>Send</span>
            </div>
          }
      </button>

      {status === "success" && (
        <p className="text-sm text-emerald-400">
          Your message has been sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again later.
        </p>
      )}
    </form>
  );
}


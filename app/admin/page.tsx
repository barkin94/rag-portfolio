"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Message } from "@/common/types";
import MessageComponent from "@/app/ama/_components/Chat/MessageHistory/Message";

type ThreadSummary = {
  id: string;
  messageCount: number;
  preview: string;
  updatedAt: string;
};

type ThreadWithMessages = { id: string; messages: Message[] };

export default function AdminPage() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ThreadWithMessages | null>(null);
  const [loadingThread, setLoadingThread] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/threads", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setThreads)
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, []);

  const openThread = (id: string) => {
    setLoadingThread(id);
    setSelected(null);
    fetch(`/api/admin/threads/${id}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setSelected(data))
      .finally(() => setLoadingThread(null));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 border-b border-foreground/10 px-4 py-3 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">Chat threads</h1>
        <Link
          href="/"
          className="text-sm text-foreground/60 hover:text-foreground underline"
        >
          Leave admin area
        </Link>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="w-72 shrink-0 border-r border-foreground/10 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-foreground/60 text-sm">Loading threads…</p>
          ) : threads.length === 0 ? (
            <p className="p-4 text-foreground/60 text-sm">No threads yet.</p>
          ) : (
            <ul className="p-2">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openThread(t.id)}
                    disabled={loadingThread !== null}
                    className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors ${selected?.id === t.id
                        ? "bg-foreground/10 text-foreground"
                        : "text-foreground/80 hover:bg-foreground/5"
                      }`}
                  >
                    <span className="line-clamp-1 font-medium">
                      {t.preview || "(no messages)"}
                    </span>
                    <span className="block mt-0.5 text-xs text-foreground/50">
                      {t.messageCount} messages · {formatDate(t.updatedAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto p-4">
          {selected === null && !loadingThread && (
            <p className="text-foreground/60 text-sm">
              {threads.length ? "Select a thread" : "Chats from the AMA will appear here."}
            </p>
          )}
          {loadingThread && (
            <p className="text-foreground/60 text-sm">Loading…</p>
          )}

          {selected && (
            <div className="space-y-3">
              {selected.messages.map((msg, i) => (
                <MessageComponent key={i} role={msg.role} content={msg.content} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

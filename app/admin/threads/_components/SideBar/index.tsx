'use client';

import React, { useEffect, useState } from "react";

import ToggleableSideBar from "@/common/components/SideBar";
import Link from "next/link";
import { useParams } from "next/navigation";

type ThreadSummary = {
  id: string;
  messageCount: number;
  preview: string;
  updatedAt: string;
};

const AdminSideBar: React.FC = () => {
  const { threadId } = useParams()
  const [isOpen, setIsOpen] = useState(!threadId);

  const onHamburgerClick = () => {
    setIsOpen(true);
  };

  const closeSideBar = () => setIsOpen(false);

  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/threads", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setThreads)
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <ToggleableSideBar
      isOpen={isOpen}
      onHamburgerClick={onHamburgerClick}
      onCloseClick={closeSideBar}
    >
       {loading ? (
            <p className="text-foreground/60 text-sm">Loading threads…</p>
          ) : threads.length === 0 ? (
            <p className="text-foreground/60 text-sm">No threads yet.</p>
          ) : (
            <ul className="py-2">
              {threads.map((t) => (
                <li className="flex" key={t.id}>
                  <Link
                    href={`/admin/threads/${t.id}`}
                    //disabled={loadingThread !== null}
                    className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors ${threadId === t.id
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
                  </Link>
                </li>
              ))}
            </ul>
          )}

    </ToggleableSideBar>
  );
};

export default AdminSideBar;

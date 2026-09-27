import Link from "next/link";
import mongodb from "@/backend/mongodb";

type ThreadSummary = {
  id: string;
  messageCount: number;
  preview: string;
  updatedAt: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });

export default async function ThreadListPage() {
  const threads = await mongodb.getThreads();

  return threads.length === 0 ? (
    <p className="text-foreground/60 text-sm py-8 text-center">
      No threads yet.
    </p>
  ) : (
    <ul className="divide-y divide-foreground/10">
      {threads.map((t) => (
        <li key={t.id}>
          <Link
            href={`/admin/threads/${t.id}`}
            className="block px-4 py-4 hover:bg-foreground/5 transition-colors"
          >
            <span className="line-clamp-1 font-medium text-foreground">
              {t.preview || "(no messages)"}
            </span>
            <span className="block mt-1 text-sm text-foreground/50">
              {t.messageCount} messages · {formatDate(t.updatedAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import MessageComponent from "@/app/ama/_components/Chat/MessageHistory/Message";
import mongodb from "@/backend/mongodb";

export default async function ThreadPage(props: PageProps<"/admin/threads/[threadId]">) {
  const { threadId } = await props.params;

  const messages = (await mongodb.getMessages(threadId)) ?? [];

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <MessageComponent key={i} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
};

import { Message as MessageType } from "@/common/types";

const Message: React.FC<MessageType> = ({ role, content }) => {
  return (
    <div
      className={`flex w-full ${role === "user" ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`rounded-2xl py-4 ${role === "user"
          ? "bg-slate-600 dark:bg-slate-700 text-white rounded-br-sm max-w-7/10"
          : "text-foreground rounded-bl-sm"
          }`}
        role={role === "user" ? "user-message" : "assistant-message"}
      >
        <div className="flex items-start gap-2">
          {role === "assistant" && (
            <span
              className="text-lg shrink-0 opacity-70"
              aria-hidden="true"
            >
              🤖
            </span>
          )}
          <div id="message-content" className="text-base pl-4 leading-relaxed whitespace-pre-wrap wrap-break-words">
            {content}
          </div>
          {role === "user" && (
            <span
              className="text-lg shrink-0 opacity-80 pr-2"
              aria-hidden="true"
            >
              👤
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "gradient-bg" : "bg-secondary border border-border"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <img src="/logo.svg" alt="Amplik AI" className="w-5 h-5 object-contain" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-user-bubble text-primary-foreground rounded-br-md"
            : "bg-ai-bubble text-ai-bubble-foreground rounded-bl-md"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:my-1 [&>ol]:my-1 [&_strong]:text-foreground">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

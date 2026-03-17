import { useRef, useEffect } from "react";
import { Conversation } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus, ArrowRight } from "lucide-react";

interface ChatAreaProps {
  conversation: Conversation | null;
  isTyping: boolean;
  onSend: (message: string) => void;
  onNewChat: () => void;
}

export function ChatArea({ conversation, isTyping, onSend, onNewChat }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
            <span className="font-display text-2xl font-bold text-primary-foreground">AK</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Welcome to Amplik
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Your AI-powered digital design consultant. Tell us about your project and let's explore how we can help you build something exceptional.
          </p>
          <button
            onClick={onNewChat}
            className="mt-8 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-shadow"
          >
            Start a Conversation
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          {conversation.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
        <span className="font-display text-[10px] font-bold text-primary">SF</span>
      </div>
      <div className="bg-ai-bubble px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" />
      </div>
    </motion.div>
  );
}

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-2 bg-secondary/80 rounded-2xl border border-border p-2 focus-within:border-primary/30 focus-within:glow-shadow transition-all backdrop-blur-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell us about your project…"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground resize-none outline-none px-3 py-2 max-h-[120px]"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="p-2.5 rounded-xl gradient-bg text-primary-foreground disabled:opacity-20 hover:opacity-90 transition-opacity shrink-0"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2 opacity-60">
        Powered by Amplik AI
      </p>
    </div>
  );
}

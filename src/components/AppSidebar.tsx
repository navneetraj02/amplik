import { Plus, MessageSquare, X } from "lucide-react";
import { Conversation } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ conversations, activeId, onSelect, onNew, collapsed, onToggle }: AppSidebarProps) {
  const isMobile = useIsMobile();

  // Mobile: overlay drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {!collapsed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={onToggle}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-sidebar border-r border-sidebar-border"
            >
              <SidebarContent
                conversations={conversations}
                activeId={activeId}
                onSelect={(id) => { onSelect(id); onToggle(); }}
                onNew={() => { onNew(); onToggle(); }}
                onClose={onToggle}
                showClose
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop
  return (
    <aside
      className={`flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-0 overflow-hidden" : "w-72"
      }`}
    >
      {!collapsed && (
        <SidebarContent
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onNew={onNew}
        />
      )}
    </aside>
  );
}

function SidebarContent({
  conversations, activeId, onSelect, onNew, onClose, showClose
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose?: () => void;
  showClose?: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center p-1.5 border border-border">
            <img src="/logo.svg" alt="Amplik" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-semibold text-foreground text-[15px] tracking-tight">Amplik</span>
        </div>
        {showClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New chat */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary transition-colors text-secondary-foreground text-sm font-medium"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <AnimatePresence>
          {conversations.map((conv) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => onSelect(conv.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                conv.id === activeId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
              <span className="truncate">{conv.title}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          amplik.ai ↗
        </a>
      </div>
    </>
  );
}

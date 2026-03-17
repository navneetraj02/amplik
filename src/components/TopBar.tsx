import { PanelLeftClose, PanelLeft, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card/40 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {isMobile ? (
            <Menu className="w-5 h-5" />
          ) : sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Amplik Logo" className="w-5 h-5 object-contain" />
          <h1 className="text-sm font-medium text-foreground">Amplik</h1>
        </div>
      </div>
    </header>
  );
}

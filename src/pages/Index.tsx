import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ChatArea } from "@/components/ChatArea";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { useChat } from "@/hooks/useChat";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessage,
    isTyping,
    showScheduler,
    setShowScheduler,
  } = useChat();

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <AppSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={createConversation}
        collapsed={isMobile ? !sidebarOpen : !sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          sidebarCollapsed={!sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <ChatArea
          conversation={activeConversation}
          isTyping={isTyping}
          onSend={sendMessage}
          onNewChat={createConversation}
        />
      </div>
      <MeetingScheduler open={showScheduler} onClose={() => setShowScheduler(false)} />
    </div>
  );
};

export default Index;

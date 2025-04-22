import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const { messages, isLoading, sendMessage } = useChat();
  const [chats] = useState<Chat[]>([
    { id: "1", title: "AI Discussion", createdAt: new Date().toISOString() },
    { id: "2", title: "Project Planning", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "3", title: "Code Review", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content);
    }
  };

  const handleNewChat = () => {
    const newChat = {
      id: String(Date.now()),
      title: "New Chat",
      createdAt: new Date().toISOString(),
    };
    setActiveChatId(newChat.id);
    setMessages([]);
  };

  const groupChatsByDate = (chats: Chat[]) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      today: chats.filter(chat => {
        const chatDate = new Date(chat.createdAt);
        return format(chatDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      }),
      lastWeek: chats.filter(chat => {
        const chatDate = new Date(chat.createdAt);
        return chatDate > sevenDaysAgo && format(chatDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
      }),
      lastMonth: chats.filter(chat => {
        const chatDate = new Date(chat.createdAt);
        return chatDate > thirtyDaysAgo && chatDate <= sevenDaysAgo;
      }),
      older: chats.filter(chat => {
        const chatDate = new Date(chat.createdAt);
        return chatDate <= thirtyDaysAgo;
      }),
    };
  };

  return (
    <div className="h-screen flex">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <ChatSidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              onNewChat={handleNewChat}
              groupedChats={groupChatsByDate(chats)}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={handleNewChat}
          groupedChats={groupChatsByDate(chats)}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {isMobile && <div className="w-8" />} {/* Spacer for mobile menu button */}
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {!isMobile && "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col">
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default Index;

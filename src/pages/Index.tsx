
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";

const Index = () => {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Array<{ id: string; content: string; role: "user" | "assistant" }>>([]);
  const [chats] = useState([
    { id: "1", title: "General Chat" },
    { id: "2", title: "Technical Support" },
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: String(Date.now()),
      content,
      role: "user" as const,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={() => {
          // Handle new chat creation
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col">
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
        </main>
      </div>
    </div>
  );
};

export default Index;

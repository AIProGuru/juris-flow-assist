
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus } from "lucide-react";

interface ChatItem {
  id: string;
  title: string;
  active?: boolean;
}

interface ChatSidebarProps {
  chats: ChatItem[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  activeChatId?: string;
}

export const ChatSidebar = ({ chats, onSelectChat, onNewChat, activeChatId }: ChatSidebarProps) => {
  return (
    <div className="w-[260px] h-full bg-gray-900 text-white flex flex-col">
      <div className="p-3">
        <Button 
          onClick={onNewChat}
          className="w-full bg-gray-700 hover:bg-gray-600"
        >
          <Plus className="mr-2" />
          New chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 pb-4">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start ${
                chat.id === activeChatId ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="mr-2" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

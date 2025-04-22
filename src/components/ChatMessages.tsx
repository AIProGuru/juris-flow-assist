
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 h-[calc(100vh-200px)] overflow-y-auto">
      <div 
        ref={scrollAreaRef}
        className={`${isMobile ? 'max-w-full' : 'max-w-3xl'} mx-auto space-y-4`}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-50 ml-auto"
                : "bg-gray-50"
            } ${isMobile ? 'mx-2' : ''}`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

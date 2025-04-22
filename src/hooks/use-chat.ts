
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export function useChat(initialThreadId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadId || null);
  const { toast } = useToast();

  const fetchThreadMessages = async (threadId: string) => {
    try {
      setIsLoading(true);
      const response = await supabase.functions.invoke('chat', {
        body: { threadId, action: 'get_messages' }
      });

      if (response.error) throw response.error;
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message to UI
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user'
      };
      setMessages(prev => [...prev, userMessage]);

      // Call OpenAI assistant
      const response = await supabase.functions.invoke('chat', {
        body: { messages: [...messages, userMessage], threadId: currentThreadId }
      });

      if (response.error) throw response.error;

      const { threadId, message } = response.data;
      
      // Update thread ID if this is a new conversation
      if (!currentThreadId) {
        setCurrentThreadId(threadId);
      }

      // Add assistant message to UI
      setMessages(prev => [...prev, message]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    fetchThreadMessages,
    currentThreadId,
    // Add a method to reset the thread ID
    resetThreadId: () => setCurrentThreadId(null)
  };
}

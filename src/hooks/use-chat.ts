
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const { toast } = useToast();

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

      // Save message to database
      const { error: dbError } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: currentThreadId,
          content,
          role: 'user'
        });

      if (dbError) throw dbError;

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

      // Save assistant message to database
      const { error: assistantDbError } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          content: message.content,
          role: 'assistant'
        });

      if (assistantDbError) throw assistantDbError;

      // Add assistant message to UI
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: message.content,
        role: 'assistant'
      }]);

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
    isLoading,
    sendMessage
  };
}

// React hook for managing AI chat functionality

import { useState, useCallback, useEffect } from 'react';
import { claudeService } from '../services/claudeService';
import type { ChatMessage, ChatContext } from '../types/chat';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
  content: 'Salut! Spune problema - te ghidez prin întrebri. 3 runde, apoi rezolvi tu. Hai!',
  timestamp: new Date()
};

export const useChat = (caseId: string | null, caseContext?: ChatContext) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset conversation when case changes
  useEffect(() => {
    resetConversation();
  }, [caseId]);

  const resetConversation = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    claudeService.resetInteractionCount();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send to Claude API
      const response = await claudeService.sendMessage(
        messages,
        content.trim(),
        caseContext
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Ne pare ru, a aprut o eroare. Te rugm s încerci din nou.');

      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, caseContext]);

  const getInteractionCount = useCallback(() => {
    return claudeService.getInteractionCount();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    getInteractionCount
  };
};

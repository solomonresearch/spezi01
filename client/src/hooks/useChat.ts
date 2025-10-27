// React hook for managing AI chat functionality

import { useState, useCallback, useEffect, useRef } from 'react';
import { claudeService } from '../services/claudeService';
import { supabase } from '../lib/supabase';
import type { ChatMessage, ChatContext } from '../types/chat';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
  content: 'Salut! Te ghidez in 3 runde sa rezolvi speta!',
  timestamp: new Date()
};

interface UseChatOptions {
  caseId: string | null;
  userId?: string;
  caseContext?: ChatContext;
}

export const useChat = ({ caseId, userId, caseContext }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Load or create conversation when case changes
  useEffect(() => {
    loadConversation();
  }, [caseId, userId]);

  const loadConversation = useCallback(async () => {
    if (!userId || !caseId) {
      // No user or case, just reset to initial message
      setMessages([INITIAL_MESSAGE]);
      conversationIdRef.current = null;
      claudeService.resetInteractionCount();
      return;
    }

    try {
      // Try to find existing conversation for this user and case
      const { data: existingConv, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('id, conversation_data')
        .eq('user_id', userId)
        .eq('case_id', caseId)
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching conversation:', fetchError);
        setMessages([INITIAL_MESSAGE]);
        return;
      }

      if (existingConv && existingConv.conversation_data) {
        // Load existing conversation
        conversationIdRef.current = existingConv.id;

        // Convert conversation_data to ChatMessage format
        const loadedMessages = (existingConv.conversation_data as any[]).map((msg: any) => ({
          id: msg.timestamp || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));

        setMessages([INITIAL_MESSAGE, ...loadedMessages]);
        console.log('Loaded existing conversation:', existingConv.id);
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: userId,
            case_id: caseId,
            conversation_data: [],
            message_count: 0
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
        } else {
          conversationIdRef.current = newConv?.id || null;
          console.log('Created new conversation:', newConv?.id);
        }

        setMessages([INITIAL_MESSAGE]);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setMessages([INITIAL_MESSAGE]);
    }

    claudeService.resetInteractionCount();
  }, [userId, caseId]);

  const resetConversation = useCallback(() => {
    loadConversation();
  }, [loadConversation]);

  const saveMessageToSupabase = useCallback(async (message: ChatMessage) => {
    if (!conversationIdRef.current) {
      console.warn('No conversation ID, skipping save');
      return;
    }

    try {
      // Get current conversation data
      const { data: conv, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('conversation_data, message_count')
        .eq('id', conversationIdRef.current)
        .single();

      if (fetchError) {
        console.error('Error fetching conversation for update:', fetchError);
        return;
      }

      // Prepare message for JSONB
      const messageData = {
        role: message.role,
        content: message.content,
        timestamp: message.timestamp.toISOString()
      };

      // Append to existing conversation_data
      const updatedData = [...(conv.conversation_data || []), messageData];

      // Update conversation in database
      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update({
          conversation_data: updatedData,
          message_count: updatedData.length,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationIdRef.current);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      } else {
        console.log('Message saved to conversation:', conversationIdRef.current);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
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

    // Save user message to Supabase
    await saveMessageToSupabase(userMessage);

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

      // Save assistant message to Supabase
      await saveMessageToSupabase(assistantMessage);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.');

      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, caseContext, saveMessageToSupabase]);

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

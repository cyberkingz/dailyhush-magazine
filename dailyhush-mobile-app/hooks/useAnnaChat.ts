/**
 * useAnnaChat Hook
 * Manages WebSocket connection to Anna backend for real-time conversation
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { supabase } from '@/utils/supabase';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExerciseTrigger {
  exerciseType: '5-4-3-2-1' | 'breathing';
  preFeelingScore: number;
  action: 'TRIGGER_EXERCISE';
}

export interface ProgressSaved {
  success: boolean;
  sessionId: string;
  reductionPercentage: number;
  message: string;
}

export interface SpiralHistory {
  recentSpirals: number;
  mostCommonTrigger: string | null;
  avgImprovement: number;
}

/**
 * Custom hook for managing Anna chat connection and state
 */
export function useAnnaChat() {
  // State
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAnnaTyping, setIsAnnaTyping] = useState(false);
  const [exerciseTrigger, setExerciseTrigger] = useState<ExerciseTrigger | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const pendingExerciseCompleteRef = useRef<{ preFeelingScore?: number; postFeelingScore: number } | null>(null);

  /**
   * Fetch access token from Supabase
   */
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[useAnnaChat] Error fetching session:', error);
        return;
      }

      if (session?.access_token) {
        setAccessToken(session.access_token);
      }
    };

    fetchSession();
  }, []);

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    if (!accessToken) {
      console.log('[useAnnaChat] No access token, skipping connection');
      return;
    }

    const backendUrl = process.env.EXPO_PUBLIC_ANNA_BACKEND_URL;

    if (!backendUrl) {
      console.error('[useAnnaChat] ANNA_BACKEND_URL not configured');
      setConnectionError('Backend configuration missing');
      return;
    }

    console.log('[useAnnaChat] Connecting to:', backendUrl);

    // Create socket connection
    const socket = io(backendUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
    });

    // Connection successful
    socket.on('connect', () => {
      console.log('[useAnnaChat] Connected to Anna');
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;

      // Request conversation history
      console.log('[useAnnaChat] Requesting conversation history');
      socket.emit('user:request_history');

      // Send any pending exercise completion notification
      if (pendingExerciseCompleteRef.current !== null) {
        console.log('[useAnnaChat] Sending pending exercise completion:', pendingExerciseCompleteRef.current);
        socket.emit('user:exercise_complete', pendingExerciseCompleteRef.current);
        pendingExerciseCompleteRef.current = null;
      }
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
      console.log('[useAnnaChat] Disconnected:', reason);
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        // Server disconnected, try manual reconnect
        socket.connect();
      }
    });

    // Connection error
    socket.on('connect_error', (error) => {
      console.error('[useAnnaChat] Connection error:', error.message);
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setConnectionError('Failed to connect to Anna. Please check your internet connection.');
      }
    });

    // Receive Anna's message (streaming chunks or complete message)
    socket.on('anna:message', (data: { role: string; content: string; timestamp: string; isComplete?: boolean }) => {
      setMessages((prev) => {
        // Check if this is a streaming update to the last message
        const lastMsg = prev[prev.length - 1];

        if (lastMsg && lastMsg.role === 'assistant') {
          // This is a streaming chunk - append to existing assistant message
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              content: lastMsg.content + data.content,
              timestamp: data.timestamp, // Update timestamp to latest
            },
          ];
        } else {
          // First chunk or new message - create new assistant message
          return [...prev, {
            role: 'assistant',
            content: data.content,
            timestamp: data.timestamp,
          }];
        }
      });

      // Only stop typing indicator when message is explicitly marked as complete
      if (data.isComplete) {
        setIsAnnaTyping(false);
      }
    });

    // Anna triggers exercise
    socket.on('anna:trigger_exercise', (data: ExerciseTrigger) => {
      console.log('[useAnnaChat] Exercise triggered:', data);
      setExerciseTrigger(data);
    });

    // Session progress saved
    socket.on('anna:progress_saved', (data: ProgressSaved) => {
      console.log('[useAnnaChat] Progress saved:', data);
      // Could show a toast notification here
    });

    // Spiral history received
    socket.on('anna:spiral_history', (data: SpiralHistory) => {
      console.log('[useAnnaChat] Spiral history:', data);
      // Could show insights UI based on this data
    });

    // Conversation history received
    socket.on('anna:conversation_history', (data: { messages: Message[] }) => {
      console.log('[useAnnaChat] Conversation history received:', data.messages.length, 'messages');
      if (data.messages.length > 0) {
        setMessages(data.messages);
      }
    });

    // Error from server
    socket.on('anna:error', (data: { message: string; code?: string }) => {
      console.error('[useAnnaChat] Server error:', data);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsAnnaTyping(false);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      console.log('[useAnnaChat] Cleaning up socket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  /**
   * Send message to Anna
   */
  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !isConnected) {
        console.error('[useAnnaChat] Cannot send message: not connected');
        return false;
      }

      if (!content.trim()) {
        console.warn('[useAnnaChat] Cannot send empty message');
        return false;
      }

      console.log('[useAnnaChat] Sending message:', content.substring(0, 50) + '...');

      // Add user message to local state immediately
      const userMessage: Message = {
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Show typing indicator
      setIsAnnaTyping(true);

      // Send to server
      socketRef.current.emit('user:message', { message: content.trim() });

      return true;
    },
    [isConnected]
  );

  /**
   * Notify server that exercise was completed
   */
  const notifyExerciseComplete = useCallback(
    (postFeelingScore: number, preFeelingScore?: number) => {
      if (!socketRef.current || !isConnected) {
        console.log('[useAnnaChat] Queueing exercise completion notification. Pre:', preFeelingScore, 'Post:', postFeelingScore);
        pendingExerciseCompleteRef.current = { preFeelingScore, postFeelingScore };
        return true; // Will be sent when connected
      }

      console.log('[useAnnaChat] Notifying exercise complete. Pre-score:', preFeelingScore, 'Post-score:', postFeelingScore);

      socketRef.current.emit('user:exercise_complete', { preFeelingScore, postFeelingScore });

      // Clear exercise trigger
      setExerciseTrigger(null);

      return true;
    },
    [isConnected]
  );

  /**
   * Reset conversation (clear messages)
   */
  const resetConversation = useCallback(() => {
    console.log('[useAnnaChat] Resetting conversation');
    setMessages([]);
    setExerciseTrigger(null);
    setIsAnnaTyping(false);
  }, []);

  /**
   * Manually reconnect (if connection failed)
   */
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('[useAnnaChat] Manual reconnect attempt');
      reconnectAttempts.current = 0;
      setConnectionError(null);
      socketRef.current.connect();
    }
  }, []);

  return {
    // State
    messages,
    isConnected,
    isAnnaTyping,
    exerciseTrigger,
    connectionError,

    // Actions
    sendMessage,
    notifyExerciseComplete,
    resetConversation,
    reconnect,
  };
}

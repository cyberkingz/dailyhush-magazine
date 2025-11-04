/**
 * Authentication middleware for Socket.io
 * Verifies Supabase JWT tokens to authenticate WebSocket connections
 */

import { Socket } from 'socket.io';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SocketData, ErrorResponse } from '../types';

// Lazy initialization of Supabase client
let supabase: SupabaseClient;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabase;
}

/**
 * Socket.io middleware to authenticate connections
 * Extracts JWT from handshake auth and verifies with Supabase
 */
export async function authenticateSocket(
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.error('[Auth] No token provided in handshake');
      return next(new Error('Authentication token required'));
    }

    console.log('[Auth] Verifying token...');

    // Verify token with Supabase
    const { data: { user }, error } = await getSupabaseClient().auth.getUser(token);

    if (error) {
      console.error('[Auth] Token verification failed:', error.message);
      return next(new Error('Invalid authentication token'));
    }

    if (!user) {
      console.error('[Auth] No user found for token');
      return next(new Error('User not found'));
    }

    console.log(`[Auth] User authenticated: ${user.id}`);

    // Attach user ID to socket for later use
    const socketData = socket.data as SocketData;
    socketData.userId = user.id;

    next();
  } catch (error) {
    console.error('[Auth] Authentication error:', error);
    next(new Error('Authentication failed'));
  }
}

/**
 * Middleware to check if socket is authenticated
 * Can be used on individual event handlers
 */
export function requireAuth(socket: Socket): string | null {
  const socketData = socket.data as SocketData;
  const userId = socketData.userId;

  if (!userId) {
    console.error('[Auth] Unauthenticated socket attempted protected action');
    return null;
  }

  return userId;
}

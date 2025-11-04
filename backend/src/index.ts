/**
 * DailyHush Anna Backend
 * Express + Socket.io server with Claude Agent SDK integration
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { AnnaAgent } from './agents/AnnaAgent';
import { authenticateSocket } from './middleware/auth';
import type { SocketData, UserMessage, ExerciseComplete, ErrorResponse } from './types';

// Validate required environment variables
const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
  origin: process.env.MOBILE_APP_URL || '*',
  credentials: true,
}));

app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'anna-backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'DailyHush Anna Backend',
    description: 'AI-powered conversational therapy using Claude Agent SDK',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      websocket: 'ws://[host]:' + (process.env.PORT || 3000),
    },
  });
});

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.MOBILE_APP_URL || '*',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  // Increase timeout for slower connections
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store active Anna agents per user (not per socket, to persist across reconnections)
const activeAgents = new Map<string, AnnaAgent>();

// Apply authentication middleware to all Socket.io connections
io.use(authenticateSocket);

// Handle WebSocket connections
io.on('connection', (socket) => {
  const socketData = socket.data as SocketData;
  const userId = socketData.userId;

  console.log(`✅ User connected: ${userId} (socket: ${socket.id})`);

  // Check if agent already exists for this user (reconnection)
  let annaAgent = activeAgents.get(userId);

  if (annaAgent) {
    console.log(`[Server] Reusing existing agent for user: ${userId}`);

    // Update callbacks to use the new socket
    annaAgent.updateCallbacks(
      (message: string, isComplete?: boolean) => {
        socket.emit('anna:message', {
          role: 'assistant',
          content: message,
          timestamp: new Date().toISOString(),
          isComplete: isComplete,
        });
      },
      (toolName: string, result: unknown) => {
        console.log(`[Server] Tool called: ${toolName}`, result);

        if (toolName === 'triggerExercise') {
          socket.emit('anna:trigger_exercise', result);
        }

        if (toolName === 'saveProgress') {
          socket.emit('anna:progress_saved', result);
        }

        if (toolName === 'getSpiralHistory') {
          socket.emit('anna:spiral_history', result);
        }
      }
    );
  } else {
    console.log(`[Server] Creating new agent for user: ${userId}`);
    // Create new AnnaAgent instance for this user
    annaAgent = new AnnaAgent({
      userId,
      onMessage: (message: string, isComplete?: boolean) => {
        // Stream Anna's responses to mobile app
        socket.emit('anna:message', {
          role: 'assistant',
          content: message,
          timestamp: new Date().toISOString(),
          isComplete: isComplete,
        });
      },
      onToolCall: (toolName: string, result: unknown) => {
        console.log(`[Server] Tool called: ${toolName}`, result);

        // Notify mobile app when exercise is triggered
        if (toolName === 'triggerExercise') {
          socket.emit('anna:trigger_exercise', result);
        }

        // Notify on successful progress save
        if (toolName === 'saveProgress') {
          socket.emit('anna:progress_saved', result);
        }

        // Send spiral history if requested
        if (toolName === 'getSpiralHistory') {
          socket.emit('anna:spiral_history', result);
        }
      },
    });

    // Store agent reference by userId
    activeAgents.set(userId, annaAgent);
  }

  // Send conversation history on request
  socket.on('user:request_history', () => {
    try {
      const history = annaAgent.getHistory();
      console.log(`[Server] Sending conversation history to ${userId}: ${history.length} messages`);
      socket.emit('anna:conversation_history', { messages: history });
    } catch (error) {
      console.error('[Server] Error sending conversation history:', error);
    }
  });

  // Handle user messages
  socket.on('user:message', async (data: UserMessage) => {
    try {
      console.log(`[Server] User message from ${userId}: "${data.message.substring(0, 50)}..."`);

      await annaAgent.handleMessage(data.message);
    } catch (error) {
      console.error('[Server] Error handling user message:', error);

      const errorResponse: ErrorResponse = {
        message: "I'm having trouble connecting. Can you try again?",
        code: 'MESSAGE_PROCESSING_ERROR',
      };

      socket.emit('anna:error', errorResponse);
    }
  });

  // Handle exercise completion
  socket.on('user:exercise_complete', async (data: ExerciseComplete) => {
    try {
      console.log(`[Server] Exercise complete for ${userId}, pre-score: ${data.preFeelingScore}, post-score: ${data.postFeelingScore}`);

      await annaAgent.handleExerciseComplete(data.postFeelingScore, data.preFeelingScore);
    } catch (error) {
      console.error('[Server] Error handling exercise completion:', error);

      const errorResponse: ErrorResponse = {
        message: "I couldn't save your progress, but that was still a great session!",
        code: 'EXERCISE_COMPLETION_ERROR',
      };

      socket.emit('anna:error', errorResponse);
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${userId} (reason: ${reason})`);

    // Get session stats
    const stats = annaAgent.getStats();
    console.log(`[Server] Session stats for ${userId}:`, stats);

    // Keep agent alive for reconnection (will be cleaned up after inactivity timeout)
    console.log(`[Server] Keeping agent alive for potential reconnection. Active agents: ${activeAgents.size}`);

    // Schedule cleanup after 10 minutes of inactivity
    setTimeout(() => {
      // Only cleanup if user hasn't reconnected
      const currentAgent = activeAgents.get(userId);
      if (currentAgent === annaAgent) {
        console.log(`[Server] Cleaning up inactive agent for ${userId}`);
        annaAgent.cleanup();
        activeAgents.delete(userId);
      }
    }, 10 * 60 * 1000); // 10 minutes
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`[Server] Socket error for ${userId}:`, error);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 DailyHush Anna Backend Started');
  console.log('================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🧠 Model: Claude Sonnet 4.5`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');

  // Clean up all active agents
  for (const [socketId, agent] of activeAgents.entries()) {
    console.log(`[Shutdown] Cleaning up agent for socket: ${socketId}`);
    agent.cleanup();
  }

  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');

  for (const [socketId, agent] of activeAgents.entries()) {
    console.log(`[Shutdown] Cleaning up agent for socket: ${socketId}`);
    agent.cleanup();
  }

  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

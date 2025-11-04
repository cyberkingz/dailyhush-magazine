# DailyHush Anna Backend

AI-powered conversational therapy backend using Claude Agent SDK for spiral interruption.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **WebSocket:** Socket.io
- **AI:** Claude Agent SDK (Sonnet 4.5)
- **Database:** Supabase PostgreSQL
- **Deployment:** Render.com

## Project Structure

```
backend/
├── src/
│   ├── agents/
│   │   └── AnnaAgent.ts          # Core AI agent logic
│   ├── tools/
│   │   └── agentTools.ts         # Agent tools (triggerExercise, saveProgress, etc.)
│   ├── middleware/
│   │   └── auth.ts               # Socket.io authentication
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── index.ts                  # Express + Socket.io server
├── prompts/
│   └── anna-personality.md       # Anna's system prompt
├── package.json
├── tsconfig.json
└── .env.example
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
ANTHROPIC_API_KEY=your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
NODE_ENV=development
```

### 3. Apply Database Migration

```bash
# In Supabase SQL Editor, run:
dailyhush-mobile-app/supabase/migrations/20250103000000_add_ai_sessions.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### 5. Test Health Check

```bash
curl http://localhost:3000/health
```

## API Endpoints

### HTTP

- `GET /` - API information
- `GET /health` - Health check (for Render)

### WebSocket Events

**Client → Server:**
- `user:message` - Send message to Anna
  ```typescript
  socket.emit('user:message', { message: "I'm spiraling" });
  ```

- `user:exercise_complete` - Notify exercise completion
  ```typescript
  socket.emit('user:exercise_complete', { postFeelingScore: 5 });
  ```

**Server → Client:**
- `anna:message` - Receive Anna's response
  ```typescript
  socket.on('anna:message', (data) => {
    // { role: 'assistant', content: string, timestamp: string }
  });
  ```

- `anna:trigger_exercise` - Exercise triggered by Anna
  ```typescript
  socket.on('anna:trigger_exercise', (data) => {
    // { exerciseType: '5-4-3-2-1', preFeelingScore: 8 }
  });
  ```

- `anna:progress_saved` - Session saved successfully
- `anna:spiral_history` - User's pattern data
- `anna:error` - Error occurred

## Authentication

WebSocket connections require Supabase JWT token:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: session.access_token, // From Supabase auth
  },
});
```

## Agent Tools

Anna can autonomously call these tools during conversations:

### 1. triggerExercise
Starts the spiral interruption protocol in mobile app.
```typescript
{
  exerciseType: '5-4-3-2-1',
  preFeelingScore: 8
}
```

### 2. saveProgress
Saves session data to database after exercise.
```typescript
{
  userId: string,
  preFeelingScore: number,
  postFeelingScore: number,
  trigger: string,
  conversationSummary: string,
  exerciseCompleted: boolean
}
```

### 3. getSpiralHistory
Fetches user's recent patterns for personalization.
```typescript
{
  userId: string,
  limit: 5
}
```

## Deployment to Render

### 1. Push to GitHub

```bash
git add backend/
git commit -m "Add Anna backend"
git push origin main
```

### 2. Create Web Service on Render

- Service: Web Service
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`
- Environment: Node

### 3. Add Environment Variables

```
ANTHROPIC_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NODE_ENV=production
```

### 4. Deploy

Render auto-deploys on git push.

## Cost Estimation

**Claude Sonnet 4.5 Pricing:**
- $3 per 1M input tokens
- $15 per 1M output tokens

**Per Session (avg 2,500 tokens):**
- Cost: ~$0.025 (2.5¢)

**Per User/Month (50 sessions):**
- Cost: ~$1.25

## Monitoring

### Logs

```bash
# Render Dashboard → Logs
# Or use Render CLI:
render logs -s your-service-name --tail
```

### Metrics to Track

- Active connections: `activeAgents.size`
- Session duration: `annaAgent.getStats()`
- Token usage: Check `ai_sessions.total_tokens`
- Costs: Check `ai_sessions.cost_cents`

## Development

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### "Authentication token required"
- Ensure mobile app sends JWT in `socket.handshake.auth.token`
- Verify token is valid with Supabase

### "Failed to load system prompt"
- Check `backend/prompts/anna-personality.md` exists
- Verify file permissions

### Agent not responding
- Check Anthropic API key is valid
- Verify ANTHROPIC_API_KEY env var is set
- Check logs for API errors

### Database errors
- Ensure `ai_sessions` table exists (run migration)
- Verify RLS policies allow inserts
- Check SUPABASE_SERVICE_ROLE_KEY is correct

## License

MIT

import { GameRoomDO } from './durable/GameRoomDO';
import { Env, generateNewAIWordPair } from './db/words';
import { INITIAL_WORDS } from '@mister-white/shared';

export { GameRoomDO };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Upgrade',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    // Health Check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', serverTime: Date.now() }), {
        headers: corsHeaders,
      });
    }

    // Words Listing API
    if (url.pathname === '/api/words') {
      if (env.DB) {
        try {
          const result = await env.DB.prepare('SELECT * FROM word_pairs WHERE active = 1 ORDER BY category ASC').all();
          return new Response(JSON.stringify(result.results), { headers: corsHeaders });
        } catch (e) {}
      }
      return new Response(JSON.stringify(INITIAL_WORDS), { headers: corsHeaders });
    }

    // Dynamic AI Word Generator API
    if (url.pathname === '/api/generate-word') {
      const category = url.searchParams.get('category') || 'general';
      const aiWord = await generateNewAIWordPair(env, category);
      if (aiWord) {
        return new Response(JSON.stringify(aiWord), { headers: corsHeaders });
      }
      return new Response(JSON.stringify({ error: 'AI generation not available, using D1 database' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Room Routes via Durable Objects
    const roomMatch = url.pathname.match(/^\/api\/room\/([A-Z0-9_-]+)(\/.*)?$/i);
    if (roomMatch) {
      const roomCode = roomMatch[1].toUpperCase();
      const id = env.ROOM_DO.idFromName(roomCode);
      const roomObj = env.ROOM_DO.get(id);

      // Append roomCode to query
      url.searchParams.set('roomCode', roomCode);
      const newReq = new Request(url.toString(), request);
      return roomObj.fetch(newReq);
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: corsHeaders,
    });
  },
};

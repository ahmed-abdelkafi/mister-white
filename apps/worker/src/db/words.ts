import { INITIAL_WORDS } from '@mister-white/shared';
import { WordPair } from '@mister-white/shared';

export interface Env {
  DB?: D1Database;
  ROOM_DO: DurableObjectNamespace;
  AI?: any;
}

export async function getRandomWordPair(env: Env, categories: string[], playedIds: Set<string>): Promise<WordPair> {
  if (env.DB) {
    try {
      const placeholders = categories.map(() => '?').join(',');
      const query = categories.length > 0
        ? `SELECT * FROM word_pairs WHERE active = 1 AND category IN (${placeholders})`
        : `SELECT * FROM word_pairs WHERE active = 1`;
      
      const result = await env.DB.prepare(query).bind(...categories).all<any>();
      if (result.results && result.results.length > 0) {
        const unplayed = result.results.filter((row: any) => !playedIds.has(row.id));
        const pool = unplayed.length > 0 ? unplayed : result.results;
        const selected = pool[Math.floor(Math.random() * pool.length)];

        return {
          id: selected.id,
          category: selected.category,
          difficulty: selected.difficulty,
          en: { civilian: selected.word_en_civilian, undercover: selected.word_en_undercover },
          fr: { civilian: selected.word_fr_civilian, undercover: selected.word_fr_undercover },
          ar: { civilian: selected.word_ar_civilian, undercover: selected.word_ar_undercover }
        };
      }
    } catch (err) {
      console.warn('Falling back to local word bank due to D1 query failure:', err);
    }
  }

  // Fallback to extensive INITIAL_WORDS
  const filtered = INITIAL_WORDS.filter((w) => categories.length === 0 || categories.includes(w.category));
  const unplayed = filtered.filter((w) => !playedIds.has(w.id));
  const pool = unplayed.length > 0 ? unplayed : filtered.length > 0 ? filtered : INITIAL_WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function generateNewAIWordPair(env: Env, category: string = 'general'): Promise<WordPair | null> {
  if (!env.AI) return null;

  try {
    const prompt = `You are a game designer for the social deduction game 'Mister White' / 'Undercover'.
Generate 1 creative, distinct, and fun word pair for the category "${category}".
Provide closely related civilian and undercover words in English, French, and Arabic.
Example:
{
  "category": "food",
  "difficulty": "medium",
  "en": { "civilian": "Pancake", "undercover": "Waffle" },
  "fr": { "civilian": "Crêpe", "undercover": "Gaufre" },
  "ar": { "civilian": "بان كيك", "undercover": "وافل" }
}
Return ONLY pure JSON.`;

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a precise multilingual word pair generator. Return ONLY JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
    });

    const jsonText = response?.response?.replace(/```json/g, '')?.replace(/```/g, '')?.trim();
    const parsed = JSON.parse(jsonText);

    if (parsed.en?.civilian && parsed.fr?.civilian && parsed.ar?.civilian) {
      const id = 'ai_' + Math.random().toString(36).substring(2, 10);
      const newPair: WordPair = {
        id,
        category: parsed.category || category,
        difficulty: parsed.difficulty || 'medium',
        en: parsed.en,
        fr: parsed.fr,
        ar: parsed.ar,
      };

      // Cache into D1 if available
      if (env.DB) {
        await env.DB.prepare(
          `INSERT OR IGNORE INTO word_pairs (id, category, difficulty, word_en_civilian, word_en_undercover, word_fr_civilian, word_fr_undercover, word_ar_civilian, word_ar_undercover) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          newPair.id,
          newPair.category,
          newPair.difficulty,
          newPair.en.civilian,
          newPair.en.undercover,
          newPair.fr.civilian,
          newPair.fr.undercover,
          newPair.ar.civilian,
          newPair.ar.undercover
        ).run();
      }

      return newPair;
    }
  } catch (err) {
    console.warn('AI word generation error:', err);
  }

  return null;
}

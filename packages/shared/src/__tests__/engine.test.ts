import { describe, expect, it } from 'vitest';
import { assignRoles, checkFuzzyWordMatch, evaluateWinner, shuffle, tallyVotes } from '../engine';
import type { GameSettings, Role } from '../types';
import { DEFAULT_GAME_SETTINGS } from '../constants';

const ids = (n: number) => Array.from({ length: n }, (_, i) => `p${i + 1}`);
const settings = (over: Partial<GameSettings>): GameSettings => ({ ...DEFAULT_GAME_SETTINGS, ...over });
const count = (roles: Record<string, Role>, role: Role) => Object.values(roles).filter((r) => r === role).length;

describe('shuffle', () => {
  it('returns a permutation and leaves the input untouched', () => {
    const input = ids(8);
    const out = shuffle(input);
    expect(out).toHaveLength(8);
    expect([...out].sort()).toEqual([...input].sort());
    expect(input).toEqual(ids(8));
  });

  it('is uniform: every player lands first about equally often', () => {
    const firsts: Record<string, number> = {};
    const runs = 30_000;
    for (let i = 0; i < runs; i++) {
      const first = shuffle(ids(5))[0];
      firsts[first] = (firsts[first] ?? 0) + 1;
    }
    for (const n of Object.values(firsts)) expect(Math.abs(n / runs - 0.2)).toBeLessThan(0.02);
  });
});

describe('assignRoles', () => {
  it('gives every player exactly one role and a turn', () => {
    const players = ids(6);
    const { roles, turnOrder } = assignRoles(players, settings({ mrWhiteCount: 1, undercoverCount: 1 }));
    expect(Object.keys(roles).sort()).toEqual([...players].sort());
    expect([...turnOrder].sort()).toEqual([...players].sort());
  });

  it('respects the requested impostor counts when there are enough players', () => {
    const { roles } = assignRoles(ids(8), settings({ mrWhiteCount: 1, undercoverCount: 2 }));
    expect(count(roles, 'mr_white')).toBe(1);
    expect(count(roles, 'undercover')).toBe(2);
    expect(count(roles, 'civilian')).toBe(5);
  });

  it('caps Mister White at a third of the table', () => {
    const { roles } = assignRoles(ids(4), settings({ mrWhiteCount: 3, undercoverCount: 0 }));
    expect(count(roles, 'mr_white')).toBe(1);
  });

  it('always starts with at least one impostor from three players', () => {
    const { roles } = assignRoles(ids(3), settings({ mrWhiteCount: 0, undercoverCount: 0 }));
    expect(count(roles, 'undercover')).toBe(1);
  });

  it('supports games with only Undercover agents', () => {
    const { roles } = assignRoles(ids(6), settings({ mrWhiteCount: 0, undercoverCount: 2 }));
    expect(count(roles, 'mr_white')).toBe(0);
    expect(count(roles, 'undercover')).toBe(2);
  });
});

describe('checkFuzzyWordMatch', () => {
  it('accepts exact matches regardless of case, accents and punctuation', () => {
    expect(checkFuzzyWordMatch('PIZZA', 'pizza')).toBe(true);
    expect(checkFuzzyWordMatch('creme brulee', 'Crème brûlée')).toBe(true);
  });

  it('tolerates one typo on longer words', () => {
    expect(checkFuzzyWordMatch('banan', 'banana')).toBe(true);
    expect(checkFuzzyWordMatch('tomatp', 'tomato')).toBe(true);
  });

  it('matches Arabic words', () => {
    expect(checkFuzzyWordMatch('تفاحة', 'تفاحة')).toBe(true);
  });

  it('rejects different or empty guesses', () => {
    expect(checkFuzzyWordMatch('car', 'cat')).toBe(false);
    expect(checkFuzzyWordMatch('', 'pizza')).toBe(false);
    expect(checkFuzzyWordMatch('burger', 'pizza')).toBe(false);
  });
});

describe('tallyVotes', () => {
  const players = ids(4).map((id) => ({ id, name: id.toUpperCase(), avatar: '🦊' }));

  it('eliminates the player with the most votes', () => {
    const r = tallyVotes({ p1: 'p3', p2: 'p3', p4: 'p1' }, players);
    expect(r.eliminatedId).toBe('p3');
    expect(r.maxVotes).toBe(2);
    expect(r.isTie).toBe(false);
    expect(r.tallies[0]).toMatchObject({ targetId: 'p3', targetName: 'P3', count: 2, voters: ['p1', 'p2'] });
  });

  it('reports a tie instead of eliminating anyone', () => {
    const r = tallyVotes({ p1: 'p2', p2: 'p1' }, players);
    expect(r.eliminatedId).toBeNull();
    expect(r.isTie).toBe(true);
    expect([...r.tiedIds].sort()).toEqual(['p1', 'p2']);
  });

  it('handles a round with no votes', () => {
    expect(tallyVotes({}, players)).toMatchObject({ eliminatedId: null, isTie: false, maxVotes: 0 });
  });
});

describe('evaluateWinner', () => {
  it('civilians win when no impostor is left', () => {
    expect(evaluateWinner({ a: 'civilian', b: 'civilian' })).toMatchObject({ hasWinner: true, winningTeam: 'civilian' });
  });

  it('Mister White wins at parity', () => {
    expect(evaluateWinner({ a: 'civilian', b: 'mr_white' })).toMatchObject({ hasWinner: true, winningTeam: 'mr_white' });
  });

  it('the Undercover wins at parity', () => {
    expect(evaluateWinner({ a: 'civilian', b: 'undercover' })).toMatchObject({ hasWinner: true, winningTeam: 'undercover' });
  });

  it('the game goes on while civilians outnumber impostors', () => {
    expect(evaluateWinner({ a: 'civilian', b: 'civilian', c: 'mr_white' })).toMatchObject({ hasWinner: false, winningTeam: null });
  });
});

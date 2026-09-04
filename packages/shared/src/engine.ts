import { GameSettings, Role, VoteTally, WordPair } from './types';

export function assignRoles(
  playerIds: string[],
  settings: GameSettings
): { roles: Record<string, Role>; turnOrder: string[] } {
  const count = playerIds.length;
  let mrWhiteCount = Math.max(0, Math.min(settings.mrWhiteCount, Math.floor(count / 3)));
  let undercoverCount = Math.max(0, Math.min(settings.undercoverCount, Math.floor((count - mrWhiteCount) / 2)));

  // Guarantee at least 1 impostor (Undercover or Mister White) when starting a game
  if (mrWhiteCount === 0 && undercoverCount === 0 && count >= 3) {
    if (settings.mrWhiteCount === 0) {
      undercoverCount = 1;
    } else {
      mrWhiteCount = 1;
    }
  }

  const civilianCount = Math.max(1, count - mrWhiteCount - undercoverCount);

  const rolePool: Role[] = [
    ...Array(civilianCount).fill('civilian'),
    ...Array(mrWhiteCount).fill('mr_white'),
    ...Array(undercoverCount).fill('undercover'),
  ];

  // Fisher-Yates Shuffle
  const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5);
  const shuffledRoles = [...rolePool].sort(() => Math.random() - 0.5);

  const roles: Record<string, Role> = {};
  shuffledPlayers.forEach((pid, idx) => {
    roles[pid] = shuffledRoles[idx] || 'civilian';
  });

  return {
    roles,
    turnOrder: [...shuffledPlayers].sort(() => Math.random() - 0.5),
  };
}

export function checkFuzzyWordMatch(guess: string, targetWord: string): boolean {
  if (!guess || !targetWord) return false;
  const clean = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^\p{L}\p{N}]/gu, ''); // keep unicode letters and numbers

  const g = clean(guess);
  const t = clean(targetWord);
  if (!g || !t) return false;

  if (g === t) return true;
  if (g.length >= 4 && (t.includes(g) || g.includes(t))) return true;

  // Levenshtein distance tolerance of 1 for words length > 4
  if (Math.abs(g.length - t.length) <= 1 && g.length > 4) {
    let diff = 0;
    for (let i = 0, j = 0; i < g.length && j < t.length; ) {
      if (g[i] !== t[j]) {
        diff++;
        if (g.length > t.length) i++;
        else if (t.length > g.length) j++;
        else {
          i++;
          j++;
        }
      } else {
        i++;
        j++;
      }
    }
    return diff <= 1;
  }

  return false;
}

export function tallyVotes(
  votes: Record<string, string>, // voterId -> targetId
  players: { id: string; name: string; avatar: string }[]
): { tallies: VoteTally[]; maxVotes: number; eliminatedId: string | null; isTie: boolean; tiedIds: string[] } {
  const counts: Record<string, { count: number; voters: string[] }> = {};

  Object.entries(votes).forEach(([voterId, targetId]) => {
    if (!counts[targetId]) counts[targetId] = { count: 0, voters: [] };
    counts[targetId].count += 1;
    counts[targetId].voters.push(voterId);
  });

  const tallies: VoteTally[] = Object.entries(counts).map(([targetId, info]) => {
    const p = players.find((pl) => pl.id === targetId);
    return {
      targetId,
      targetName: p ? p.name : 'Unknown',
      targetAvatar: p ? p.avatar : '👤',
      count: info.count,
      voters: info.voters,
    };
  });

  tallies.sort((a, b) => b.count - a.count);

  if (tallies.length === 0) {
    return { tallies: [], maxVotes: 0, eliminatedId: null, isTie: false, tiedIds: [] };
  }

  const maxVotes = tallies[0].count;
  const topCandidates = tallies.filter((t) => t.count === maxVotes);

  if (topCandidates.length > 1) {
    return {
      tallies,
      maxVotes,
      eliminatedId: null,
      isTie: true,
      tiedIds: topCandidates.map((t) => t.targetId),
    };
  }

  return {
    tallies,
    maxVotes,
    eliminatedId: topCandidates[0].targetId,
    isTie: false,
    tiedIds: [],
  };
}

export function evaluateWinner(
  alivePlayerRoles: Record<string, Role>
): { hasWinner: boolean; winningTeam: 'civilian' | 'mr_white' | 'undercover' | null; reason: string | null } {
  const roles = Object.values(alivePlayerRoles);
  const mrWhites = roles.filter((r) => r === 'mr_white').length;
  const undercovers = roles.filter((r) => r === 'undercover').length;
  const civilians = roles.filter((r) => r === 'civilian').length;
  const impostors = mrWhites + undercovers;

  // 1. Civilians Win if all impostors are eliminated
  if (impostors === 0) {
    return {
      hasWinner: true,
      winningTeam: 'civilian',
      reason: 'All impostors have been unmasked and eliminated!',
    };
  }

  // 2. Impostors reach parity (impostors >= civilians)
  if (impostors >= civilians) {
    if (mrWhites > 0 && undercovers === 0) {
      return {
        hasWinner: true,
        winningTeam: 'mr_white',
        reason: 'Mister White survived and blended in until the end!',
      };
    }
    if (undercovers > 0 && mrWhites === 0) {
      return {
        hasWinner: true,
        winningTeam: 'undercover',
        reason: 'The Undercover agent survived and outsmarted the civilians!',
      };
    }
    return {
      hasWinner: true,
      winningTeam: 'mr_white',
      reason: 'The impostors reached numerical parity and won the game!',
    };
  }

  return {
    hasWinner: false,
    winningTeam: null,
    reason: null,
  };
}

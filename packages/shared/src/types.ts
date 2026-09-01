export type Language = 'en' | 'fr' | 'ar';
export type GameMode = 'online' | 'local';
export type Role = 'civilian' | 'mr_white' | 'undercover';
export type GamePhase =
  | 'LOBBY'
  | 'ROLE_REVEAL'
  | 'CLUE_ROUND'
  | 'DISCUSSION'
  | 'VOTING'
  | 'VOTE_TALLY'
  | 'SUDDEN_DEATH_TIE'
  | 'ELIMINATION_REVEAL'
  | 'MR_WHITE_GUESS'
  | 'GAME_OVER';

export interface GameSettings {
  mrWhiteCount: number;
  undercoverCount: number;
  discussionTimeSeconds: number;
  votingTimeSeconds: number;
  categories: string[];
  allowMrWhiteGuess: boolean;
  language: Language;
}

export interface PlayerPublic {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isAlive: boolean;
  isReady: boolean;
  score: number;
  hasVoted: boolean;
  connected: boolean;
}

export interface PlayerPrivate extends PlayerPublic {
  role: Role | null;
  secretWord: string | null;
}

export interface WordPair {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  en: { civilian: string; undercover: string; forbiddenGuesses?: string[] };
  fr: { civilian: string; undercover: string; forbiddenGuesses?: string[] };
  ar: { civilian: string; undercover: string; forbiddenGuesses?: string[] };
}

export interface VoteTally {
  targetId: string;
  targetName: string;
  targetAvatar: string;
  count: number;
  voters: string[];
}

export interface GameStatePublic {
  roomCode: string;
  phase: GamePhase;
  settings: GameSettings;
  players: PlayerPublic[];
  currentTurnPlayerId: string | null;
  turnOrder: string[];
  turnIndex: number;
  phaseEndsAt: number | null; // Unix timestamp ms for countdown
  eliminatedPlayerId: string | null;
  eliminatedPlayerRole: Role | null;
  voteTallies: VoteTally[];
  tiedPlayerIds: string[];
  winningTeam: 'civilian' | 'mr_white' | 'undercover' | null;
  winningReason: string | null;
  roundNumber: number;
  revealedWord: string | null; // only present in GAME_OVER
  revealedRoles?: Record<string, Role>; // only present in GAME_OVER
}

export interface LocalGamePlayer {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  secretWord: string | null;
  isAlive: boolean;
  score: number;
}

export interface ClientToServerEvents {
  'room:create': (data: { playerName: string; avatar: string; language: Language; mode: GameMode }) => void;
  'room:join': (data: { roomCode: string; playerName: string; avatar: string }) => void;
  'room:update_settings': (data: { settings: Partial<GameSettings> }) => void;
  'room:set_ready': (data: { ready: boolean }) => void;
  'game:start': () => void;
  'game:clue_done': () => void;
  'game:start_voting_early': () => void;
  'game:submit_vote': (data: { targetPlayerId: string }) => void;
  'game:mr_white_guess': (data: { guessedWord: string }) => void;
  'game:play_again': () => void;
  'player:leave': () => void;
}

export interface ServerToClientEvents {
  'sync:state': (data: { publicState: GameStatePublic; privateState: PlayerPrivate }) => void;
  'sync:error': (data: { message: string; code?: string }) => void;
  'game:notification': (data: { message: string; type: 'info' | 'warning' | 'success' | 'danger' }) => void;
}

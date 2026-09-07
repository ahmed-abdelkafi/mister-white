import {
  GameStatePublic,
  PlayerPrivate,
  PlayerPublic,
  GameSettings,
  GamePhase,
  Role,
  WordPair,
  DEFAULT_GAME_SETTINGS,
  assignRoles,
  tallyVotes,
  evaluateWinner,
  checkFuzzyWordMatch,
} from '@mister-white/shared';
import { Env, getRandomWordPair } from '../db/words';

interface InternalPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isAlive: boolean;
  isReady: boolean;
  score: number;
  hasVoted: boolean;
  connected: boolean;
  role: Role | null;
  secretWord: string | null;
}

export class GameRoomDO implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private roomCode: string = '';
  private phase: GamePhase = 'LOBBY';
  private settings: GameSettings = { ...DEFAULT_GAME_SETTINGS };
  private players: Map<string, InternalPlayer> = new Map();
  private sockets: Map<WebSocket, string> = new Map(); // WebSocket -> PlayerId
  private currentTurnPlayerId: string | null = null;
  private turnOrder: string[] = [];
  private turnIndex: number = 0;
  private phaseEndsAt: number | null = null;
  private eliminatedPlayerId: string | null = null;
  private eliminatedPlayerRole: Role | null = null;
  private votes: Record<string, string> = {}; // VoterId -> TargetId
  private tiedPlayerIds: string[] = [];
  private winningTeam: 'civilian' | 'mr_white' | 'undercover' | null = null;
  private winningReason: string | null = null;
  private roundNumber: number = 1;
  private currentWordPair: WordPair | null = null;
  private playedWordIds: Set<string> = new Set();
  private timerAlarm: any = null;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith('/ws')) {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected WebSocket', { status: 426 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      const playerId = url.searchParams.get('playerId') || crypto.randomUUID();
      const roomCode = url.searchParams.get('roomCode') || 'ROOM';
      this.roomCode = roomCode;

      this.handleWebSocketSession(server, playerId);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    if (url.pathname.endsWith('/info')) {
      return new Response(JSON.stringify(this.getPublicState()), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });
  }

  private handleWebSocketSession(ws: WebSocket, playerId: string) {
    ws.accept();
    this.sockets.set(ws, playerId);

    if (this.players.has(playerId)) {
      const player = this.players.get(playerId)!;
      player.connected = true;
    }

    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        await this.handleClientMessage(playerId, data);
      } catch (err: any) {
        this.sendError(ws, err.message || 'Invalid message format');
      }
    });

    ws.addEventListener('close', () => {
      this.sockets.delete(ws);
      if (this.players.has(playerId)) {
        const player = this.players.get(playerId)!;
        player.connected = false;

        // If in lobby, remove player; if in game, keep for reconnection
        if (this.phase === 'LOBBY') {
          if (player.isHost) {
            // Assign next available host
            this.players.delete(playerId);
            const remaining = Array.from(this.players.values());
            if (remaining.length > 0) {
              remaining[0].isHost = true;
            }
          } else {
            this.players.delete(playerId);
          }
        }
        this.broadcastState();
      }
    });

    // Send initial synced state to the newly connected client
    this.syncClient(ws, playerId);
  }

  private async handleClientMessage(playerId: string, msg: { type: string; payload?: any }) {
    switch (msg.type) {
      case 'room:join_or_create': {
        const { name, avatar, isHost, language } = msg.payload;
        if (language) this.settings.language = language;

        let player = this.players.get(playerId);
        if (!player) {
          player = {
            id: playerId,
            name: name || `Player ${this.players.size + 1}`,
            avatar: avatar || '🕵️',
            isHost: isHost || this.players.size === 0,
            isAlive: true,
            isReady: false,
            score: 0,
            hasVoted: false,
            connected: true,
            role: null,
            secretWord: null,
          };
          this.players.set(playerId, player);
        } else {
          player.name = name || player.name;
          player.avatar = avatar || player.avatar;
          player.connected = true;
        }

        this.broadcastState();
        break;
      }

      case 'room:update_settings': {
        const player = this.players.get(playerId);
        if (!player?.isHost) return;
        this.settings = { ...this.settings, ...msg.payload.settings };
        this.broadcastState();
        break;
      }

      case 'room:set_ready': {
        const player = this.players.get(playerId);
        if (!player) return;
        player.isReady = !!msg.payload?.ready;
        this.broadcastState();
        break;
      }

      case 'game:start': {
        const player = this.players.get(playerId);
        if (!player?.isHost) return;
        if (this.players.size < 3) {
          this.broadcastNotification('At least 3 players required to start', 'warning');
          return;
        }
        await this.startNewGame();
        break;
      }

      case 'game:role_revealed_ready': {
        const player = this.players.get(playerId);
        if (!player) return;
        player.isReady = true;

        const allReady = Array.from(this.players.values()).every((p) => p.isReady);
        if (allReady) {
          this.transitionToClueRound();
        } else {
          this.broadcastState();
        }
        break;
      }

      case 'game:clue_done': {
        if (this.currentTurnPlayerId !== playerId) return;
        this.advanceClueTurn();
        break;
      }

      case 'game:start_voting_early': {
        if (this.phase === 'DISCUSSION') {
          this.transitionToVoting();
        }
        break;
      }

      case 'game:submit_vote': {
        const { targetPlayerId } = msg.payload;
        const voter = this.players.get(playerId);
        if (!voter || !voter.isAlive || this.phase !== 'VOTING') return;

        this.votes[playerId] = targetPlayerId;
        voter.hasVoted = true;

        const aliveCount = Array.from(this.players.values()).filter((p) => p.isAlive).length;
        const votesCount = Object.keys(this.votes).length;

        if (votesCount >= aliveCount) {
          this.resolveVoting();
        } else {
          this.broadcastState();
        }
        break;
      }

      case 'game:mr_white_guess': {
        if (this.phase !== 'MR_WHITE_GUESS' || this.eliminatedPlayerId !== playerId) return;
        const { guessedWord } = msg.payload;
        this.handleMrWhiteGuess(guessedWord);
        break;
      }

      case 'game:play_again': {
        const player = this.players.get(playerId);
        if (!player?.isHost) return;
        await this.startNewGame();
        break;
      }
    }
  }

  private async startNewGame() {
    this.roundNumber = 1;
    this.votes = {};
    this.eliminatedPlayerId = null;
    this.eliminatedPlayerRole = null;
    this.tiedPlayerIds = [];
    this.winningTeam = null;
    this.winningReason = null;

    // Fetch new word pair
    const wordPair = await getRandomWordPair(this.env, this.settings.categories, this.playedWordIds);
    this.currentWordPair = wordPair;
    this.playedWordIds.add(wordPair.id);

    // Assign roles
    const playerIds = Array.from(this.players.keys());
    const { roles, turnOrder } = assignRoles(playerIds, this.settings);
    this.turnOrder = turnOrder;
    this.turnIndex = 0;
    this.currentTurnPlayerId = this.turnOrder[0] || null;

    const lang = this.settings.language || 'en';
    const civilianWord = wordPair[lang].civilian;
    const undercoverWord = wordPair[lang].undercover;

    this.players.forEach((player, pid) => {
      player.isAlive = true;
      player.isReady = false;
      player.hasVoted = false;
      player.role = roles[pid] || 'civilian';

      if (player.role === 'civilian') {
        player.secretWord = civilianWord;
      } else if (player.role === 'undercover') {
        player.secretWord = undercoverWord;
      } else {
        player.secretWord = null; // Mister White has NO word
      }
    });

    this.phase = 'ROLE_REVEAL';
    this.phaseEndsAt = Date.now() + 15000; // 15 seconds to reveal
    this.broadcastState();

    this.scheduleTimer(15000, () => {
      if (this.phase === 'ROLE_REVEAL') {
        this.transitionToClueRound();
      }
    });
  }

  private transitionToClueRound() {
    this.phase = 'CLUE_ROUND';
    // Shuffle turn order among all currently ALIVE players every single round and game!
    const aliveIds = Array.from(this.players.values())
      .filter((p) => p.isAlive)
      .map((p) => p.id);

    for (let i = aliveIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [aliveIds[i], aliveIds[j]] = [aliveIds[j], aliveIds[i]];
    }

    this.turnOrder = aliveIds;
    this.turnIndex = 0;
    this.currentTurnPlayerId = this.turnOrder[0] || null;
    this.phaseEndsAt = Date.now() + 45000;
    this.broadcastState();
  }

  private advanceClueTurn() {
    this.turnIndex++;
    if (this.turnIndex < this.turnOrder.length) {
      // Find next alive player in turn order
      while (this.turnIndex < this.turnOrder.length) {
        const nextId = this.turnOrder[this.turnIndex];
        const p = this.players.get(nextId);
        if (p && p.isAlive) {
          this.currentTurnPlayerId = nextId;
          this.phaseEndsAt = Date.now() + 45000;
          this.broadcastState();
          return;
        }
        this.turnIndex++;
      }
    }

    // All alive players gave clues -> Move to open discussion
    this.transitionToDiscussion();
  }

  private transitionToDiscussion() {
    this.phase = 'DISCUSSION';
    this.currentTurnPlayerId = null;
    const duration = this.settings.discussionTimeSeconds * 1000;
    this.phaseEndsAt = Date.now() + duration;
    this.broadcastState();

    this.scheduleTimer(duration, () => {
      if (this.phase === 'DISCUSSION') {
        this.transitionToVoting();
      }
    });
  }

  private transitionToVoting() {
    this.phase = 'VOTING';
    this.votes = {};
    this.players.forEach((p) => (p.hasVoted = false));
    const duration = this.settings.votingTimeSeconds * 1000;
    this.phaseEndsAt = Date.now() + duration;
    this.broadcastState();

    this.scheduleTimer(duration, () => {
      if (this.phase === 'VOTING') {
        this.resolveVoting();
      }
    });
  }

  private resolveVoting() {
    this.phase = 'VOTE_TALLY';
    const playerList = Array.from(this.players.values());
    const { tallies, eliminatedId, isTie, tiedIds } = tallyVotes(this.votes, playerList);

    this.tiedPlayerIds = tiedIds;
    this.broadcastState();

    this.scheduleTimer(4000, () => {
      if (isTie) {
        // Vote ended in a tie -> Re-order all alive players and return to Discussion!
        const aliveIds = Array.from(this.players.values())
          .filter((p) => p.isAlive)
          .map((p) => p.id);

        // Fisher-Yates random shuffle to reorder users
        for (let i = aliveIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [aliveIds[i], aliveIds[j]] = [aliveIds[j], aliveIds[i]];
        }

        this.turnOrder = aliveIds;
        this.turnIndex = 0;
        this.currentTurnPlayerId = this.turnOrder[0] || null;
        this.broadcastNotification('⚖️ Vote ended in a tie! Speaking order re-shuffled for discussion.', 'warning');
        this.transitionToDiscussion();
      } else if (eliminatedId) {
        const eliminatedPlayer = this.players.get(eliminatedId);
        if (eliminatedPlayer) {
          eliminatedPlayer.isAlive = false;
          this.eliminatedPlayerId = eliminatedId;
          this.eliminatedPlayerRole = eliminatedPlayer.role;

          if (eliminatedPlayer.role === 'mr_white' && this.settings.allowMrWhiteGuess) {
            // Mister White eliminated -> Enter final clutch guess phase!
            this.phase = 'MR_WHITE_GUESS';
            this.phaseEndsAt = Date.now() + 30000;
            this.broadcastState();

            this.scheduleTimer(30000, () => {
              if (this.phase === 'MR_WHITE_GUESS') {
                this.handleMrWhiteGuess('');
              }
            });
            return;
          }
        }

        this.checkWinOrNextRound();
      } else {
        // No votes -> next round
        this.checkWinOrNextRound();
      }
    });
  }

  private handleMrWhiteGuess(guess: string) {
    const lang = this.settings.language || 'en';
    const targetWord = this.currentWordPair ? this.currentWordPair[lang].civilian : '';

    const isMatch = checkFuzzyWordMatch(guess, targetWord);

    if (isMatch) {
      this.winningTeam = 'mr_white';
      this.winningReason = `Mister White guessed the secret word correctly ("${targetWord}") and stole the victory!`;
      this.endGame();
    } else {
      this.broadcastNotification(`Mister White's guess was incorrect!`, 'danger');
      this.checkWinOrNextRound();
    }
  }

  private checkWinOrNextRound() {
    const aliveRoles: Record<string, Role> = {};
    this.players.forEach((p) => {
      if (p.isAlive && p.role) aliveRoles[p.id] = p.role;
    });

    const { hasWinner, winningTeam, reason } = evaluateWinner(aliveRoles);

    if (hasWinner) {
      this.winningTeam = winningTeam;
      this.winningReason = reason;
      this.endGame();
    } else {
      this.roundNumber++;
      this.transitionToClueRound();
    }
  }

  private endGame() {
    this.phase = 'GAME_OVER';
    this.phaseEndsAt = null;

    // Award scores
    this.players.forEach((p) => {
      if (p.role === this.winningTeam) {
        p.score += 100;
      }
    });

    this.broadcastState();
  }

  private scheduleTimer(ms: number, callback: () => void) {
    if (this.timerAlarm) clearTimeout(this.timerAlarm);
    this.timerAlarm = setTimeout(() => {
      callback();
    }, ms);
  }

  private getPublicState(): GameStatePublic {
    const playerList = Array.from(this.players.values());
    const tallies = this.phase === 'VOTE_TALLY' || this.phase === 'GAME_OVER'
      ? tallyVotes(this.votes, playerList).tallies
      : [];

    const lang = this.settings.language || 'en';
    const revealedRoles: Record<string, Role> = {};
    if (this.phase === 'GAME_OVER') {
      this.players.forEach((p) => {
        if (p.role) revealedRoles[p.id] = p.role;
      });
    }

    return {
      roomCode: this.roomCode,
      phase: this.phase,
      settings: this.settings,
      players: playerList.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isHost: p.isHost,
        isAlive: p.isAlive,
        isReady: p.isReady,
        score: p.score,
        hasVoted: p.hasVoted,
        connected: p.connected,
      })),
      currentTurnPlayerId: this.currentTurnPlayerId,
      turnOrder: this.turnOrder,
      turnIndex: this.turnIndex,
      phaseEndsAt: this.phaseEndsAt,
      eliminatedPlayerId: this.eliminatedPlayerId,
      eliminatedPlayerRole: this.phase === 'GAME_OVER' ? this.eliminatedPlayerRole : null,
      voteTallies: tallies,
      tiedPlayerIds: this.tiedPlayerIds,
      winningTeam: this.winningTeam,
      winningReason: this.winningReason,
      roundNumber: this.roundNumber,
      revealedWord: this.phase === 'GAME_OVER' && this.currentWordPair ? this.currentWordPair[lang].civilian : null,
      revealedUndercoverWord:
        this.phase === 'GAME_OVER' && this.currentWordPair && this.settings.undercoverCount > 0
          ? this.currentWordPair[lang].undercover
          : null,
      revealedRoles: this.phase === 'GAME_OVER' ? revealedRoles : undefined,
    };
  }

  private getPrivateState(playerId: string): PlayerPrivate {
    const player = this.players.get(playerId);
    return {
      id: playerId,
      name: player ? player.name : '',
      avatar: player ? player.avatar : '👤',
      isHost: player ? player.isHost : false,
      isAlive: player ? player.isAlive : true,
      isReady: player ? player.isReady : false,
      score: player ? player.score : 0,
      hasVoted: player ? player.hasVoted : false,
      connected: player ? player.connected : true,
      role: player
        ? this.phase === 'GAME_OVER'
          ? player.role
          : player.role === 'undercover'
          ? 'civilian'
          : player.role
        : null,
      secretWord: player ? player.secretWord : null,
    };
  }

  private broadcastState() {
    const publicState = this.getPublicState();
    for (const [ws, pid] of this.sockets.entries()) {
      try {
        const privateState = this.getPrivateState(pid);
        ws.send(
          JSON.stringify({
            type: 'sync:state',
            payload: { publicState, privateState },
          })
        );
      } catch (e) {
        // Socket closed or failed
      }
    }
  }

  private syncClient(ws: WebSocket, playerId: string) {
    const publicState = this.getPublicState();
    const privateState = this.getPrivateState(playerId);
    ws.send(
      JSON.stringify({
        type: 'sync:state',
        payload: { publicState, privateState },
      })
    );
  }

  private broadcastNotification(message: string, type: 'info' | 'warning' | 'success' | 'danger') {
    for (const ws of this.sockets.keys()) {
      try {
        ws.send(JSON.stringify({ type: 'game:notification', payload: { message, type } }));
      } catch (e) {}
    }
  }

  private sendError(ws: WebSocket, message: string) {
    try {
      ws.send(JSON.stringify({ type: 'sync:error', payload: { message } }));
    } catch (e) {}
  }
}

import React, { useState } from 'react';
import { useI18n } from './hooks/useI18n';
import { useSound } from './hooks/useSound';
import { useSocket } from './hooks/useSocket';
import { Header } from './components/Header';
import { HomeScreen } from './screens/HomeScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { RoleRevealScreen } from './screens/RoleRevealScreen';
import { ClueRoundScreen } from './screens/ClueRoundScreen';
import { DiscussionScreen } from './screens/DiscussionScreen';
import { VotingScreen } from './screens/VotingScreen';
import { VoteTallyScreen } from './screens/VoteTallyScreen';
import { SuddenDeathScreen } from './screens/SuddenDeathScreen';
import { MrWhiteGuessScreen } from './screens/MrWhiteGuessScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { LocalPassPlayScreen } from './screens/LocalPassPlayScreen';

export function App() {
  const { lang } = useI18n();
  const sound = useSound();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // App mode & identity
  const [appMode, setAppMode] = useState<'home' | 'online' | 'local'>('home');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerId] = useState(() => {
    let id = sessionStorage.getItem('mw_player_id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('mw_player_id', id);
    }
    return id;
  });
  const [playerName, setPlayerName] = useState('Player');
  const [avatar, setAvatar] = useState('🕵️');
  const [isHost, setIsHost] = useState(false);

  const {
    publicState,
    privateState,
    notification,
    send,
  } = useSocket({
    roomCode: appMode === 'online' ? roomCode : null,
    playerId,
    playerName,
    avatar,
    language: lang,
    isHost,
  });

  React.useEffect(() => {
    if (isHost && roomCode && appMode === 'online') {
      send('room:update_settings', { settings: { language: lang } });
    }
  }, [lang, isHost, roomCode, appMode, send]);

  const handleCreateOnline = (name: string, av: string) => {
    const code = 'WHT' + Math.floor(Math.random() * 899 + 100);
    setPlayerName(name);
    setAvatar(av);
    setIsHost(true);
    setRoomCode(code);
    setAppMode('online');
    sound.playVote();
  };

  const handleJoinOnline = (code: string, name: string, av: string) => {
    setPlayerName(name);
    setAvatar(av);
    setIsHost(false);
    setRoomCode(code.toUpperCase());
    setAppMode('online');
    sound.playVote();
  };

  const handleStartLocal = (name: string, av: string) => {
    setPlayerName(name);
    setAvatar(av);
    setAppMode('local');
    sound.playVote();
  };

  const handleLeaveGame = () => {
    setAppMode('home');
    setRoomCode(null);
  };

  // Sound triggering helper
  const onTick = (isUrgent: boolean) => {
    if (soundEnabled) sound.playTick(isUrgent);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        roomCode={roomCode}
        onLeave={appMode !== 'home' ? handleLeaveGame : undefined}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {notification && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '12px',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '700',
            background: notification.type === 'danger' ? 'var(--accent-rose)' : 'var(--accent-amber)',
            color: '#fff',
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Main View Router */}
      {appMode === 'home' && (
        <HomeScreen
          onCreateOnline={handleCreateOnline}
          onJoinOnline={handleJoinOnline}
          onStartLocal={handleStartLocal}
        />
      )}

      {appMode === 'local' && (
        <LocalPassPlayScreen
          onBackToHome={handleLeaveGame}
          onTick={onTick}
          onVictory={() => soundEnabled && sound.playVictory()}
          onEliminate={() => soundEnabled && sound.playElimination()}
        />
      )}

      {appMode === 'online' && publicState && privateState && (
        <>
          {publicState.phase === 'LOBBY' && (
            <LobbyScreen
              publicState={publicState}
              privateState={privateState}
              onUpdateSettings={(settings) => send('room:update_settings', { settings })}
              onSetReady={(ready) => send('room:set_ready', { ready })}
              onStartGame={() => send('game:start')}
            />
          )}

          {publicState.phase === 'ROLE_REVEAL' && (
            <RoleRevealScreen
              privateState={privateState}
              endsAt={publicState.phaseEndsAt}
              onReady={() => send('game:role_revealed_ready')}
              onTick={onTick}
            />
          )}

          {publicState.phase === 'CLUE_ROUND' && (
            <ClueRoundScreen
              publicState={publicState}
              privateState={privateState}
              onDoneTurn={() => send('game:clue_done')}
              onTick={onTick}
            />
          )}

          {publicState.phase === 'DISCUSSION' && (
            <DiscussionScreen
              publicState={publicState}
              privateState={privateState}
              onProceedToVoting={() => send('game:start_voting_early')}
              onTick={onTick}
            />
          )}

          {publicState.phase === 'VOTING' && (
            <VotingScreen
              publicState={publicState}
              privateState={privateState}
              onSubmitVote={(targetPlayerId) => {
                if (soundEnabled) sound.playVote();
                send('game:submit_vote', { targetPlayerId });
              }}
              onTick={onTick}
            />
          )}

          {publicState.phase === 'VOTE_TALLY' && (
            <VoteTallyScreen publicState={publicState} />
          )}

          {publicState.phase === 'SUDDEN_DEATH_TIE' && (
            <SuddenDeathScreen publicState={publicState} onTick={onTick} />
          )}

          {publicState.phase === 'MR_WHITE_GUESS' && (
            <MrWhiteGuessScreen
              publicState={publicState}
              privateState={privateState}
              onSubmitGuess={(guessedWord) => send('game:mr_white_guess', { guessedWord })}
              onTick={onTick}
            />
          )}

          {publicState.phase === 'GAME_OVER' && (
            <GameOverScreen
              publicState={publicState}
              privateState={privateState}
              onPlayAgain={() => send('game:play_again')}
              onLeave={handleLeaveGame}
            />
          )}
        </>
      )}
    </div>
  );
}
export default App;

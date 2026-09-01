import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import {
  LocalGamePlayer,
  Role,
  DEFAULT_GAME_SETTINGS,
  INITIAL_WORDS,
  assignRoles,
  evaluateWinner,
  checkFuzzyWordMatch,
} from '@mister-white/shared';
import { AvatarPicker } from '../components/AvatarPicker';
import { CountdownTimer } from '../components/CountdownTimer';
import { Plus, Trash2, Play, Eye, Smartphone, Skull, Trophy, HelpCircle, Send } from 'lucide-react';

interface LocalPassPlayScreenProps {
  onBackToHome: () => void;
  onTick?: (isUrgent: boolean) => void;
  onVictory?: () => void;
  onEliminate?: () => void;
}

export const LocalPassPlayScreen: React.FC<LocalPassPlayScreenProps> = ({
  onBackToHome,
  onTick,
  onVictory,
  onEliminate,
}) => {
  const { t, lang } = useI18n();

  // Setup state
  const [stage, setStage] = useState<'setup' | 'pass_reveal' | 'view_role' | 'discussion' | 'elimination' | 'mr_white_guess' | 'game_over'>('setup');
  const [players, setPlayers] = useState<LocalGamePlayer[]>([
    { id: '1', name: 'Player 1', avatar: '🕵️', role: 'civilian', secretWord: null, isAlive: true, score: 0 },
    { id: '2', name: 'Player 2', avatar: '🦊', role: 'civilian', secretWord: null, isAlive: true, score: 0 },
    { id: '3', name: 'Player 3', avatar: '🦉', role: 'civilian', secretWord: null, isAlive: true, score: 0 },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('🐱');
  const [currentPassIndex, setCurrentPassIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [eliminatedPlayer, setEliminatedPlayer] = useState<LocalGamePlayer | null>(null);
  const [mrWhiteGuess, setMrWhiteGuess] = useState('');
  const [localSettings, setLocalSettings] = useState({
    mrWhiteCount: 1,
    undercoverCount: 0,
    discussionTimeSeconds: 90,
    categories: ['footballers', 'headcoaches', 'football_clubs', 'anime_movies', 'food', 'places', 'objects', 'technology', 'animals', 'sports'],
  });
  const [showLocalSettings, setShowLocalSettings] = useState(false);
  const [winningTeam, setWinningTeam] = useState<'civilian' | 'mr_white' | 'undercover' | null>(null);
  const [winningReasonKey, setWinningReasonKey] = useState<string | null>(null);
  const [discussionEndsAt, setDiscussionEndsAt] = useState<number | null>(null);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([
      ...players,
      {
        id: String(Date.now()),
        name: newPlayerName.trim(),
        avatar: newPlayerAvatar,
        role: 'civilian',
        secretWord: null,
        isAlive: true,
        score: 0,
      },
    ]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const [playedWordIds, setPlayedWordIds] = useState<Set<string>>(new Set());

  const startLocalGame = () => {
    const activeCats = localSettings.categories;
    const pool = INITIAL_WORDS.filter(
      (w) => activeCats.length === 0 || activeCats.includes(w.category)
    );
    const unplayed = pool.filter((w) => !playedWordIds.has(w.id));
    const candidatePool = unplayed.length > 0 ? unplayed : pool.length > 0 ? pool : INITIAL_WORDS;
    const wordPair = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    setPlayedWordIds((prev) => new Set([...prev, wordPair.id]));

    const civWord = wordPair[lang]?.civilian || wordPair.en.civilian;
    const underWord = wordPair[lang]?.undercover || wordPair.en.undercover;
    setSecretWord(civWord);

    const { roles } = assignRoles(players.map((p) => p.id), {
      ...DEFAULT_GAME_SETTINGS,
      mrWhiteCount: localSettings.mrWhiteCount,
      undercoverCount: localSettings.undercoverCount,
      discussionTimeSeconds: localSettings.discussionTimeSeconds,
    });

    const updated = players.map((p) => {
      const role = roles[p.id] || 'civilian';
      return {
        ...p,
        role,
        secretWord: role === 'civilian' ? civWord : role === 'undercover' ? underWord : null,
        isAlive: true,
      };
    });

    setPlayers(updated);
    setCurrentPassIndex(0);
    setStage('pass_reveal');
  };

  const [confirmCandidate, setConfirmCandidate] = useState<LocalGamePlayer | null>(null);
  const [eliminatedAnnouncement, setEliminatedAnnouncement] = useState<LocalGamePlayer | null>(null);
  const [isTieAnnouncement, setIsTieAnnouncement] = useState(false);
  const [speakingOrder, setSpeakingOrder] = useState<string[]>([]);

  const proceedToDiscussion = () => {
    setStage('discussion');
    setDiscussionEndsAt(Date.now() + (localSettings.discussionTimeSeconds || 90) * 1000);

    // Dynamic randomization of turn order for every game and every round!
    const aliveIds = players.filter((p) => p.isAlive).map((p) => p.id);
    for (let i = aliveIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [aliveIds[i], aliveIds[j]] = [aliveIds[j], aliveIds[i]];
    }
    setSpeakingOrder(aliveIds);
  };

  const proceedToVoting = () => {
    setStage('elimination');
  };

  const applyWinRewards = (team: 'civilian' | 'mr_white' | 'undercover', isGuessWin = false) => {
    setPlayers((prev) =>
      prev.map((pl) => {
        let gain = 0;
        if (team === 'civilian') {
          if (pl.role === 'civilian') gain = pl.isAlive ? 3 : 2;
        } else if (team === 'undercover') {
          if (pl.role === 'undercover') gain = pl.isAlive ? 4 : 2;
        } else if (team === 'mr_white') {
          if (pl.role === 'mr_white') gain = isGuessWin ? 6 : 4;
        }
        return { ...pl, score: (pl.score || 0) + gain };
      })
    );
  };

  const confirmEliminate = (p: LocalGamePlayer) => {
    setConfirmCandidate(null);
    if (onEliminate) onEliminate();
    const updated = players.map((pl) => (pl.id === p.id ? { ...pl, isAlive: false } : pl));
    setPlayers(updated);
    setEliminatedPlayer(p);

    if (p.role === 'mr_white') {
      setMrWhiteGuess('');
      setStage('mr_white_guess');
    } else {
      // Check if win condition met
      const aliveRoles: Record<string, Role> = {};
      updated.forEach((pl) => {
        if (pl.isAlive) aliveRoles[pl.id] = pl.role;
      });

      const { hasWinner, winningTeam: team } = evaluateWinner(aliveRoles);
      if (hasWinner && team) {
        setWinningTeam(team);
        if (team === 'civilian') setWinningReasonKey('reason_civilians_win');
        else if (team === 'mr_white') setWinningReasonKey('reason_mr_white_survived');
        else if (team === 'undercover') setWinningReasonKey('reason_undercover_survived');
        applyWinRewards(team);
        if (onVictory) onVictory();
        setStage('game_over');
      } else {
        // Game continues! Show civilian eliminated popup
        setEliminatedAnnouncement(p);
      }
    }
  };

  const handleMrWhiteGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentGuess = mrWhiteGuess.trim();
    setMrWhiteGuess(''); // Empty the input for next time immediately
    const isMatch = checkFuzzyWordMatch(currentGuess, secretWord);
    if (isMatch) {
      setWinningTeam('mr_white');
      setWinningReasonKey('reason_mr_white_guess_win');
      applyWinRewards('mr_white', true);
      if (onVictory) onVictory();
      setStage('game_over');
    } else {
      checkLocalWin(players);
    }
  };

  const checkLocalWin = (currentPlayers: LocalGamePlayer[]) => {
    const aliveRoles: Record<string, Role> = {};
    currentPlayers.forEach((p) => {
      if (p.isAlive) aliveRoles[p.id] = p.role;
    });

    const { hasWinner, winningTeam: team } = evaluateWinner(aliveRoles);
    if (hasWinner && team) {
      setWinningTeam(team);
      if (team === 'civilian') setWinningReasonKey('reason_civilians_win');
      else if (team === 'mr_white') setWinningReasonKey('reason_mr_white_survived');
      else if (team === 'undercover') setWinningReasonKey('reason_undercover_survived');
      applyWinRewards(team);
      if (onVictory) onVictory();
      setStage('game_over');
    } else {
      proceedToDiscussion();
    }
  };

  const currentPlayer = players[currentPassIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      {/* 1. Setup Stage */}
      {stage === 'setup' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{t('pass_and_play')}</h2>
            <button
              onClick={() => setShowLocalSettings(!showLocalSettings)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              ⚙️ {t('settings')}
            </button>
          </div>

          {/* Local Settings Panel */}
          {showLocalSettings && (
            <div
              style={{
                padding: '14px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid var(--accent-purple)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>🕵️ {t('mr_white_count')}:</label>
                <select
                  className="input-field"
                  style={{ width: '80px', padding: '6px', textAlign: 'center' }}
                  value={localSettings.mrWhiteCount}
                  onChange={(e) => setLocalSettings({ ...localSettings, mrWhiteCount: Number(e.target.value) })}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>🎭 {t('undercover_count')}:</label>
                <select
                  className="input-field"
                  style={{ width: '80px', padding: '6px', textAlign: 'center' }}
                  value={localSettings.undercoverCount}
                  onChange={(e) => setLocalSettings({ ...localSettings, undercoverCount: Number(e.target.value) })}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>⏱️ {t('discussion_time')}:</label>
                <select
                  className="input-field"
                  style={{ width: '80px', padding: '6px', textAlign: 'center' }}
                  value={localSettings.discussionTimeSeconds}
                  onChange={(e) => setLocalSettings({ ...localSettings, discussionTimeSeconds: Number(e.target.value) })}
                >
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={90}>90s</option>
                  <option value={120}>120s</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                    📂 {t('categories')} ({localSettings.categories.length === 0 ? t('cat_all') : `${localSettings.categories.length}/29`})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (localSettings.categories.length === 0) {
                        setLocalSettings({ ...localSettings, categories: ['fruits'] });
                      } else {
                        setLocalSettings({ ...localSettings, categories: [] });
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-purple)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {localSettings.categories.length === 0 ? 'Deselect All' : t('cat_all')}
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {[
                    { id: 'fruits', labelKey: 'cat_fruits' },
                    { id: 'vegetables', labelKey: 'cat_vegetables' },
                    { id: 'cars', labelKey: 'cat_cars' },
                    { id: 'food', labelKey: 'cat_food' },
                    { id: 'drinks', labelKey: 'cat_drinks' },
                    { id: 'desserts', labelKey: 'cat_desserts' },
                    { id: 'brands', labelKey: 'cat_brands' },
                    { id: 'flags', labelKey: 'cat_flags' },
                    { id: 'footballers', labelKey: 'cat_footballers' },
                    { id: 'headcoaches', labelKey: 'cat_headcoaches' },
                    { id: 'football_clubs', labelKey: 'cat_football_clubs' },
                    { id: 'anime_heroes', labelKey: 'cat_anime_heroes' },
                    { id: 'cities_countries', labelKey: 'cat_cities_countries' },
                    { id: 'animals', labelKey: 'cat_animals' },
                    { id: 'technology', labelKey: 'cat_technology' },
                    { id: 'sports', labelKey: 'cat_sports' },
                    { id: 'music', labelKey: 'cat_music' },
                    { id: 'clothing', labelKey: 'cat_clothing' },
                    { id: 'furniture', labelKey: 'cat_furniture' },
                    { id: 'professions', labelKey: 'cat_professions' },
                    { id: 'nature', labelKey: 'cat_nature' },
                    { id: 'movies', labelKey: 'cat_movies' },
                    { id: 'videogames', labelKey: 'cat_videogames' },
                    { id: 'school', labelKey: 'cat_school' },
                    { id: 'art', labelKey: 'cat_art' },
                    { id: 'landmarks', labelKey: 'cat_landmarks' },
                    { id: 'transport', labelKey: 'cat_transport' },
                    { id: 'social_media', labelKey: 'cat_social_media' },
                    { id: 'accessories', labelKey: 'cat_accessories' },
                  ].map((cat) => {
                    const isSelected = localSettings.categories.length === 0 || localSettings.categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          let updated: string[];
                          if (localSettings.categories.length === 0) {
                            const allIds = [
                              'fruits', 'vegetables', 'cars', 'food', 'drinks', 'desserts',
                              'brands', 'flags', 'footballers', 'headcoaches', 'football_clubs',
                              'anime_heroes', 'cities_countries', 'animals', 'technology', 'sports',
                              'music', 'clothing', 'furniture', 'professions', 'nature', 'movies',
                              'videogames', 'school', 'art', 'landmarks', 'transport', 'social_media', 'accessories'
                            ];
                            updated = allIds.filter((c) => c !== cat.id);
                          } else if (localSettings.categories.includes(cat.id)) {
                            updated = localSettings.categories.filter((c) => c !== cat.id);
                            if (updated.length === 0) updated = ['fruits'];
                          } else {
                            updated = [...localSettings.categories, cat.id];
                          }
                          setLocalSettings({ ...localSettings, categories: updated });
                        }}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected ? '1px solid var(--accent-purple)' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {t(cat.labelKey as any)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
            {players.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  type="button"
                  title="Change avatar"
                  onClick={() => {
                    const avatarList = ['🕵️', '🦊', '🦉', '🐱', '🦁', '🐼', '🤖', '👑', '🧙', '👽', '🦄', '👻', '🎩', '🕶️', '🎭', '🔍'];
                    const currentIdx = avatarList.indexOf(p.avatar);
                    const nextAvatar = avatarList[(currentIdx + 1) % avatarList.length];
                    setPlayers(players.map((pl) => (pl.id === p.id ? { ...pl, avatar: nextAvatar } : pl)));
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1.5rem',
                    padding: '4px 6px',
                    cursor: 'pointer',
                  }}
                >
                  {p.avatar}
                </button>

                <input
                  type="text"
                  className="input-field"
                  style={{ padding: '8px 10px', fontSize: '0.95rem', fontWeight: '700', flex: 1 }}
                  value={p.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setPlayers(players.map((pl) => (pl.id === p.id ? { ...pl, name: newName } : pl)));
                  }}
                  placeholder={`${t('players')} ${idx + 1}`}
                  maxLength={15}
                />

                {players.length > 3 && (
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="btn btn-secondary"
                    style={{ padding: '8px', borderRadius: '8px' }}
                    title="Remove"
                  >
                    <Trash2 size={16} color="var(--accent-rose)" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add player row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input-field"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={t('add_player_placeholder')}
              maxLength={12}
            />
            <button onClick={addPlayer} disabled={!newPlayerName.trim()} className="btn btn-secondary">
              <Plus size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={onBackToHome} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('back')}
            </button>
            <button onClick={startLocalGame} className="btn btn-emerald" style={{ flex: 2 }}>
              <Play size={18} />
              {t('start_game')}
            </button>
          </div>
        </div>
      )}

      {/* 2. Pass Screen */}
      {stage === 'pass_reveal' && currentPlayer && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          <Smartphone size={56} color="var(--accent-cyan)" className="float-item" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900' }}>
            {t('pass_to_next', { name: currentPlayer.name })}
          </h2>
          <div style={{ fontSize: '3.5rem' }}>{currentPlayer.avatar}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {t('pass_screen_tap', { name: currentPlayer.name })}
          </p>

          <button onClick={() => setStage('view_role')} className="btn btn-primary btn-large btn-full">
            <Eye size={20} />
            {t('i_am_player', { name: currentPlayer.name })}
          </button>
        </div>
      )}

      {/* 3. View Role Tap & Hold */}
      {stage === 'view_role' && currentPlayer && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              {t('player_secret_word_title', { name: currentPlayer.name })}
            </h3>
          </div>

          <div
            className={`reveal-card ${isHolding ? 'revealed' : ''}`}
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
          >
            {isHolding ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '3rem' }}>
                  {currentPlayer.role === 'mr_white' ? '🕵️' : '🔍'}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: currentPlayer.role === 'mr_white' ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                  {t(`role_${currentPlayer.role}` as any)}
                </div>
                {currentPlayer.role === 'mr_white' ? (
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-rose)' }}>
                    {t('no_word_warning')}
                  </div>
                ) : (
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fff' }}>
                    "{currentPlayer.secretWord}"
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Eye size={48} color="var(--accent-purple)" className="float-item" />
                <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{t('tap_and_hold')}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t('release_to_hide')}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (currentPassIndex + 1 < players.length) {
                setCurrentPassIndex(currentPassIndex + 1);
                setStage('pass_reveal');
              } else {
                proceedToDiscussion();
              }
            }}
            className="btn btn-emerald btn-large btn-full"
          >
            {t('done')}
          </button>
        </div>
      )}

      {/* 4. Discussion Phase */}
      {stage === 'discussion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('discussion_phase')}</h2>
            <CountdownTimer endsAt={discussionEndsAt} totalSeconds={localSettings.discussionTimeSeconds || 90} onTick={onTick} />
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-purple)' }}>
                💡 {t('tips_title')}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {t('tip_1')}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {t('tip_2')}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {t('tip_3')}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                🔄 {t('speaking_order')}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(speakingOrder.length > 0
                  ? speakingOrder.map((id) => players.find((p) => p.id === id)!).filter(Boolean)
                  : players.filter((p) => p.isAlive)
                ).map((p, idx) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid var(--accent-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                    }}
                  >
                    <span style={{ color: 'var(--accent-amber)', fontSize: '0.85rem' }}>#{idx + 1}</span>
                    <span>{p.avatar}</span>
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={proceedToVoting} className="btn btn-primary btn-large btn-full" style={{ marginTop: '10px' }}>
              🗳️ {t('vote_now')}
            </button>
          </div>
        </div>
      )}

      {/* 5. Elimination & Voting Phase */}
      {stage === 'elimination' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('voting_phase')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('discuss_and_select_eliminated')}</p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {players.filter((p) => p.isAlive).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setConfirmCandidate(p)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '14px', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '2.2rem' }}>{p.avatar}</span>
                  <span style={{ fontWeight: '700' }}>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Vote Ended in a Tie Button */}
            <button
              onClick={() => setIsTieAnnouncement(true)}
              className="btn btn-secondary"
              style={{ marginTop: '8px', padding: '12px', border: '1px dashed var(--accent-amber)', color: 'var(--accent-amber)' }}
            >
              {t('tie_button')}
            </button>
          </div>

          {/* Tie Announcement Modal */}
          {isTieAnnouncement && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 9999,
              }}
            >
              <div className="glass-panel modal-card" style={{ maxWidth: '380px', width: '100%', textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'var(--accent-amber)' }}>
                <div style={{ fontSize: '3rem' }}>⚖️</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--accent-amber)' }}>
                  {t('tie_vote_title')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('tie_vote_desc')}
                </p>

                <button
                  onClick={() => {
                    setIsTieAnnouncement(false);
                    proceedToDiscussion();
                  }}
                  className="btn btn-primary btn-large btn-full"
                >
                  {t('restart_discussion')}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Elimination Modal */}
          {confirmCandidate && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 9999,
              }}
            >
              <div className="glass-panel modal-card" style={{ maxWidth: '360px', width: '100%', textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '3rem' }}>{confirmCandidate.avatar}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{t('confirm_elimination_title')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {t('confirm_elimination_msg', { name: confirmCandidate.name })}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setConfirmCandidate(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                    {t('cancel')}
                  </button>
                  <button onClick={() => confirmEliminate(confirmCandidate)} className="btn btn-danger" style={{ flex: 1 }}>
                    {t('confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Civilian Eliminated Alert Modal */}
          {eliminatedAnnouncement && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 9999,
              }}
            >
              <div className="glass-panel modal-card" style={{ maxWidth: '380px', width: '100%', textAlign: 'center', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'var(--accent-amber)' }}>
                <div style={{ fontSize: '3rem' }}>⚠️</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--accent-amber)' }}>
                  {t('civilian_eliminated_alert')}
                </h3>
                <p style={{ color: '#fff', fontWeight: '600' }}>
                  {eliminatedAnnouncement.avatar} {eliminatedAnnouncement.name} ({t(`role_${eliminatedAnnouncement.role}` as any)})
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('civilian_eliminated_sub')}
                </p>

                <button
                  onClick={() => {
                    setEliminatedAnnouncement(null);
                    proceedToDiscussion();
                  }}
                  className="btn btn-emerald btn-large btn-full"
                >
                  ▶️ {t('continue_game')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Mr White Guess Stage */}
      {stage === 'mr_white_guess' && (
        <form onSubmit={handleMrWhiteGuessSubmit} className="glass-panel pulse-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'var(--accent-rose)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-rose)', textAlign: 'center' }}>
            {t('mr_white_guess_title')}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            {t('mr_white_guess_desc')}
          </p>

          <input
            type="text"
            className="input-field"
            value={mrWhiteGuess}
            onChange={(e) => setMrWhiteGuess(e.target.value)}
            placeholder={t('type_your_guess')}
            autoFocus
            style={{ fontSize: '1.2rem', textAlign: 'center', padding: '14px' }}
          />

          <button type="submit" disabled={!mrWhiteGuess.trim()} className="btn btn-danger btn-large btn-full">
            <Send size={20} />
            {t('submit_guess')}
          </button>
        </form>
      )}

      {/* 6. Game Over Stage */}
      {stage === 'game_over' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <Trophy size={60} color="var(--accent-amber)" className="float-item" />
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: winningTeam === 'civilian' ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}>
            {winningTeam === 'civilian' ? t('winner_civilians') : t('winner_mr_white')}
          </h1>
          {winningReasonKey && (
            <p style={{ color: 'var(--text-muted)' }}>
              {t(winningReasonKey as any, { word: secretWord })}
            </p>
          )}

          <div className="glass-panel">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('revealed_secret_word', { word: '' })}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>"{secretWord}"</div>
          </div>

          {/* Leaderboard & Stats Panel */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-amber)', textAlign: 'left' }}>
              {t('stats_title')}
            </div>

            {[...players]
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((p, idx) => {
                const isWinner = p.role === winningTeam;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isWinner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: isWinner ? '1px solid var(--accent-emerald)' : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', width: '28px' }}>{medal}</span>
                      <span style={{ fontSize: '1.8rem' }}>{p.avatar}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{p.name}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            color:
                              p.role === 'mr_white'
                                ? 'var(--accent-rose)'
                                : p.role === 'undercover'
                                ? 'var(--accent-amber)'
                                : 'var(--accent-cyan)',
                          }}
                        >
                          {t(`role_${p.role}` as any)}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-amber)' }}>
                        {p.score || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('score')}</span>
                      </div>
                      {isWinner && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                          +pts 🏆
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBackToHome} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('home')}
            </button>
            <button onClick={startLocalGame} className="btn btn-primary" style={{ flex: 2 }}>
              {t('play_again')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

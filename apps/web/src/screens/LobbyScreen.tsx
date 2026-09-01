import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { Copy, Check, Play, Settings as SettingsIcon, Users, UserCheck } from 'lucide-react';

interface LobbyScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onUpdateSettings: (settings: any) => void;
  onSetReady: (ready: boolean) => void;
  onStartGame: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  publicState,
  privateState,
  onUpdateSettings,
  onSetReady,
  onStartGame,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isHost = privateState.isHost;
  const players = publicState.players;
  const canStart = players.length >= 3;

  const copyCode = () => {
    navigator.clipboard.writeText(publicState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [editingProfile, setEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(privateState.name || '');
  const [tempAvatar, setTempAvatar] = useState(privateState.avatar || '🕵️');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
      {/* Room Code Card */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('room_code')}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '3px', color: 'var(--accent-cyan)' }}>
            {publicState.roomCode}
          </div>
        </div>

        <button onClick={copyCode} className="btn btn-secondary" style={{ padding: '10px 14px' }}>
          {copied ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} />}
          <span>{copied ? t('ready') : t('copy_code')}</span>
        </button>
      </div>

      {/* Players List Card */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
            <Users size={20} color="var(--accent-purple)" />
            <span>{t('players')} ({players.length})</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setTempName(privateState.name);
                setTempAvatar(privateState.avatar);
                setEditingProfile(!editingProfile);
              }}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              ✏️ {t('edit_name')}
            </button>

            {isHost && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              >
                <SettingsIcon size={16} />
                {t('settings')}
              </button>
            )}
          </div>
        </div>

        {/* Profile Editing Box */}
        {editingProfile && (
          <div
            style={{
              padding: '14px',
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '12px',
              border: '1px solid var(--accent-purple)',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{t('edit_player')}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  const avatarList = ['🕵️', '🦊', '🦉', '🐱', '🦁', '🐼', '🤖', '👑', '🧙', '👽', '🦄', '👻'];
                  const curIdx = avatarList.indexOf(tempAvatar);
                  setTempAvatar(avatarList[(curIdx + 1) % avatarList.length]);
                }}
                style={{
                  fontSize: '1.5rem',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-glass)',
                  cursor: 'pointer',
                }}
              >
                {tempAvatar}
              </button>
              <input
                type="text"
                className="input-field"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={t('enter_name')}
                maxLength={15}
                style={{ flex: 1, padding: '8px 12px' }}
              />
              <button
                onClick={() => {
                  if (tempName.trim()) {
                    onUpdateSettings({ name: tempName.trim(), avatar: tempAvatar });
                    setEditingProfile(false);
                  }
                }}
                className="btn btn-emerald"
                style={{ padding: '8px 14px' }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            overflowY: 'auto',
            maxHeight: '300px',
            paddingRight: '4px',
          }}
        >
          {players.map((p) => {
            const isMe = p.id === privateState.id;
            return (
              <div
                key={p.id}
                style={{
                  background: isMe ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isMe ? '1px solid var(--accent-purple)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '1.8rem' }}>{p.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name} {isMe && `(${t('you')})`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.isHost ? `👑 ${t('host')}` : p.isReady ? `✅ ${t('ready')}` : `⏳ ${t('not_ready')}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Host Settings Dropdown */}
        {showSettings && isHost && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '14px',
              border: '1px solid var(--accent-purple)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              ⚙️ {t('settings')}
            </div>

            {/* Number of Mister Whites */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>🕵️ {t('mr_white_count')}:</label>
              <select
                className="input-field"
                style={{ width: '90px', padding: '8px', textAlign: 'center' }}
                value={publicState.settings.mrWhiteCount}
                onChange={(e) => onUpdateSettings({ mrWhiteCount: Number(e.target.value) })}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            {/* Number of Undercovers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>🎭 {t('undercover_count')}:</label>
              <select
                className="input-field"
                style={{ width: '90px', padding: '8px', textAlign: 'center' }}
                value={publicState.settings.undercoverCount}
                onChange={(e) => onUpdateSettings({ undercoverCount: Number(e.target.value) })}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            {/* Discussion Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>⏱️ {t('discussion_time')}:</label>
              <select
                className="input-field"
                style={{ width: '90px', padding: '8px', textAlign: 'center' }}
                value={publicState.settings.discussionTimeSeconds}
                onChange={(e) => onUpdateSettings({ discussionTimeSeconds: Number(e.target.value) })}
              >
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={90}>90s</option>
                <option value={120}>120s</option>
                <option value={180}>180s</option>
              </select>
            </div>

            {/* Voting Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>🗳️ {t('voting_time')}:</label>
              <select
                className="input-field"
                style={{ width: '90px', padding: '8px', textAlign: 'center' }}
                value={publicState.settings.votingTimeSeconds}
                onChange={(e) => onUpdateSettings({ votingTimeSeconds: Number(e.target.value) })}
              >
                <option value={20}>20s</option>
                <option value={30}>30s</option>
                <option value={45}>45s</option>
                <option value={60}>60s</option>
              </select>
            </div>

            {/* Word Categories Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                  📂 {t('categories')} ({(publicState.settings.categories || []).length === 0 ? t('cat_all') : `${publicState.settings.categories.length}/29`})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentCats = publicState.settings.categories || [];
                    if (currentCats.length === 0) {
                      // Deselect all -> select only fruits
                      onUpdateSettings({ categories: ['fruits'] });
                    } else {
                      // Select all (empty array means all)
                      onUpdateSettings({ categories: [] });
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
                  {(publicState.settings.categories || []).length === 0 ? 'Deselect All' : t('cat_all')}
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
                  const currentCats = publicState.settings.categories || [];
                  const isSelected = currentCats.length === 0 || currentCats.includes(cat.id);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        let updated: string[];
                        if (currentCats.length === 0) {
                          // Currently all selected, toggle this one off
                          const allIds = [
                            'fruits', 'vegetables', 'cars', 'food', 'drinks', 'desserts',
                            'brands', 'flags', 'footballers', 'headcoaches', 'football_clubs',
                            'anime_heroes', 'cities_countries', 'animals', 'technology', 'sports',
                            'music', 'clothing', 'furniture', 'professions', 'nature', 'movies',
                            'videogames', 'school', 'art', 'landmarks', 'transport', 'social_media', 'accessories'
                          ];
                          updated = allIds.filter((c) => c !== cat.id);
                        } else if (currentCats.includes(cat.id)) {
                          updated = currentCats.filter((c) => c !== cat.id);
                          if (updated.length === 0) updated = ['fruits']; // keep at least 1
                        } else {
                          updated = [...currentCats, cat.id];
                        }
                        onUpdateSettings({ categories: updated });
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
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
      </div>

      {/* Action Footer */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        {isHost ? (
          <div>
            {!canStart && (
              <p style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '10px' }}>
                ⚠️ {t('min_players_warning')}
              </p>
            )}
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="btn btn-primary btn-large btn-full"
            >
              <Play size={22} />
              {t('start_game')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSetReady(!privateState.isReady)}
            className={`btn ${privateState.isReady ? 'btn-emerald' : 'btn-secondary'} btn-large btn-full`}
          >
            <UserCheck size={22} />
            {privateState.isReady ? t('ready') : t('not_ready')}
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { AvatarPicker } from '../components/AvatarPicker';
import { PlusCircle, LogIn, Users, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  onCreateOnline: (name: string, avatar: string) => void;
  onJoinOnline: (code: string, name: string, avatar: string) => void;
  onStartLocal: (name: string, avatar: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateOnline,
  onJoinOnline,
  onStartLocal,
}) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('mw_player_name') || `Player_${Math.floor(Math.random() * 899 + 100)}`
  );
  const [avatar, setAvatar] = useState('🕵️');
  const [roomCode, setRoomCode] = useState('');

  const saveName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('mw_player_name', name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
      {/* Hero Brand Section */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '4px' }} className="float-item">
          🕵️
        </div>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #f8fafc, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('app_title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          {t('app_subtitle')}
        </p>
      </div>

      {mode === 'menu' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={() => setMode('create')}
            className="btn btn-primary btn-large btn-full"
          >
            <PlusCircle size={22} />
            {t('create_game')}
          </button>

          <button
            onClick={() => setMode('join')}
            className="btn btn-secondary btn-large btn-full"
          >
            <LogIn size={22} />
            {t('join_game')}
          </button>

          <button
            onClick={() => onStartLocal(playerName, avatar)}
            className="btn btn-emerald btn-large btn-full"
          >
            <Users size={22} />
            {t('pass_and_play')}
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{t('create_game')}</h2>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('enter_name')}
            </label>
            <input
              type="text"
              className="input-field"
              value={playerName}
              onChange={(e) => saveName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={15}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('select_avatar')}
            </label>
            <AvatarPicker selectedAvatar={avatar} onSelect={setAvatar} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => setMode('menu')} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('back')}
            </button>
            <button
              onClick={() => onCreateOnline(playerName, avatar)}
              disabled={!playerName.trim()}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <Sparkles size={18} />
              {t('start_game')}
            </button>
          </div>
        </div>
      )}

      {mode === 'join' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{t('join_game')}</h2>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('enter_room_code')}
            </label>
            <input
              type="text"
              className="input-field"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. WHT888"
              maxLength={8}
              style={{ textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800', textAlign: 'center', fontSize: '1.3rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('enter_name')}
            </label>
            <input
              type="text"
              className="input-field"
              value={playerName}
              onChange={(e) => saveName(e.target.value)}
              placeholder="e.g. Sam"
              maxLength={15}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('select_avatar')}
            </label>
            <AvatarPicker selectedAvatar={avatar} onSelect={setAvatar} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button onClick={() => setMode('menu')} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('back')}
            </button>
            <button
              onClick={() => onJoinOnline(roomCode, playerName, avatar)}
              disabled={!roomCode.trim() || !playerName.trim()}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <LogIn size={18} />
              {t('join_game')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

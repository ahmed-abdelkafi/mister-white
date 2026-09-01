import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { Globe, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { Language } from '@mister-white/i18n';

interface HeaderProps {
  roomCode?: string | null;
  onLeave?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  onLeave,
  soundEnabled = true,
  onToggleSound,
}) => {
  const { lang, setLanguage, t, isRTL } = useI18n();

  return (
    <header className="app-header">
      <div className="logo-badge">
        <span style={{ fontSize: '1.4rem' }}>🕵️</span>
        <span>{t('app_title')}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language selector */}
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="en" style={{ background: '#0f172a' }}>EN</option>
          <option value="fr" style={{ background: '#0f172a' }}>FR</option>
          <option value="ar" style={{ background: '#0f172a' }}>العربية</option>
        </select>

        {onToggleSound && (
          <button
            onClick={onToggleSound}
            className="btn btn-secondary"
            style={{ padding: '8px', borderRadius: '8px' }}
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}
      </div>
    </header>
  );
};

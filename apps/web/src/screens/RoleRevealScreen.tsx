import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { PlayerPrivate } from '@mister-white/shared';
import { Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import { CountdownTimer } from '../components/CountdownTimer';

interface RoleRevealScreenProps {
  privateState: PlayerPrivate;
  endsAt: number | null;
  onReady: () => void;
  onTick?: (isUrgent: boolean) => void;
}

export const RoleRevealScreen: React.FC<RoleRevealScreenProps> = ({
  privateState,
  endsAt,
  onReady,
  onTick,
}) => {
  const { t } = useI18n();
  const [isHolding, setIsHolding] = useState(false);

  const role = privateState.role;
  const isMrWhite = role === 'mr_white';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('secret_word')}</h2>
        <CountdownTimer endsAt={endsAt} totalSeconds={15} onTick={onTick} onExpire={onReady} />
      </div>

      {/* Tap and hold Card */}
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
              {isMrWhite ? '🕵️' : '🔍'}
            </div>

            {isMrWhite ? (
              <>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: 'var(--accent-rose)',
                  }}
                >
                  {t('role_mr_white')}
                </div>

                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '900',
                    padding: '12px 18px',
                    background: 'rgba(244, 63, 94, 0.2)',
                    borderRadius: '12px',
                    border: '1px solid var(--accent-rose)',
                    color: '#fff',
                  }}
                >
                  ❓ {t('no_word_warning')}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '6px' }}>
                  {t('role_mr_white_desc')}
                </p>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    padding: '12px 24px',
                    background: 'rgba(139, 92, 246, 0.25)',
                    borderRadius: '14px',
                    border: '1px solid var(--accent-purple)',
                    color: '#fff',
                    letterSpacing: '1px',
                  }}
                >
                  "{privateState.secretWord}"
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', marginTop: '6px' }}>
                  {t('role_civilian_desc')}
                </p>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <Eye size={48} color="var(--accent-purple)" className="float-item" />
            <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>{t('tap_and_hold')}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t('release_to_hide')}</div>
          </div>
        )}
      </div>

      <button onClick={onReady} className="btn btn-emerald btn-large btn-full">
        <ShieldCheck size={20} />
        {t('understood_ready')}
      </button>
    </div>
  );
};

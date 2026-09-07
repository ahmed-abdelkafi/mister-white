import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

interface GameOverScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onPlayAgain: () => void;
  onLeave: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  publicState,
  privateState,
  onPlayAgain,
  onLeave,
}) => {
  const { t } = useI18n();
  const isHost = privateState.isHost;
  const winningTeam = publicState.winningTeam;

  const winnerTitle =
    winningTeam === 'civilian'
      ? t('winner_civilians')
      : winningTeam === 'mr_white'
      ? t('winner_mr_white')
      : t('winner_undercover');

  const getWinningReason = () => {
    if (winningTeam === 'civilian') return t('reason_civilians_win');
    if (winningTeam === 'mr_white') {
      if (publicState.revealedWord) return t('reason_mr_white_guess_win', { word: publicState.revealedWord });
      return t('reason_mr_white_survived');
    }
    if (winningTeam === 'undercover') return t('reason_undercover_survived');
    return publicState.winningReason;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      {/* Winner Hero Banner */}
      <div style={{ textAlign: 'center' }}>
        <Trophy size={64} color="var(--accent-amber)" className="float-item" />
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '900',
            marginTop: '8px',
            color: winningTeam === 'civilian' ? 'var(--accent-cyan)' : 'var(--accent-rose)',
          }}
        >
          {winnerTitle}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          {getWinningReason()}
        </p>
      </div>

      {/* Secret Word Revealed */}
      {publicState.revealedWord && (
        <div
          className="glass-panel pulse-glow"
          style={{
            textAlign: 'center',
            padding: '16px',
            borderColor: 'var(--accent-purple)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              🔍 {t('civilian_word')}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              "{publicState.revealedWord}"
            </div>
          </div>

          {publicState.revealedUndercoverWord && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)' }}>
                🎭 {t('undercover_word')}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-amber)', marginTop: '2px' }}>
                "{publicState.revealedUndercoverWord}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revealed Roles & Statistics Leaderboard */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '1rem', color: 'var(--accent-amber)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {t('stats_title')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...publicState.players]
            .sort((a, b) => b.score - a.score)
            .map((p, idx) => {
              const role = publicState.revealedRoles ? publicState.revealedRoles[p.id] : null;
              const isWinner = role === winningTeam;
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
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{p.name}</div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          color:
                            role === 'mr_white'
                              ? 'var(--accent-rose)'
                              : role === 'undercover'
                              ? 'var(--accent-amber)'
                              : 'var(--accent-cyan)',
                        }}
                      >
                        {role ? t(`role_${role}` as any) : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-amber)' }}>
                      {p.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('score')}</span>
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
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onLeave} className="btn btn-secondary" style={{ flex: 1 }}>
          <Home size={18} />
          {t('leave_game')}
        </button>

        {isHost && (
          <button onClick={onPlayAgain} className="btn btn-primary" style={{ flex: 2 }}>
            <RotateCcw size={18} />
            {t('play_again')}
          </button>
        )}
      </div>
    </div>
  );
};

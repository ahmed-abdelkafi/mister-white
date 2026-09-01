import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { CountdownTimer } from '../components/CountdownTimer';
import { Vote, CheckCircle2, ShieldX } from 'lucide-react';

interface VotingScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onSubmitVote: (targetId: string) => void;
  onTick?: (isUrgent: boolean) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  publicState,
  privateState,
  onSubmitVote,
  onTick,
}) => {
  const { t } = useI18n();
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const isAlive = privateState.isAlive;
  const hasVoted = privateState.hasVoted;
  const alivePlayers = publicState.players.filter((p) => p.isAlive);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleVote = () => {
    if (selectedTargetId) {
      setShowConfirm(true);
    }
  };

  const confirmAndSubmit = () => {
    if (selectedTargetId) {
      onSubmitVote(selectedTargetId);
      setShowConfirm(false);
    }
  };

  const selectedPlayer = publicState.players.find((p) => p.id === selectedTargetId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('voting_phase')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          {t('voting_desc')}
        </p>
        <CountdownTimer
          endsAt={publicState.phaseEndsAt}
          totalSeconds={publicState.settings.votingTimeSeconds}
          onTick={onTick}
        />
      </div>

      {!isAlive ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '24px' }}>
          <ShieldX size={48} color="var(--accent-rose)" />
          <h3 style={{ marginTop: '8px' }}>{t('you_are_eliminated')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('spectating_desc')}
          </p>
        </div>
      ) : hasVoted ? (
        <div className="glass-panel pulse-glow" style={{ textAlign: 'center', padding: '30px' }}>
          <CheckCircle2 size={54} color="var(--accent-emerald)" />
          <h3 style={{ marginTop: '12px', fontSize: '1.25rem' }}>{t('vote_submitted')}</h3>
        </div>
      ) : (
        <>
          {/* Target Selection Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {alivePlayers.map((p) => {
              const isMe = p.id === privateState.id;
              const isSelected = selectedTargetId === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={isMe}
                  onClick={() => setSelectedTargetId(p.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    borderRadius: '16px',
                    background: isSelected
                      ? 'rgba(244, 63, 94, 0.25)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected
                      ? '2px solid var(--accent-rose)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: isMe ? 'not-allowed' : 'pointer',
                    opacity: isMe ? 0.4 : 1,
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{p.avatar}</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {p.name} {isMe && `(${t('you')})`}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleVote}
            disabled={!selectedTargetId}
            className="btn btn-danger btn-large btn-full"
            style={{ marginTop: '8px' }}
          >
            <Vote size={22} />
            {t('vote_for', {
              name: selectedPlayer?.name || '',
            })}
          </button>

          {/* Confirm Vote Modal */}
          {showConfirm && selectedPlayer && (
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
                <div style={{ fontSize: '3rem' }}>{selectedPlayer.avatar}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{t('confirm_elimination_title')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {t('confirm_elimination_msg', { name: selectedPlayer.name })}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowConfirm(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    {t('cancel')}
                  </button>
                  <button onClick={confirmAndSubmit} className="btn btn-danger" style={{ flex: 1 }}>
                    {t('confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

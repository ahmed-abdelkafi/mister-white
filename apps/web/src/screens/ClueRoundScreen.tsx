import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { CountdownTimer } from '../components/CountdownTimer';
import { Mic, CheckCircle, MessageSquare } from 'lucide-react';

interface ClueRoundScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onDoneTurn: () => void;
  onTick?: (isUrgent: boolean) => void;
}

export const ClueRoundScreen: React.FC<ClueRoundScreenProps> = ({
  publicState,
  privateState,
  onDoneTurn,
  onTick,
}) => {
  const { t } = useI18n();

  const currentSpeaker = publicState.players.find((p) => p.id === publicState.currentTurnPlayerId);
  const isMyTurn = publicState.currentTurnPlayerId === privateState.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase' }}>
          {t('round')} {publicState.roundNumber}
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{t('clue_round')}</h2>
        <CountdownTimer endsAt={publicState.phaseEndsAt} totalSeconds={45} onTick={onTick} />
      </div>

      {/* Active speaker spotlight */}
      <div
        className="glass-panel pulse-glow"
        style={{
          textAlign: 'center',
          padding: '24px',
          borderColor: isMyTurn ? 'var(--accent-emerald)' : 'var(--border-glass)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '8px' }}>
          {currentSpeaker?.avatar || '👤'}
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: isMyTurn ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
          {isMyTurn ? t('your_turn_clue') : t('turn_of', { name: currentSpeaker?.name || 'Player' })}
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
          {t('clue_give_instruction')}
        </p>

        {isMyTurn && (
          <button
            onClick={onDoneTurn}
            className="btn btn-emerald btn-large"
            style={{ marginTop: '18px', width: '100%' }}
          >
            <CheckCircle size={20} />
            {t('done_turn')}
          </button>
        )}
      </div>

      {/* Turn Order Grid */}
      <div className="glass-panel" style={{ padding: '14px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {t('turn_sequence')}
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {publicState.turnOrder.map((pid, idx) => {
            const player = publicState.players.find((p) => p.id === pid);
            const isCurrent = pid === publicState.currentTurnPlayerId;
            const isPast = idx < publicState.turnIndex;

            return (
              <div
                key={pid}
                style={{
                  minWidth: '54px',
                  padding: '6px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  background: isCurrent ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isCurrent ? '2px solid var(--accent-cyan)' : '1px solid transparent',
                  opacity: isPast ? 0.4 : 1,
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>{player?.avatar || '👤'}</div>
                <div style={{ fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {player?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

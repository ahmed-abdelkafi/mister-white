import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { CountdownTimer } from '../components/CountdownTimer';
import { MessagesSquare, Vote, AlertTriangle } from 'lucide-react';

interface DiscussionScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onProceedToVoting: () => void;
  onTick?: (isUrgent: boolean) => void;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  publicState,
  privateState,
  onProceedToVoting,
  onTick,
}) => {
  const { t } = useI18n();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MessagesSquare color="var(--accent-purple)" size={24} />
          {t('discussion_phase')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          {t('discussion_desc')}
        </p>
        <CountdownTimer
          endsAt={publicState.phaseEndsAt}
          totalSeconds={publicState.settings.discussionTimeSeconds}
          onTick={onTick}
        />
      </div>

      {/* Strategy Card */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle color="var(--accent-amber)" size={22} />
          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t('tips_title')}</div>
        </div>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>{t('tip_1')}</li>
          <li>{t('tip_2')}</li>
          <li>{t('tip_3')}</li>
        </ul>
      </div>

      {/* Proceed to vote CTA */}
      <button onClick={onProceedToVoting} className="btn btn-primary btn-large btn-full">
        <Vote size={22} />
        {t('call_early_vote')}
      </button>
    </div>
  );
};

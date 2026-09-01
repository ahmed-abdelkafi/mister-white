import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic } from '@mister-white/shared';
import { Skull, Award } from 'lucide-react';

interface VoteTallyScreenProps {
  publicState: GameStatePublic;
}

export const VoteTallyScreen: React.FC<VoteTallyScreenProps> = ({ publicState }) => {
  const { t } = useI18n();
  const tallies = publicState.voteTallies;
  const eliminated = publicState.players.find((p) => p.id === publicState.eliminatedPlayerId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{t('vote_results')}</h2>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {tallies.map((tally) => (
          <div key={tally.targetId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <span style={{ fontSize: '1.5rem' }}>{tally.targetAvatar}</span>
                <span>{tally.targetName}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-rose)', fontWeight: '800' }}>
                {t('votes_count', { count: tally.count })}
              </div>
            </div>

            {/* Vote bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (tally.count / (publicState.players.length || 1)) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-rose))',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {eliminated && (
        <div
          className="glass-panel pulse-glow"
          style={{
            textAlign: 'center',
            padding: '24px',
            borderColor: 'var(--accent-rose)',
            background: 'rgba(244, 63, 94, 0.1)',
          }}
        >
          <Skull size={48} color="var(--accent-rose)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginTop: '8px', color: 'var(--accent-rose)' }}>
            {t('player_eliminated', { name: eliminated.name })}
          </h3>
        </div>
      )}
    </div>
  );
};

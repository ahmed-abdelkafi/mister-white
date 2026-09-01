import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic } from '@mister-white/shared';
import { CountdownTimer } from '../components/CountdownTimer';
import { Swords, RotateCcw } from 'lucide-react';

interface SuddenDeathScreenProps {
  publicState: GameStatePublic;
  onTick?: (isUrgent: boolean) => void;
}

export const SuddenDeathScreen: React.FC<SuddenDeathScreenProps> = ({ publicState, onTick }) => {
  const { t } = useI18n();
  const tiedPlayers = publicState.players.filter((p) => publicState.tiedPlayerIds.includes(p.id));
  const tiedNames = tiedPlayers.map((p) => p.name).join(' & ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Swords size={48} color="var(--accent-amber)" className="float-item" />
        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-amber)', marginTop: '8px' }}>
          {t('sudden_death_tie')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
          {t('tie_desc', { names: tiedNames })}
        </p>
        <CountdownTimer endsAt={publicState.phaseEndsAt} totalSeconds={30} onTick={onTick} />
      </div>

      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {tiedPlayers.map((p) => (
          <div
            key={p.id}
            style={{
              padding: '16px',
              textAlign: 'center',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid var(--accent-amber)',
            }}
          >
            <div style={{ fontSize: '2.5rem' }}>{p.avatar}</div>
            <div style={{ fontWeight: '800', marginTop: '4px' }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

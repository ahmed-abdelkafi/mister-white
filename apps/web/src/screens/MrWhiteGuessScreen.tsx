import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { GameStatePublic, PlayerPrivate } from '@mister-white/shared';
import { CountdownTimer } from '../components/CountdownTimer';
import { HelpCircle, Send, AlertOctagon } from 'lucide-react';

interface MrWhiteGuessScreenProps {
  publicState: GameStatePublic;
  privateState: PlayerPrivate;
  onSubmitGuess: (word: string) => void;
  onTick?: (isUrgent: boolean) => void;
}

export const MrWhiteGuessScreen: React.FC<MrWhiteGuessScreenProps> = ({
  publicState,
  privateState,
  onSubmitGuess,
  onTick,
}) => {
  const { t } = useI18n();
  const [guess, setGuess] = useState('');
  const isEliminatedMrWhite = publicState.eliminatedPlayerId === privateState.id;

  // Ensure input is always empty whenever entering this phase or round
  React.useEffect(() => {
    setGuess('');
  }, [publicState.phase, publicState.roundNumber, publicState.eliminatedPlayerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      const submitted = guess.trim();
      setGuess('');
      onSubmitGuess(submitted);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertOctagon size={54} color="var(--accent-rose)" className="float-item" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-rose)', marginTop: '8px' }}>
          {t('mr_white_guess_title')}
        </h2>
        <CountdownTimer endsAt={publicState.phaseEndsAt} totalSeconds={30} onTick={onTick} />
      </div>

      {isEliminatedMrWhite ? (
        <form onSubmit={handleSubmit} className="glass-panel pulse-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'var(--accent-rose)' }}>
          <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600' }}>
            {t('mr_white_guess_desc')}
          </p>

          <input
            type="text"
            className="input-field"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('type_your_guess')}
            autoFocus
            style={{ fontSize: '1.2rem', textAlign: 'center', padding: '16px', borderColor: 'var(--accent-rose)' }}
          />

          <button
            type="submit"
            disabled={!guess.trim()}
            className="btn btn-danger btn-large btn-full"
          >
            <Send size={20} />
            {t('submit_guess')}
          </button>
        </form>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '30px' }}>
          <HelpCircle size={48} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.25rem', marginTop: '12px' }}>
            {t('typing_guess_title')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            {t('typing_guess_desc')}
          </p>
        </div>
      )}
    </div>
  );
};

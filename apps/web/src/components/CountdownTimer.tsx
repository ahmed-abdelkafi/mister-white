import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endsAt: number | null;
  totalSeconds?: number;
  onTick?: (isUrgent: boolean) => void;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endsAt,
  totalSeconds = 60,
  onTick,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!endsAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0 && onTick) {
        onTick(true);
      } else if (remaining % 5 === 0 && remaining > 0 && onTick) {
        onTick(false);
      }

      if (remaining === 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    const initial = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    setTimeLeft(initial);

    return () => clearInterval(interval);
  }, [endsAt, onTick, onExpire]);

  if (!endsAt) return null;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, timeLeft / totalSeconds));
  const strokeDashoffset = circumference - progress * circumference;
  const isUrgent = timeLeft <= 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
      <div style={{ position: 'relative', width: '96px', height: '96px' }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke={isUrgent ? 'var(--accent-rose)' : 'var(--accent-cyan)'}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: '900',
            color: isUrgent ? 'var(--accent-rose)' : 'var(--text-main)',
            animation: isUrgent ? 'pulseGlow 1s infinite' : 'none',
          }}
        >
          {timeLeft}s
        </div>
      </div>
    </div>
  );
};

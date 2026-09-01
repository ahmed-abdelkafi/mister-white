import React from 'react';
import { AVATARS } from '@mister-white/shared';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelect }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        margin: '12px 0',
      }}
    >
      {AVATARS.map((emoji) => {
        const isSelected = emoji === selectedAvatar;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            style={{
              fontSize: '1.8rem',
              padding: '10px',
              borderRadius: '12px',
              background: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: isSelected ? '2px solid var(--accent-purple)' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.15s ease',
            }}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
};

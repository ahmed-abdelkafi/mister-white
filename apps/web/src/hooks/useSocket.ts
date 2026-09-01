import { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatePublic, PlayerPrivate, Language } from '@mister-white/shared';

interface UseSocketProps {
  roomCode: string | null;
  playerId: string;
  playerName: string;
  avatar: string;
  language: Language;
  isHost: boolean;
  workerUrl?: string;
}

export function useSocket({
  roomCode,
  playerId,
  playerName,
  avatar,
  language,
  isHost,
  workerUrl = (import.meta as any).env?.VITE_WORKER_URL || window.location.origin,
}: UseSocketProps) {
  const [publicState, setPublicState] = useState<GameStatePublic | null>(null);
  const [privateState, setPrivateState] = useState<PlayerPrivate | null>(null);
  const [connected, setConnected] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    // Build WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = workerUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/api/room/${roomCode}/ws?playerId=${playerId}&roomCode=${roomCode}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Send join or create message
      ws.send(
        JSON.stringify({
          type: 'room:join_or_create',
          payload: { name: playerName, avatar, isHost, language },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'sync:state') {
          setPublicState(data.payload.publicState);
          setPrivateState(data.payload.privateState);
        } else if (data.type === 'game:notification') {
          setNotification(data.payload);
          setTimeout(() => setNotification(null), 4000);
        }
      } catch (e) {}
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomCode, playerId, playerName, avatar, language, isHost, workerUrl]);

  const send = useCallback((type: string, payload?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  return {
    publicState,
    privateState,
    connected,
    notification,
    send,
    setPublicState,
    setPrivateState,
  };
}

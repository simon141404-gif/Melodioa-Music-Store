'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Song, QueueItem, RepeatMode } from '@/types';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: QueueItem[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isExpanded: boolean;
  isLoading: boolean;
  
  playSong: (song: Song) => void;
  playSongs: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => void;
  toggleExpand: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shuffleIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();
    const onLoadStart = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleEnded = useCallback(() => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    
    if (queueIndex < queue.length - 1) {
      playFromQueue(queueIndex + 1);
    } else if (repeat === 'all' && queue.length > 0) {
      playFromQueue(0);
    } else {
      setIsPlaying(false);
    }
  }, [queueIndex, queue, repeat]);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    
    if (audioRef.current) {
      // Use a sample audio file for demo
      audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
    
    // Record stream
    fetch('/api/streams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId: song.id }),
    }).catch(console.error);
  }, []);

  const playSongs = useCallback((songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    
    let newQueue: QueueItem[];
    let newIndex: number;
    
    if (shuffle) {
      newQueue = [...songs].sort(() => Math.random() - 0.5).map((song, i) => ({
        song,
        addedAt: Date.now() + i,
      }));
      newIndex = 0;
      shuffleIndicesRef.current = [startIndex];
    } else {
      newQueue = songs.map((song, i) => ({
        song,
        addedAt: Date.now() + i,
      }));
      newIndex = startIndex;
    }
    
    setQueue(newQueue);
    setQueueIndex(newIndex);
    playSong(newQueue[newIndex].song);
  }, [shuffle, playSong]);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [currentSong, isPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [currentSong]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex: number;
    if (shuffle) {
      const availableIndices = shuffleIndicesRef.current.filter(i => i !== queueIndex);
      if (availableIndices.length === 0) {
        shuffleIndicesRef.current = Array.from({ length: queue.length }, (_, i) => i);
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
      shuffleIndicesRef.current = shuffleIndicesRef.current.filter(i => i !== queueIndex);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }
    
    playFromQueue(nextIndex);
  }, [queue, queueIndex, shuffle]);

  const previous = useCallback(() => {
    if (queue.length === 0) return;
    
    if (currentTime > 3) {
      seek(0);
      return;
    }
    
    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    playFromQueue(prevIndex);
  }, [queue, queueIndex, currentTime]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, { song, addedAt: Date.now() }]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    } else if (index === queueIndex) {
      if (queue.length > 1) {
        playFromQueue(index === queue.length - 1 ? 0 : index);
      } else {
        setCurrentSong(null);
        setIsPlaying(false);
      }
    }
  }, [queueIndex, queue.length]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(-1);
  }, []);

  const playFromQueue = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setQueueIndex(index);
      playSong(queue[index].song);
    }
  }, [queue, playSong]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex,
        shuffle,
        repeat,
        isExpanded,
        isLoading,
        playSong,
        playSongs,
        togglePlay,
        pause,
        play,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playFromQueue,
        toggleExpand,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

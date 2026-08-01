'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/types';
import styles from './SongCard.module.css';

interface SongCardProps {
  song: Song;
  index?: number;
  onPlay?: () => void;
}

export default function SongCard({ song, index, onPlay }: SongCardProps) {
  const { playSong, playSongs, currentSong, isPlaying } = usePlayer();
  
  const isCurrentSong = currentSong?.id === song.id;
  const isThisPlaying = isCurrentSong && isPlaying;

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      playSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${styles.card} ${isCurrentSong ? styles.playing : ''}`}>
      <div className={styles.index}>
        {isThisPlaying ? (
          <div className={styles.playingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            {index !== undefined && <span className={styles.indexNum}>{index + 1}</span>}
            <button className={styles.playBtn} onClick={handlePlay}>
              <Play size={14} fill="currentColor" />
            </button>
          </>
        )}
      </div>
      
      <div className={styles.artwork}>
        <Image
          src={song.album?.coverUrl || '/placeholder-album.jpg'}
          alt={song.title}
          width={48}
          height={48}
          className={styles.artworkImage}
        />
        {isThisPlaying && (
          <div className={styles.artworkOverlay}>
            <Pause size={20} />
          </div>
        )}
      </div>
      
      <div className={styles.info}>
        <span className={styles.title}>{song.title}</span>
        <span className={styles.artist}>{song.artist?.name || 'Unknown Artist'}</span>
      </div>
      
      <div className={styles.album}>
        <span>{song.album?.title}</span>
      </div>
      
      <button className={styles.likeBtn}>
        <Heart size={16} fill={song.isLiked ? '#ef4444' : 'none'} />
      </button>
      
      <span className={styles.duration}>
        <Clock size={14} />
        {formatDuration(song.duration)}
      </span>
      
      <button className={styles.moreBtn}>
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

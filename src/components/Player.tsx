'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  ListMusic,
  Mic2,
  Maximize2,
  Minimize2,
  Heart,
  Plus,
  Download,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Player.module.css';

export default function Player() {
  const {
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
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    toggleExpand,
  } = usePlayer();

  const { user } = useAuth();
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentSong) {
      fetch(`/api/songs/${currentSong.id}/like`, { method: 'HEAD' })
        .then(res => setIsLiked(res.ok))
        .catch(() => setIsLiked(false));
    }
  }, [currentSong]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.8);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = async () => {
    if (!currentSong || !user) return;
    
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/songs/${currentSong.id}/like`, { method });
      if (res.ok) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleAddToQueue = () => {
    if (currentSong) {
      addToQueue(currentSong);
    }
  };

  const VolumeIcon = volume === 0 || isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  if (!currentSong) {
    return (
      <div className={styles.player}>
        <div className={styles.emptyPlayer}>
          <span>Select a song to play</span>
        </div>
      </div>
    );
  }

  if (isExpanded) {
    return (
      <div className={styles.expandedPlayer}>
        <div className={styles.expandedContent}>
          <button className={styles.collapseBtn} onClick={toggleExpand}>
            <Minimize2 size={24} />
          </button>
          
          <div className={styles.expandedMain}>
            <div className={styles.expandedArtwork}>
              <Image
                src={currentSong.album?.coverUrl || '/placeholder-album.jpg'}
                alt={currentSong.title}
                width={400}
                height={400}
                className={styles.artworkImage}
              />
              <div className={styles.playingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            
            <div className={styles.expandedInfo}>
              <h2 className={styles.expandedTitle}>{currentSong.title}</h2>
              <p className={styles.expandedArtist}>{currentSong.artist?.name || 'Unknown Artist'}</p>
              
              <div className={styles.expandedProgress}>
                <div
                  ref={progressRef}
                  className={styles.progressBar}
                  onClick={handleProgressClick}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                  <div
                    className={styles.progressHandle}
                    style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
                <div className={styles.timeDisplay}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className={styles.expandedControls}>
                <button
                  className={`${styles.controlBtn} ${shuffle ? styles.active : ''}`}
                  onClick={toggleShuffle}
                >
                  <Shuffle size={20} />
                </button>
                <button className={styles.controlBtn} onClick={previous}>
                  <SkipBack size={24} />
                </button>
                <button
                  className={styles.playBtn}
                  onClick={togglePlay}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.spinner} />
                  ) : isPlaying ? (
                    <Pause size={28} />
                  ) : (
                    <Play size={28} />
                  )}
                </button>
                <button className={styles.controlBtn} onClick={next}>
                  <SkipForward size={24} />
                </button>
                <button
                  className={`${styles.controlBtn} ${repeat !== 'off' ? styles.active : ''}`}
                  onClick={toggleRepeat}
                >
                  <RepeatIcon size={20} />
                </button>
              </div>
              
              <div className={styles.expandedActions}>
                <button
                  className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                  onClick={handleLike}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button className={styles.actionBtn} onClick={handleAddToQueue}>
                  <Plus size={20} />
                </button>
                <button className={styles.actionBtn}>
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      {/* Song Info */}
      <div className={styles.songInfo}>
        <div className={styles.artwork}>
          <Image
            src={currentSong.album?.coverUrl || '/placeholder-album.jpg'}
            alt={currentSong.title}
            width={56}
            height={56}
            className={styles.artworkImage}
          />
          {isPlaying && (
            <div className={styles.playingBars}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{currentSong.title}</span>
          <span className={styles.artist}>{currentSong.artist?.name || 'Unknown Artist'}</span>
        </div>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.mainControls}>
          <button
            className={`${styles.controlBtn} ${shuffle ? styles.active : ''}`}
            onClick={toggleShuffle}
          >
            <Shuffle size={16} />
          </button>
          <button className={styles.controlBtn} onClick={previous}>
            <SkipBack size={20} />
          </button>
          <button
            className={styles.playBtn}
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>
          <button className={styles.controlBtn} onClick={next}>
            <SkipForward size={20} />
          </button>
          <button
            className={`${styles.controlBtn} ${repeat !== 'off' ? styles.active : ''}`}
            onClick={toggleRepeat}
          >
            <RepeatIcon size={16} />
          </button>
        </div>
        
        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div
            ref={progressRef}
            className={styles.progressBar}
            onClick={handleProgressClick}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className={styles.extra}>
        <button className={styles.controlBtn}>
          <Mic2 size={18} />
        </button>
        <button className={styles.controlBtn}>
          <ListMusic size={18} />
        </button>
        
        <div
          className={styles.volumeControl}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button className={styles.controlBtn} onClick={toggleMute}>
            <VolumeIcon size={18} />
          </button>
          {showVolumeSlider && (
            <div className={styles.volumeSlider}>
              <div
                ref={volumeRef}
                className={styles.progressBar}
                onClick={handleVolumeClick}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <button className={styles.controlBtn} onClick={toggleExpand}>
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}

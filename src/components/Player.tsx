'use client';

import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
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
  Share2,
  X,
  ChevronUp,
  Clock,
  GripVertical,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Player.module.css';

// Memoized Visualizer component for performance
const Visualizer = memo(function Visualizer({ data, isPlaying }: { data: number[]; isPlaying: boolean }) {
  return (
    <div className={styles.visualizer}>
      {data.slice(0, 32).map((value, index) => (
        <div
          key={index}
          className={`${styles.visualizerBar} ${isPlaying ? styles.active : ''}`}
          style={{
            height: `${Math.max(4, value * 100)}%`,
            animationDelay: `${index * 20}ms`,
          }}
        />
      ))}
    </div>
  );
});

// Memoized Queue Item component
const QueueItem = memo(function QueueItem({
  item,
  index,
  isCurrent,
  onPlay,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  item: { song: any };
  index: number;
  isCurrent: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      className={`${styles.queueItem} ${isCurrent ? styles.currentQueueItem : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <GripVertical size={16} className={styles.dragHandle} />
      <div className={styles.queueItemArt}>
        <Image
          src={item.song.coverUrl || '/placeholder-album.jpg'}
          alt={item.song.title}
          width={48}
          height={48}
          className={styles.queueItemImage}
        />
        {isCurrent && <div className={styles.playingBars}><span></span><span></span><span></span></div>}
      </div>
      <div className={styles.queueItemInfo}>
        <span className={styles.queueItemTitle}>{item.song.title}</span>
        <span className={styles.queueItemArtist}>{item.song.artist?.name}</span>
      </div>
      <button className={styles.queueItemRemove} onClick={onRemove}>
        <X size={16} />
      </button>
    </div>
  );
});

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
    playbackSpeed,
    showLyrics,
    showQueue,
    visualizerData,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setPlaybackSpeed,
    addToQueue,
    removeFromQueue,
    toggleExpand,
    toggleLyrics,
    toggleQueue,
    moveQueueItem,
  } = usePlayer();

  const { user } = useAuth();
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);

  // Get lyrics for current song
  const lyrics = useMemo(() => {
    if (!currentSong?.lyrics) return null;
    return currentSong.lyrics;
  }, [currentSong?.lyrics]);

  // Find current lyric line
  const currentLyricIndex = useMemo(() => {
    if (!lyrics || !Array.isArray(lyrics)) return -1;
    return lyrics.findIndex((line: any, index: number) => {
      const nextLine = lyrics[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
  }, [lyrics, currentTime]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (lyricsRef.current && currentLyricIndex >= 0) {
      const lyricElements = lyricsRef.current.querySelectorAll(`.${styles.lyricLine}`);
      const currentElement = lyricElements[currentLyricIndex];
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex]);

  useEffect(() => {
    if (currentSong) {
      fetch(`/api/songs/${currentSong.id}/like`, { method: 'HEAD' })
        .then(res => {})
        .catch(() => {});
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

  const handleLyricClick = (time: number) => {
    seek(time);
  };

  const handleLike = async () => {
    if (!currentSong || !user) return;
    try {
      const method = 'POST';
      await fetch(`/api/songs/${currentSong.id}/like`, { method });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleAddToQueue = () => {
    if (currentSong) {
      addToQueue(currentSong);
    }
  };

  const handleShare = async () => {
    if (!currentSong) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setIsDragging(true);
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== -1 && dragIndex !== toIndex) {
      moveQueueItem(dragIndex, toIndex);
    }
    setIsDragging(false);
    setDragIndex(-1);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const VolumeIcon = volume === 0 || isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  // Extract dominant color from album art for gradient background
  const dominantColor = useMemo(() => {
    if (!currentSong?.album?.coverUrl) return '#1a1a1a';
    return '#1a1a1a';
  }, [currentSong?.album?.coverUrl]);

  if (!currentSong) {
    return (
      <div className={styles.player}>
        <div className={styles.emptyPlayer}>
          <span>Select a song to play</span>
        </div>
      </div>
    );
  }

  // Fullscreen Now Playing View
  if (isExpanded) {
    return (
      <div className={styles.expandedPlayer}>
        {/* Dynamic Background */}
        <div 
          className={styles.expandedBackground}
          style={{
            background: `linear-gradient(180deg, ${dominantColor} 0%, #000000 100%)`,
          }}
        >
          <div className={styles.backgroundBlur} />
        </div>

        <div className={styles.expandedContent}>
          {/* Header */}
          <div className={styles.expandedHeader}>
            <button className={styles.collapseBtn} onClick={toggleExpand}>
              <ChevronUp size={24} />
            </button>
            <span className={styles.nowPlayingLabel}>Now Playing</span>
            <button className={styles.collapseBtn} onClick={toggleQueue}>
              <ListMusic size={24} />
            </button>
          </div>

          {/* Main Content - Lyrics or Album Art */}
          <div className={styles.expandedMain}>
            {showLyrics ? (
              // Lyrics View
              <div className={styles.lyricsContainer} ref={lyricsRef}>
                {lyrics ? (
                  Array.isArray(lyrics) ? (
                    lyrics.map((line: any, index: number) => (
                      <div
                        key={index}
                        className={`${styles.lyricLine} ${index === currentLyricIndex ? styles.activeLyric : ''}`}
                        onClick={() => handleLyricClick(line.time)}
                      >
                        {line.text}
                      </div>
                    ))
                  ) : (
                    <div className={styles.lyricLine}>{lyrics}</div>
                  )
                ) : (
                  <div className={styles.noLyrics}>Lyrics are not available.</div>
                )}
              </div>
            ) : (
              // Album Art with Visualizer
              <div className={styles.expandedArtworkContainer}>
                <div className={styles.expandedArtwork}>
                  <Image
                    src={currentSong.album?.coverUrl || '/placeholder-album.jpg'}
                    alt={currentSong.title}
                    width={400}
                    height={400}
                    className={styles.artworkImage}
                    priority
                  />
                  {isPlaying && (
                    <div className={styles.playingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                <Visualizer data={visualizerData} isPlaying={isPlaying} />
              </div>
            )}
            
            {/* Queue Panel */}
            {showQueue && (
              <div className={styles.queuePanel}>
                <div className={styles.queueHeader}>
                  <h3>Queue</h3>
                  <button onClick={toggleQueue}><X size={20} /></button>
                </div>
                <div className={styles.queueList}>
                  <div className={styles.queueSection}>
                    <h4>NOW PLAYING</h4>
                    {queue[queueIndex] && (
                      <div className={`${styles.queueItem} ${styles.currentQueueItem}`}>
                        <div className={styles.queueItemArt}>
                          <Image
                            src={queue[queueIndex].song.coverUrl || '/placeholder-album.jpg'}
                            alt={queue[queueIndex].song.title}
                            width={40}
                            height={40}
                            className={styles.queueItemImage}
                          />
                          {isPlaying && <div className={styles.playingBars}><span></span><span></span><span></span></div>}
                        </div>
                        <div className={styles.queueItemInfo}>
                          <span className={styles.queueItemTitle}>{queue[queueIndex].song.title}</span>
                          <span className={styles.queueItemArtist}>{queue[queueIndex].song.artist?.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.queueSection}>
                    <h4>UP NEXT</h4>
                    {queue.slice(queueIndex + 1).map((item, idx) => (
                      <QueueItem
                        key={idx}
                        item={item}
                        index={queueIndex + 1 + idx}
                        isCurrent={false}
                        onPlay={() => {}}
                        onRemove={() => removeFromQueue(queueIndex + 1 + idx)}
                        onDragStart={(e) => handleDragStart(e, queueIndex + 1 + idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, queueIndex + 1 + idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className={styles.expandedInfo}>
            <div className={styles.songMeta}>
              <div className={styles.songText}>
                <h2 className={styles.expandedTitle}>{currentSong.title}</h2>
                <p className={styles.expandedArtist}>{currentSong.artist?.name}</p>
                <p className={styles.expandedAlbum}>{currentSong.album?.title}</p>
              </div>
              <div className={styles.songActions}>
                <button className={styles.actionBtn} onClick={handleLike}>
                  <Heart size={24} />
                </button>
                <button className={styles.actionBtn} onClick={handleAddToQueue}>
                  <Plus size={24} />
                </button>
                <button className={styles.actionBtn} onClick={handleShare}>
                  <Share2 size={24} />
                </button>
                <button className={styles.actionBtn}>
                  <Download size={24} />
                </button>
              </div>
            </div>

            {/* Progress */}
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

            {/* Controls */}
            <div className={styles.expandedControls}>
              <button
                className={`${styles.controlBtn} ${shuffle ? styles.active : ''}`}
                onClick={toggleShuffle}
              >
                <Shuffle size={20} />
              </button>
              <button className={styles.controlBtn} onClick={previous}>
                <SkipBack size={28} />
              </button>
              <button
                className={styles.playBtn}
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.spinner} />
                ) : isPlaying ? (
                  <Pause size={32} />
                ) : (
                  <Play size={32} />
                )}
              </button>
              <button className={styles.controlBtn} onClick={next}>
                <SkipForward size={28} />
              </button>
              <button
                className={`${styles.controlBtn} ${repeat !== 'off' ? styles.active : ''}`}
                onClick={toggleRepeat}
              >
                <RepeatIcon size={20} />
              </button>
            </div>

            {/* Extra Controls */}
            <div className={styles.extraControls}>
              <button 
                className={`${styles.extraBtn} ${showLyrics ? styles.active : ''}`}
                onClick={toggleLyrics}
              >
                <Mic2 size={20} />
                <span>Lyrics</span>
              </button>
              
              <div className={styles.speedControl}>
                <button 
                  className={styles.extraBtn}
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                >
                  <span>{playbackSpeed}x</span>
                </button>
                {showSpeedMenu && (
                  <div className={styles.speedMenu}>
                    {speedOptions.map(speed => (
                      <button
                        key={speed}
                        className={`${styles.speedOption} ${speed === playbackSpeed ? styles.activeSpeed : ''}`}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          setShowSpeedMenu(false);
                        }}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume */}
              <div className={styles.volumeSection}>
                <button className={styles.controlBtn} onClick={toggleMute}>
                  <VolumeIcon size={20} />
                </button>
                <div
                  ref={volumeRef}
                  className={styles.volumeSlider}
                  onClick={handleVolumeClick}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mini Player
  return (
    <div className={styles.player}>
      {/* Song Info */}
      <div className={styles.songInfo}>
        <div className={styles.artwork} onClick={toggleExpand}>
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
        <div className={styles.info} onClick={toggleExpand}>
          <span className={styles.title}>{currentSong.title}</span>
          <span className={styles.artist}>{currentSong.artist?.name || 'Unknown Artist'}</span>
        </div>
        <button className={styles.actionBtn} onClick={handleLike}>
          <Heart size={18} />
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
        <button className={styles.controlBtn} onClick={toggleQueue}>
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
            <div className={styles.volumeSliderContainer}>
              <div
                ref={volumeRef}
                className={styles.volumeSlider}
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

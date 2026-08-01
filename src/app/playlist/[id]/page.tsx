'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Shuffle, Heart, MoreHorizontal, Clock, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { usePlayer } from '@/context/PlayerContext';
import { Playlist, Song } from '@/types';
import styles from './playlist.module.css';

export default function PlaylistPage() {
  const params = useParams();
  const { playSongs, playSong, currentSong, isPlaying } = usePlayer();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaylist();
  }, [params.id]);

  const fetchPlaylist = async () => {
    try {
      const res = await fetch(`/api/playlists?id=${params.id}`);
      const data = await res.json();
      setPlaylist(data.playlist);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (playlist?.songs) {
      const songs = playlist.songs as unknown as Song[];
      playSongs(songs);
    }
  };

  const handleShuffle = () => {
    if (playlist?.songs) {
      const songs = playlist.songs as unknown as Song[];
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      playSongs(shuffled);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = playlist?.songs?.reduce((acc, song) => acc + (song as unknown as Song).duration, 0) || 0;

  if (isLoading) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        </main>
        <Player />
        <MobileNav />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.error}>Playlist not found</div>
        </main>
        <Player />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.coverArt}>
              <Image
                src={playlist.coverUrl || '/placeholder-playlist.jpg'}
                alt={playlist.title}
                width={232}
                height={232}
                className={styles.coverImage}
              />
            </div>
            <div className={styles.headerInfo}>
              <span className={styles.type}>PLAYLIST</span>
              <h1 className={styles.title}>{playlist.title}</h1>
              {playlist.description && (
                <p className={styles.description}>{playlist.description}</p>
              )}
              <div className={styles.meta}>
                <div className={styles.owner}>
                  <User size={16} />
                  {playlist.user?.name || 'Unknown'}
                </div>
                <span className={styles.dot}>•</span>
                <span>{playlist.songs?.length || 0} songs</span>
                <span className={styles.dot}>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.playBtn} onClick={handlePlay} disabled={!playlist.songs?.length}>
              <Play size={24} fill="currentColor" />
              Play
            </button>
            <button className={styles.shuffleBtn} onClick={handleShuffle} disabled={!playlist.songs?.length}>
              <Shuffle size={20} />
            </button>
            <button className={styles.iconBtn}>
              <Heart size={24} />
            </button>
            <button className={styles.iconBtn}>
              <MoreHorizontal size={24} />
            </button>
          </div>

          {/* Track List */}
          {playlist.songs && playlist.songs.length > 0 ? (
            <div className={styles.trackList}>
              <div className={styles.trackHeader}>
                <span className={styles.trackNum}>#</span>
                <span className={styles.trackTitle}>Title</span>
                <span className={styles.trackDuration}>
                  <Clock size={14} />
                </span>
              </div>
              {playlist.songs.map((song, i) => {
                const songData = song as unknown as Song;
                return (
                <div
                  key={songData.id}
                  className={`${styles.track} ${currentSong?.id === songData.id ? styles.active : ''}`}
                  onClick={() => playSongs(playlist.songs as unknown as Song[], i)}
                >
                  <span className={styles.trackNum}>
                    {currentSong?.id === songData.id && isPlaying ? (
                      <div className={styles.playingBars}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className={styles.trackInfo}>
                    <span className={styles.trackName}>{songData.title}</span>
                    <span className={styles.trackArtist}>{songData.artist?.name}</span>
                  </div>
                  <span className={styles.trackDuration}>
                    {formatDuration(songData.duration)}
                  </span>
                </div>
              )})}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>This playlist is empty</p>
            </div>
          )}
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

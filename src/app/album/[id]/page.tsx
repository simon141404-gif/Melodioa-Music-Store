'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Shuffle, Heart, MoreHorizontal, Clock, Disc } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { usePlayer } from '@/context/PlayerContext';
import { Album, Song } from '@/types';
import styles from './album.module.css';

export default function AlbumPage() {
  const params = useParams();
  const { playSongs, playSong, currentSong, isPlaying } = usePlayer();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbum();
  }, [params.id]);

  const fetchAlbum = async () => {
    try {
      const res = await fetch(`/api/albums?id=${params.id}`);
      const data = await res.json();
      setAlbum(data.album);
    } catch (error) {
      console.error('Failed to fetch album:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (album?.songs) {
      playSongs(album.songs);
    }
  };

  const handleShuffle = () => {
    if (album?.songs) {
      const shuffled = [...album.songs].sort(() => Math.random() - 0.5);
      playSongs(shuffled);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = album?.songs?.reduce((acc, song) => acc + song.duration, 0) || 0;

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

  if (!album) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.error}>Album not found</div>
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
                src={album.coverUrl || '/placeholder-album.jpg'}
                alt={album.title}
                width={232}
                height={232}
                className={styles.coverImage}
              />
            </div>
            <div className={styles.headerInfo}>
              <span className={styles.type}>ALBUM</span>
              <h1 className={styles.title}>{album.title}</h1>
              <div className={styles.meta}>
                <a href={`/artist/${album.artist?.id}`} className={styles.artist}>
                  {album.artist?.name}
                </a>
                <span className={styles.dot}>•</span>
                <span>{album.releaseYear}</span>
                <span className={styles.dot}>•</span>
                <span>{album.songs?.length || 0} songs</span>
                <span className={styles.dot}>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.playBtn} onClick={handlePlay}>
              <Play size={24} fill="currentColor" />
              Play
            </button>
            <button className={styles.shuffleBtn} onClick={handleShuffle}>
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
          <div className={styles.trackList}>
            <div className={styles.trackHeader}>
              <span className={styles.trackNum}>#</span>
              <span className={styles.trackTitle}>Title</span>
              <span className={styles.trackDuration}>
                <Clock size={14} />
              </span>
            </div>
            {album.songs?.map((song, i) => (
              <div
                key={song.id}
                className={`${styles.track} ${currentSong?.id === song.id ? styles.active : ''}`}
                onClick={() => playSongs(album.songs!, i)}
              >
                <span className={styles.trackNum}>
                  {currentSong?.id === song.id && isPlaying ? (
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
                  <span className={styles.trackName}>{song.title}</span>
                  <span className={styles.trackArtist}>{album.artist?.name}</span>
                </div>
                <span className={styles.trackDuration}>
                  {formatDuration(song.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

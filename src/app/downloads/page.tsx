'use client';

import React, { useState } from 'react';
import { Download, Music, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import { Song } from '@/types';
import styles from './downloads.module.css';

export default function DownloadsPage() {
  const { user } = useAuth();
  const { playSongs } = usePlayer();
  const [downloads, setDownloads] = useState<any[]>([
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', duration: 200, addedAt: new Date() },
    { id: '2', title: 'Shape of You', artist: 'Ed Sheeran', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e5a5e5d4c5e5d4c5e5d4c5e5d4', duration: 234, addedAt: new Date() },
    { id: '3', title: 'Anti-Hero', artist: 'Taylor Swift', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d4a5e5d4c5e5d4c5e5d4c5e5d4', duration: 200, addedAt: new Date() },
  ]);

  const removeDownload = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.error}>
              <h1>Please sign in to view downloads</h1>
            </div>
          </div>
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
          <header className={styles.header}>
            <h1>Your Downloads</h1>
            <p>Listen offline anywhere</p>
          </header>

          {downloads.length === 0 ? (
            <div className={styles.empty}>
              <Download size={64} />
              <h2>No downloads yet</h2>
              <p>Download songs to listen offline</p>
            </div>
          ) : (
            <div className={styles.downloadList}>
              {downloads.map((song) => (
                <div key={song.id} className={styles.downloadItem}>
                  <div className={styles.cover}>
                    <img src={song.coverUrl} alt={song.title} />
                    <div className={styles.playOverlay}>
                      <Music size={24} />
                    </div>
                  </div>
                  <div className={styles.info}>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                    <span className={styles.duration}>{formatDuration(song.duration)}</span>
                  </div>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeDownload(song.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Player />
      <MobileNav />
    </div>
  );
}

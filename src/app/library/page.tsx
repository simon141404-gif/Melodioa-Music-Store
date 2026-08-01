'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Heart, Disc, User, ListMusic, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import PlaylistCard from '@/components/PlaylistCard';
import { usePlayer } from '@/context/PlayerContext';
import { Playlist, Song } from '@/types';
import styles from './library.module.css';

function LibraryContent() {
  const searchParams = useSearchParams();
  const { playSongs } = usePlayer();
  const [activeTab, setActiveTab] = useState('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'liked') {
      setActiveTab('liked');
    } else if (tab === 'albums') {
      setActiveTab('albums');
    } else if (tab === 'artists') {
      setActiveTab('artists');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'playlists') {
        const res = await fetch('/api/playlists');
        const data = await res.json();
        setPlaylists(data.playlists || []);
      } else if (activeTab === 'liked') {
        const res = await fetch('/api/likes');
        const data = await res.json();
        setLikedSongs(data.songs || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayLiked = () => {
    if (likedSongs.length > 0) {
      playSongs(likedSongs);
    }
  };

  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'artists', label: 'Artists', icon: User },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Your Library</h1>
          </header>

          {/* Tabs */}
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <>
              {activeTab === 'playlists' && (
                <>
                  <button className={styles.createBtn}>
                    <Plus size={20} />
                    Create Playlist
                  </button>
                  {playlists.length > 0 ? (
                    <div className={styles.grid}>
                      {playlists.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      <ListMusic size={48} />
                      <h3>No playlists yet</h3>
                      <p>Create your first playlist to start organizing your music</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'liked' && (
                <>
                  {likedSongs.length > 0 && (
                    <div className={styles.likedHeader}>
                      <div className={styles.likedArt}>
                        <Heart size={32} />
                      </div>
                      <div className={styles.likedInfo}>
                        <span className={styles.likedLabel}>Liked Songs</span>
                        <span className={styles.likedCount}>{likedSongs.length} songs</span>
                      </div>
                      <button className={styles.playBtn} onClick={handlePlayLiked}>
                        Play All
                      </button>
                    </div>
                  )}
                  {likedSongs.length > 0 ? (
                    <div className={styles.songList}>
                      {likedSongs.map((song, i) => (
                        <div
                          key={song.id}
                          className={styles.songItem}
                          onClick={() => playSongs(likedSongs, i)}
                        >
                          <span className={styles.songIndex}>{i + 1}</span>
                          <div className={styles.songInfo}>
                            <span className={styles.songTitle}>{song.title}</span>
                            <span className={styles.songArtist}>{song.artist?.name}</span>
                          </div>
                          <span className={styles.songAlbum}>{song.album?.title}</span>
                          <span className={styles.songDuration}>
                            <Clock size={14} />
                            {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      <Heart size={48} />
                      <h3>No liked songs</h3>
                      <p>Songs you like will appear here</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'albums' && (
                <div className={styles.empty}>
                  <Disc size={48} />
                  <h3>No albums yet</h3>
                  <p>Albums you follow will appear here</p>
                </div>
              )}

              {activeTab === 'artists' && (
                <div className={styles.empty}>
                  <User size={48} />
                  <h3>No artists yet</h3>
                  <p>Artists you follow will appear here</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}


export default function LibraryPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><div className={styles.spinner}></div></div>}>
      <LibraryContent />
    </Suspense>
  );
}


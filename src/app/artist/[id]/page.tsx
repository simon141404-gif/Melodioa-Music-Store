'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Shuffle, Heart, Check } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import AlbumCard from '@/components/AlbumCard';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import { Artist, Song } from '@/types';
import styles from './artist.module.css';

export default function ArtistPage() {
  const params = useParams();
  const { playSongs } = usePlayer();
  const { user } = useAuth();
  const [artist, setArtist] = useState<Artist & { followerCount?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchArtist();
  }, [params.id]);

  const fetchArtist = async () => {
    try {
      const res = await fetch(`/api/artists?id=${params.id}`);
      const data = await res.json();
      setArtist(data.artist);
    } catch (error) {
      console.error('Failed to fetch artist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    const allSongs = artist?.albums?.flatMap(album => album.songs || []) || [];
    if (allSongs.length > 0) {
      playSongs(allSongs);
    }
  };

  const handleShuffle = () => {
    const allSongs = artist?.albums?.flatMap(album => album.songs || []) || [];
    const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      playSongs(shuffled);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

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

  if (!artist) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.error}>Artist not found</div>
        </main>
        <Player />
        <MobileNav />
      </div>
    );
  }

  const allSongs = artist.albums?.flatMap(album => album.songs || []) || [];
  const popularSongs = allSongs.sort((a, b) => b.plays - a.plays).slice(0, 5);

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.imageWrapper}>
              <Image
                src={artist.imageUrl || '/placeholder-artist.jpg'}
                alt={artist.name}
                width={232}
                height={232}
                className={styles.image}
              />
            </div>
            <div className={styles.headerInfo}>
              <span className={styles.type}>ARTIST</span>
              <h1 className={styles.name}>{artist.name}</h1>
              <div className={styles.meta}>
                <span>{artist.followerCount || 0} followers</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.playBtn} onClick={handlePlay} disabled={allSongs.length === 0}>
              <Play size={24} fill="currentColor" />
              Play
            </button>
            <button className={styles.shuffleBtn} onClick={handleShuffle} disabled={allSongs.length === 0}>
              <Shuffle size={20} />
            </button>
            <button className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`} onClick={handleFollow}>
              {isFollowing ? <Check size={20} /> : 'Follow'}
            </button>
          </div>

          {/* Popular */}
          {popularSongs.length > 0 && (
            <section className={styles.section}>
              <h2>Popular</h2>
              <div className={styles.popularList}>
                {popularSongs.map((song, i) => (
                  <div
                    key={song.id}
                    className={styles.popularItem}
                    onClick={() => playSongs(popularSongs, i)}
                  >
                    <span className={styles.popularIndex}>{i + 1}</span>
                    <div className={styles.popularArt}></div>
                    <div className={styles.popularInfo}>
                      <span className={styles.popularTitle}>{song.title}</span>
                      <span className={styles.popularPlays}>{song.plays.toLocaleString()} plays</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {artist.albums && artist.albums.length > 0 && (
            <section className={styles.section}>
              <h2>Albums</h2>
              <div className={styles.albumGrid}>
                {artist.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* About */}
          {artist.bio && (
            <section className={styles.section}>
              <h2>About</h2>
              <div className={styles.about}>
                <p>{artist.bio}</p>
              </div>
            </section>
          )}
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, TrendingUp, Sparkles } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import AlbumCard from '@/components/AlbumCard';
import PlaylistCard from '@/components/PlaylistCard';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import { Album, Playlist, Song } from '@/types';
import styles from './home.module.css';

export default function HomePage() {
  const { user } = useAuth();
  const { playSongs } = usePlayer();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySection = (songs: Song[], index = 0) => {
    playSongs(songs, index);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Header */}
          <header className={styles.header}>
            <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Listener'}</h1>
          </header>

          {/* Quick Play Cards */}
          <section className={styles.quickPlay}>
            <div className={styles.quickCard} onClick={() => handlePlaySection(recommendations?.madeForYou || [])}>
              <div className={styles.quickIcon}>
                <Sparkles size={24} />
              </div>
              <span>Made For You</span>
            </div>
            <div className={styles.quickCard} onClick={() => handlePlaySection(recommendations?.topCharts || [])}>
              <div className={styles.quickIcon}>
                <TrendingUp size={24} />
              </div>
              <span>Top Charts</span>
            </div>
            <div className={styles.quickCard}>
              <div className={styles.quickIcon}>
                <Clock size={24} />
              </div>
              <span>Recently Played</span>
            </div>
          </section>

          {/* Made For You */}
          {recommendations?.madeForYou && recommendations.madeForYou.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Made For You</h2>
                <button className={styles.seeAll}>See all</button>
              </div>
              <div className={styles.cardGrid}>
                {recommendations.madeForYou.slice(0, 5).map((song: Song, i: number) => (
                  <div key={song.id} className={styles.recommendationCard} onClick={() => handlePlaySection(recommendations.madeForYou, i)}>
                    <div className={styles.recImage}>
                      <div className={styles.playOverlay}>
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                    <div className={styles.recInfo}>
                      <span className={styles.recTitle}>{song.title}</span>
                      <span className={styles.recArtist}>{song.artist?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* New Releases */}
          {recommendations?.newReleases && recommendations.newReleases.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>New Releases</h2>
                <button className={styles.seeAll}>See all</button>
              </div>
              <div className={styles.albumGrid}>
                {recommendations.newReleases.map((album: Album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* Featured Playlists */}
          {recommendations?.featuredPlaylists && recommendations.featuredPlaylists.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Featured Playlists</h2>
                <button className={styles.seeAll}>See all</button>
              </div>
              <div className={styles.playlistGrid}>
                {recommendations.featuredPlaylists.map((playlist: Playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}

          {/* Top Charts */}
          {recommendations?.topCharts && recommendations.topCharts.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Top Charts</h2>
                <button className={styles.seeAll}>See all</button>
              </div>
              <div className={styles.chartList}>
                {recommendations.topCharts.slice(0, 5).map((song: Song, i: number) => (
                  <div key={song.id} className={styles.chartItem} onClick={() => handlePlaySection(recommendations.topCharts, i)}>
                    <span className={styles.chartIndex}>{i + 1}</span>
                    <div className={styles.chartArt}></div>
                    <div className={styles.chartInfo}>
                      <span className={styles.chartTitle}>{song.title}</span>
                      <span className={styles.chartArtist}>{song.artist?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Genres */}
          {recommendations?.genres && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Browse by Genre</h2>
              </div>
              <div className={styles.genreGrid}>
                {recommendations.genres.map((genre: string, i: number) => (
                  <div key={i} className={styles.genreCard}>
                    <span>{genre}</span>
                  </div>
                ))}
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

'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Music, User, Disc, ListMusic } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { usePlayer } from '@/context/PlayerContext';
import { Song, Artist, Album, Playlist } from '@/types';
import styles from './search.module.css';

export default function SearchPage() {
  const { playSongs } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ songs: Song[]; artists: Artist[]; albums: Album[]; playlists: Playlist[] }>({
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Get initial query from URL
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults({ songs: [], artists: [], albums: [], playlists: [] });
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults({
          songs: data.songs || [],
          artists: data.artists || [],
          albums: data.albums || [],
          playlists: data.playlists || []
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults({ songs: [], artists: [], albums: [], playlists: [] });
  };

  const handlePlaySong = (songs: Song[], index: number) => {
    playSongs(songs, index);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ];

  const hasResults = results.songs.length > 0 || results.artists.length > 0 || results.albums.length > 0 || results.playlists.length > 0;

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className={styles.searchInput}
            />
            {query && (
              <button className={styles.clearBtn} onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {isSearching ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : !hasResults && query.length >= 2 ? (
            <div className={styles.empty}>
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          ) : query.length < 2 ? (
            <div className={styles.empty}>
              <Search size={48} />
              <h3>Search for music</h3>
              <p>Find your favorite songs, artists, albums, and playlists</p>
            </div>
          ) : (
            <div className={styles.results}>
              {/* Songs */}
              {(activeTab === 'all' || activeTab === 'songs') && results.songs.length > 0 && (
                <section className={styles.section}>
                  <h2>Songs</h2>
                  <div className={styles.songList}>
                    {results.songs.map((song, i) => (
                      <div
                        key={song.id}
                        className={styles.songItem}
                        onClick={() => handlePlaySong(results.songs, i)}
                      >
                        <div className={styles.songArt}>
                          <Music size={16} />
                        </div>
                        <div className={styles.songInfo}>
                          <span className={styles.songTitle}>{song.title}</span>
                          <span className={styles.songArtist}>{song.artist?.name}</span>
                        </div>
                        <span className={styles.songAlbum}>{song.album?.title}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Artists */}
              {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
                <section className={styles.section}>
                  <h2>Artists</h2>
                  <div className={styles.artistGrid}>
                    {results.artists.map((artist) => (
                      <a key={artist.id} href={`/artist/${artist.id}`} className={styles.artistCard}>
                        <div className={styles.artistImage}>
                          <User size={32} />
                        </div>
                        <span className={styles.artistName}>{artist.name}</span>
                        <span className={styles.artistType}>Artist</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Albums */}
              {(activeTab === 'all' || activeTab === 'albums') && results.albums.length > 0 && (
                <section className={styles.section}>
                  <h2>Albums</h2>
                  <div className={styles.albumGrid}>
                    {results.albums.map((album) => (
                      <a key={album.id} href={`/album/${album.id}`} className={styles.albumCard}>
                        <div className={styles.albumImage}>
                          <Disc size={32} />
                        </div>
                        <span className={styles.albumTitle}>{album.title}</span>
                        <span className={styles.albumArtist}>{album.artist?.name}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Playlists */}
              {(activeTab === 'all' || activeTab === 'playlists') && results.playlists.length > 0 && (
                <section className={styles.section}>
                  <h2>Playlists</h2>
                  <div className={styles.playlistGrid}>
                    {results.playlists.map((playlist) => (
                      <a key={playlist.id} href={`/playlist/${playlist.id}`} className={styles.playlistCard}>
                        <div className={styles.playlistImage}>
                          <ListMusic size={32} />
                        </div>
                        <span className={styles.playlistTitle}>{playlist.title}</span>
                        <span className={styles.playlistDesc}>{playlist.description || 'Playlist'}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Users, Music, Disc, Radio, Play, TrendingUp } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

interface Stats {
  totalUsers: number;
  totalArtists: number;
  totalAlbums: number;
  totalSongs: number;
  totalStreams: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalArtists: 0,
    totalAlbums: 0,
    totalSongs: 0,
    totalStreams: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentStreams, setRecentStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.stats) {
        setStats({
          totalUsers: data.stats.totalUsers || 0,
          totalArtists: data.stats.totalArtists || 0,
          totalAlbums: data.stats.totalAlbums || 0,
          totalSongs: data.stats.totalSongs || 0,
          totalStreams: data.stats.totalStreams || 0
        });
      }
      setRecentUsers(data.recentUsers || []);
      setRecentStreams(data.recentStreams || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.unauthorized}>
              <h1>Access Denied</h1>
              <p>You do not have permission to access this page.</p>
            </div>
          </div>
        </main>
        <Player />
        <MobileNav />
      </div>
    );
  }

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

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#7c3aed' },
    { icon: Music, label: 'Total Artists', value: stats.totalArtists, color: '#ec4899' },
    { icon: Disc, label: 'Total Albums', value: stats.totalAlbums, color: '#10b981' },
    { icon: Radio, label: 'Total Songs', value: stats.totalSongs, color: '#f59e0b' },
    { icon: Play, label: 'Total Streams', value: stats.totalStreams, color: '#3b82f6' },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Admin Dashboard</h1>
          </header>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {statCards.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stat.value.toLocaleString()}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {/* Recent Users */}
            <section className={styles.section}>
              <h2>Recent Users</h2>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Plan</span>
                </div>
                {recentUsers.map((user) => (
                  <div key={user.id} className={styles.tableRow}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span className={styles.badge}>{user.role}</span>
                    <span className={`${styles.badge} ${user.premiumStatus === 'premium' ? styles.premium : styles.free}`}>
                      {user.premiumStatus}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Streams */}
            <section className={styles.section}>
              <h2>Recent Streams</h2>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Song</span>
                  <span>Artist</span>
                  <span>Time</span>
                </div>
                {recentStreams.map((stream, i) => (
                  <div key={i} className={styles.tableRow}>
                    <span>{stream.songTitle}</span>
                    <span>{stream.artistName}</span>
                    <span>{new Date(stream.playedAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section className={styles.section}>
            <h2>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <button className={styles.actionBtn}>
                <Users size={20} />
                Manage Users
              </button>
              <button className={styles.actionBtn}>
                <Music size={20} />
                Add Song
              </button>
              <button className={styles.actionBtn}>
                <Disc size={20} />
                Add Album
              </button>
              <button className={styles.actionBtn}>
                <Radio size={20} />
                Add Artist
              </button>
            </div>
          </section>
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Search, Library, PlusCircle, Heart, 
  Download, Sparkles, Settings, LogOut, Music
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './GlassNavigation.module.css';

export default function GlassNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mainLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/library', icon: Library, label: 'Library' },
  ];

  const libraryLinks = [
    { href: '/library?tab=playlists', icon: PlusCircle, label: 'Create Playlist' },
    { href: '/library?tab=liked', icon: Heart, label: 'Liked Songs' },
    { href: '/downloads', icon: Download, label: 'Downloads' },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '?');

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/home" className={styles.logoLink}>
          <Music className={styles.logoIcon} />
          <span>Melodia</span>
        </Link>
      </div>

      <div className={styles.section}>
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive(link.href) ? styles.active : ''}`}
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Your Library</div>
        {libraryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive(link.href) ? styles.active : ''}`}
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Admin</div>
          <Link href="/admin" className={`${styles.link} ${isActive('/admin') ? styles.active : ''}`}>
            <Sparkles size={20} />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      )}

      <div className={styles.footer}>
        <Link href="/premium" className={styles.premiumLink}>
          <Sparkles size={18} />
          <span>Premium</span>
        </Link>
        
        <Link href="/settings" className={`${styles.link} ${isActive('/settings') ? styles.active : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
}

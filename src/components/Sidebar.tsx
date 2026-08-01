'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Library, 
  PlusSquare, 
  Heart,
  Music,
  Download,
  Settings,
  Crown,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const mainLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/library', icon: Library, label: 'Library' },
  ];

  const libraryLinks = [
    { href: '/library?tab=playlists', icon: PlusSquare, label: 'Create Playlist' },
    { href: '/library?tab=liked', icon: Heart, label: 'Liked Songs' },
    { href: '/downloads', icon: Download, label: 'Downloads' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/home">
          <Music className={styles.logoIcon} />
          <span className={styles.logoText}>Melodia</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              <link.icon className={styles.navIcon} />
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
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              <link.icon className={styles.navIcon} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {user?.premiumStatus === 'premium' && (
          <div className={styles.section}>
            <Link href="/premium" className={styles.navLink}>
              <Crown className={styles.navIcon} />
              <span>Premium</span>
            </Link>
          </div>
        )}
      </nav>

      <div className={styles.bottomSection}>
        {user?.role === 'admin' && (
          <Link href="/admin" className={styles.navLink}>
            <Settings className={styles.navIcon} />
            <span>Admin Dashboard</span>
          </Link>
        )}

        <button onClick={toggleTheme} className={styles.navLink}>
          <Settings className={styles.navIcon} />
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <Link href="/settings" className={styles.navLink}>
          <User className={styles.navIcon} />
          <span>Settings</span>
        </Link>

        {user && (
          <button onClick={logout} className={styles.navLink}>
            <LogOut className={styles.navIcon} />
            <span>Log Out</span>
          </button>
        )}

        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <p>© 2024 Melodia. All rights reserved.</p>
          <p>Created by Shawon Haque</p>
        </div>
      </div>
    </aside>
  );
}

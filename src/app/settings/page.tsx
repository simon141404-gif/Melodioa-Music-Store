'use client';

import React from 'react';
import { User, Music, Bell, Lock, Palette, CreditCard } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const settingsSections = [
    { icon: User, label: 'Account', description: 'Profile, email, and password' },
    { icon: Music, label: 'Playback', description: 'Quality, autoplay, and crossfade' },
    { icon: Bell, label: 'Notifications', description: 'Email and push notifications' },
    { icon: Palette, label: 'Appearance', description: 'Theme and display options' },
    { icon: Lock, label: 'Privacy', description: 'Data and visibility settings' },
    { icon: CreditCard, label: 'Subscription', description: 'Manage your plan and billing' },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Settings</h1>
          </header>

          <div className={styles.grid}>
            {/* Account Section */}
            <section className={styles.section}>
              <h2>Account</h2>
              <div className={styles.card}>
                <div className={styles.profile}>
                  <div className={styles.avatar}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className={styles.profileInfo}>
                    <span className={styles.name}>{user?.name}</span>
                    <span className={styles.email}>{user?.email}</span>
                  </div>
                </div>
                <div className={styles.badge}>
                  {user?.premiumStatus === 'premium' ? 'Premium' : 'Free'} Plan
                </div>
              </div>
            </section>

            {/* Appearance Section */}
            <section className={styles.section}>
              <h2>Appearance</h2>
              <div className={styles.card}>
                <div className={styles.setting}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Theme</span>
                    <span className={styles.settingDesc}>Choose your preferred theme</span>
                  </div>
                  <div className={styles.themeToggle}>
                    <button
                      className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                      onClick={() => toggleTheme()}
                    >
                      Light
                    </button>
                    <button
                      className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                      onClick={() => toggleTheme()}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Settings List */}
            <section className={styles.section}>
              <h2>More Settings</h2>
              <div className={styles.settingsList}>
                {settingsSections.map((item, i) => (
                  <div key={i} className={styles.settingItem}>
                    <div className={styles.settingIcon}>
                      <item.icon size={20} />
                    </div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>{item.label}</span>
                      <span className={styles.settingDesc}>{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Danger Zone */}
            <section className={styles.section}>
              <h2>Danger Zone</h2>
              <div className={styles.card}>
                <div className={styles.dangerItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Delete Account</span>
                    <span className={styles.settingDesc}>Permanently delete your account and all data</span>
                  </div>
                  <button className={styles.dangerBtn}>Delete Account</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

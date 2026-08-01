'use client';

import React, { useState } from 'react';
import { User, Music, Bell, Lock, Palette, CreditCard, ChevronRight, Save, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import MobileNav from '@/components/MobileNav';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './settings.module.css';

type SettingsTab = 'account' | 'playback' | 'notifications' | 'appearance' | 'privacy' | 'subscription';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [autoPlay, setAutoPlay] = useState(true);
  const [crossfade, setCrossfade] = useState(3);
  const [quality, setQuality] = useState('high');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleSave = () => {
    // Save settings - in a real app this would call an API
    alert('Settings saved!');
    setActiveTab(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Account Settings</h2>
              <button className={styles.closeBtn} onClick={() => setActiveTab(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Playback Settings</h2>
              <button className={styles.closeBtn} onClick={() => setActiveTab(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Streaming Quality</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="low">Low (96 kbps)</option>
                  <option value="medium">Medium (160 kbps)</option>
                  <option value="high">High (320 kbps)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Crossfade</label>
                <select value={crossfade} onChange={(e) => setCrossfade(Number(e.target.value))}>
                  <option value={0}>Off</option>
                  <option value={3}>3 seconds</option>
                  <option value={6}>6 seconds</option>
                  <option value={12}>12 seconds</option>
                </select>
              </div>
              <div className={styles.toggleGroup}>
                <label>Auto-play</label>
                <button 
                  className={`${styles.toggle} ${autoPlay ? styles.active : ''}`}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  {autoPlay ? 'On' : 'Off'}
                </button>
              </div>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Notification Settings</h2>
              <button className={styles.closeBtn} onClick={() => setActiveTab(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.form}>
              <div className={styles.toggleGroup}>
                <label>Email Notifications</label>
                <button 
                  className={`${styles.toggle} ${emailNotifs ? styles.active : ''}`}
                  onClick={() => setEmailNotifs(!emailNotifs)}
                >
                  {emailNotifs ? 'On' : 'Off'}
                </button>
              </div>
              <div className={styles.toggleGroup}>
                <label>Push Notifications</label>
                <button 
                  className={`${styles.toggle} ${pushNotifs ? styles.active : ''}`}
                  onClick={() => setPushNotifs(!pushNotifs)}
                >
                  {pushNotifs ? 'On' : 'Off'}
                </button>
              </div>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Privacy Settings</h2>
              <button className={styles.closeBtn} onClick={() => setActiveTab(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.form}>
              <div className={styles.toggleGroup}>
                <label>Private Profile</label>
                <button 
                  className={`${styles.toggle} ${privateProfile ? styles.active : ''}`}
                  onClick={() => setPrivateProfile(!privateProfile)}
                >
                  {privateProfile ? 'On' : 'Off'}
                </button>
              </div>
              <p className={styles.hint}>When enabled, only you can see your listening activity</p>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Subscription</h2>
              <button className={styles.closeBtn} onClick={() => setActiveTab(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.subscriptionCard}>
              <div className={styles.planInfo}>
                <h3>Current Plan</h3>
                <p className={styles.planName}>{user?.premiumStatus === 'premium' ? 'Premium' : 'Free'}</p>
                {user?.premiumStatus === 'premium' ? (
                  <p className={styles.planExpiry}>Expires: December 31, 2025</p>
                ) : (
                  <button className={styles.upgradeBtn}>Upgrade to Premium</button>
                )}
              </div>
              <div className={styles.planFeatures}>
                <h4>Premium Benefits:</h4>
                <ul>
                  <li>Ad-free listening</li>
                  <li>Offline downloads</li>
                  <li>High quality audio</li>
                  <li>Unlimited skips</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Settings</h1>
          </header>

          {activeTab ? (
            renderContent()
          ) : (
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
                  <div className={styles.settingItem} onClick={() => setActiveTab('account')}>
                    <div className={styles.settingIcon}><User size={20} /></div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Account</span>
                      <span className={styles.settingDesc}>Profile, email, and password</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                  <div className={styles.settingItem} onClick={() => setActiveTab('playback')}>
                    <div className={styles.settingIcon}><Music size={20} /></div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Playback</span>
                      <span className={styles.settingDesc}>Quality, autoplay, and crossfade</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                  <div className={styles.settingItem} onClick={() => setActiveTab('notifications')}>
                    <div className={styles.settingIcon}><Bell size={20} /></div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Notifications</span>
                      <span className={styles.settingDesc}>Email and push notifications</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                  <div className={styles.settingItem} onClick={() => setActiveTab('privacy')}>
                    <div className={styles.settingIcon}><Lock size={20} /></div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Privacy</span>
                      <span className={styles.settingDesc}>Data and visibility settings</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                  <div className={styles.settingItem} onClick={() => setActiveTab('subscription')}>
                    <div className={styles.settingIcon}><CreditCard size={20} /></div>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Subscription</span>
                      <span className={styles.settingDesc}>Manage your plan and billing</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
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
          )}
        </div>
      </main>

      <Player />
      <MobileNav />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Music, 
  Play, 
  SkipForward, 
  Zap, 
  Globe, 
  Download, 
  Star, 
  ChevronRight,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const features = [
    { icon: Zap, title: 'High Quality Audio', desc: 'Experience crystal clear sound with our premium audio streaming' },
    { icon: Globe, title: 'Global Music Library', desc: 'Access millions of songs from artists around the world' },
    { icon: Download, title: 'Offline Mode', desc: 'Download your favorite tracks and listen anywhere' },
    { icon: Star, title: 'Personalized Playlists', desc: 'AI-powered recommendations tailored to your taste' },
  ];

  const plans = [
    { name: 'Free', price: '$0', features: ['Ad-supported', 'Standard quality', 'Basic playlists'] },
    { name: 'Premium', price: '$9.99/mo', features: ['Ad-free', 'High quality', 'Offline mode', 'Unlimited skips'], popular: true },
    { name: 'Family', price: '$14.99/mo', features: ['All Premium features', '6 accounts', 'Family mix'], },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Music className={styles.logoIcon} />
          <span>Melodia</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/auth/login" className={styles.navLink}>Sign In</Link>
          <Link href="/auth/register" className={styles.cta}>Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradient1}></div>
          <div className={styles.gradient2}></div>
          <div className={styles.gradient3}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>Unlimited</span> Music,
            <br />Zero Limits
          </h1>
          <p className={styles.heroSubtitle}>
            Stream millions of songs, create your perfect playlists, and discover new favorites. 
            Your music journey starts here.
          </p>
          <div className={styles.heroActions}>
            <Link href="/auth/register" className={styles.primaryBtn}>
              <Play size={20} fill="currentColor" />
              Start Free Trial
            </Link>
            <Link href="/auth/login" className={styles.secondaryBtn}>
              <SkipForward size={20} />
              Sign In
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50M+</span>
              <span className={styles.statLabel}>Songs</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1M+</span>
              <span className={styles.statLabel}>Artists</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose Melodia?</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
        <div className={styles.pricingGrid}>
          {plans.map((plan, i) => (
            <div key={i} className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}>
              {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>{plan.price}</span>
              </div>
              <ul className={styles.features}>
                {plan.features.map((feature, j) => (
                  <li key={j}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href={plan.name === 'Free' ? '/auth/register' : '/premium'} 
                className={plan.popular ? styles.primaryBtn : styles.secondaryBtn}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Start Listening?</h2>
        <p>Join millions of music lovers today</p>
        <Link href="/auth/register" className={styles.primaryBtn}>
          Create Free Account
          <ChevronRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <Music className={styles.logoIcon} />
              <span>Melodia</span>
            </div>
            <p>Your music, your way.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Community</h4>
              <a href="#">Artists</a>
              <a href="#">Developers</a>
              <a href="#">Brand</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Useful Links</h4>
              <a href="#">Support</a>
              <a href="#">Web Player</a>
              <a href="#">Gift Cards</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Shawon Haque. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

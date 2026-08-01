'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, User } from 'lucide-react';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/library', icon: Library, label: 'Library' },
    { href: '/settings', icon: User, label: 'Profile' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${styles.link} ${isActive(link.href) ? styles.active : ''}`}
        >
          <link.icon className={styles.icon} />
          <span className={styles.label}>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

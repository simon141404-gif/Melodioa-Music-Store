'use client';

import React from 'react';

interface GlassNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassNavigation({ children, className = '' }: GlassNavigationProps) {
  return (
    <nav className={`glass-nav backdrop-blur-xl bg-white/10 dark:bg-black/20 border-b border-white/20 ${className}`}>
      {children}
    </nav>
  );
}

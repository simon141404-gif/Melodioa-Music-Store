'use client';

import React, { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 aurora-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-100 dark:to-background-900" />
      {children}
    </div>
  );
}

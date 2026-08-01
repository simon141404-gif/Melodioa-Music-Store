'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import styles from './PremiumCard.module.css';

interface PremiumCardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export default function PremiumCard({ 
  children, 
  title, 
  subtitle, 
  imageUrl,
  onClick,
  className = '' 
}: PremiumCardProps) {
  return (
    <div 
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={title || 'Card image'}
            fill
            className={styles.image}
          />
          <div className={styles.overlay} />
        </div>
      )}
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      <div className={styles.glow} />
    </div>
  );
}
